import { useState, useCallback, useRef } from 'react';
import { GLTFLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { FBXLoader } from 'three-stdlib';
import JSZip from 'jszip';
import {
  FileImportHookReturn,
  FileImportState,
  FileImportOptions,
  FileImportResult,
  FileImportError,
  SupportedFileType,
  SUPPORTED_FILE_TYPES,
} from './types/useFileImport.types';

const DEFAULT_OPTIONS: Required<FileImportOptions> = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: Object.keys(SUPPORTED_FILE_TYPES),
  onProgress: () => {},
  onError: () => {},
  onSuccess: () => {},
};

export const useFileImport = (
  options: FileImportOptions = {}
): FileImportHookReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [state, setState] = useState<FileImportState>({
    isLoading: false,
    progress: 0,
    error: null,
    results: [],
  });

  const loadersRef = useRef({
    gltf: new GLTFLoader(),
    glb: new GLTFLoader(),
    obj: new OBJLoader(),
    fbx: new FBXLoader(),
  });

  const updateState = useCallback((updates: Partial<FileImportState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const createError = useCallback(
    (
      message: string,
      code: string,
      fileName?: string,
      originalError?: Error
    ): FileImportError => ({
      message,
      code,
      fileName,
      originalError,
    }),
    []
  );

  const getFileType = useCallback(
    (fileName: string): SupportedFileType | null => {
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (!extension) return null;

      for (const [type, extensions] of Object.entries(SUPPORTED_FILE_TYPES)) {
        if (extensions.includes(extension)) {
          return type as SupportedFileType;
        }
      }
      return null;
    },
    []
  );

  const validateFile = useCallback(
    (file: File): FileImportError | null => {
      if (file.size > config.maxFileSize) {
        return createError(
          `文件大小超过限制 (${Math.round(config.maxFileSize / 1024 / 1024)}MB)`,
          'FILE_TOO_LARGE',
          file.name
        );
      }

      const fileType = getFileType(file.name);
      if (!fileType || !config.allowedTypes.includes(fileType)) {
        return createError(
          `不支持的文件类型: ${file.name}`,
          'UNSUPPORTED_FILE_TYPE',
          file.name
        );
      }

      return null;
    },
    [config.maxFileSize, config.allowedTypes, createError, getFileType]
  );

  const loadFile = useCallback(
    async (file: File): Promise<FileImportResult> => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const fileType = getFileType(file.name);

        if (!fileType) {
          reject(
            createError('无法确定文件类型', 'UNKNOWN_FILE_TYPE', file.name)
          );
          return;
        }

        const reader = new FileReader();
        const loader = loadersRef.current[fileType];

        reader.onload = event => {
          try {
            const arrayBuffer = event.target?.result as ArrayBuffer;

            if (fileType === 'gltf') {
              const decoder = new TextDecoder('utf-8');
              const jsonString = decoder.decode(arrayBuffer);
              loader.parse(
                jsonString,
                '',
                gltf => {
                  resolve({
                    object: gltf.scene,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType,
                    loadTime: Date.now() - startTime,
                  });
                },
                error => {
                  reject(
                    createError(
                      'GLTF 加载失败',
                      'GLTF_LOAD_ERROR',
                      file.name,
                      error as unknown as Error
                    )
                  );
                }
              );
            } else if (fileType === 'glb') {
              (loader as GLTFLoader).parse(
                arrayBuffer,
                '',
                gltf => {
                  resolve({
                    object: gltf.scene,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType,
                    loadTime: Date.now() - startTime,
                  });
                },
                error => {
                  reject(
                    createError(
                      'GLB 加载失败',
                      'GLB_LOAD_ERROR',
                      file.name,
                      error as unknown as Error
                    )
                  );
                }
              );
            } else if (fileType === 'obj') {
              const decoder = new TextDecoder('utf-8');
              const objString = decoder.decode(arrayBuffer);
              const object = (loader as OBJLoader).parse(objString);
              resolve({
                object,
                fileName: file.name,
                fileSize: file.size,
                fileType,
                loadTime: Date.now() - startTime,
              });
            } else if (fileType === 'fbx') {
              const object = (loader as FBXLoader).parse(arrayBuffer, '');
              resolve({
                object,
                fileName: file.name,
                fileSize: file.size,
                fileType,
                loadTime: Date.now() - startTime,
              });
            }
          } catch (error) {
            reject(
              createError(
                `文件解析失败: ${file.name}`,
                'PARSE_ERROR',
                file.name,
                error as Error
              )
            );
          }
        };

        reader.onerror = () => {
          reject(
            createError(
              '文件读取失败',
              'FILE_READ_ERROR',
              file.name,
              new Error('FileReader error')
            )
          );
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [getFileType, createError]
  );

  const extractZipFiles = useCallback(
    async (file: File): Promise<File[]> => {
      const zip = new JSZip();
      const arrayBuffer = await file.arrayBuffer();
      const zipData = await zip.loadAsync(arrayBuffer);
      const extractedFiles: File[] = [];

      for (const [fileName, zipEntry] of Object.entries(zipData.files)) {
        if (!zipEntry.dir && getFileType(fileName)) {
          const blob = await zipEntry.async('blob');
          const extractedFile = new File([blob], fileName, { type: blob.type });
          extractedFiles.push(extractedFile);
        }
      }

      return extractedFiles;
    },
    [getFileType]
  );

  const processFiles = useCallback(
    async (files: File[]): Promise<FileImportResult[]> => {
      const results: FileImportResult[] = [];
      let processedCount = 0;

      for (const file of files) {
        try {
          let filesToProcess: File[] = [];

          if (file.name.toLowerCase().endsWith('.zip')) {
            filesToProcess = await extractZipFiles(file);
          } else {
            filesToProcess = [file];
          }

          for (const processFile of filesToProcess) {
            const validationError = validateFile(processFile);
            if (validationError) {
              config.onError(validationError);
              continue;
            }

            const result = await loadFile(processFile);
            results.push(result);
            config.onSuccess(result);
          }
        } catch (error) {
          const fileError = error as FileImportError;
          config.onError(fileError);
        }

        processedCount++;
        const progress = (processedCount / files.length) * 100;
        updateState({ progress });
        config.onProgress(progress);
      }

      return results;
    },
    [validateFile, loadFile, extractZipFiles, config, updateState]
  );

  const uploadFiles = useCallback(
    async (files: FileList | File[]): Promise<FileImportResult[]> => {
      const fileArray = Array.from(files);

      updateState({
        isLoading: true,
        progress: 0,
        error: null,
        results: [],
      });

      try {
        const results = await processFiles(fileArray);
        updateState({
          isLoading: false,
          progress: 100,
          results: [...state.results, ...results],
        });
        return results;
      } catch (error) {
        const fileError = createError(
          '批量文件处理失败',
          'BATCH_PROCESS_ERROR',
          undefined,
          error as Error
        );
        updateState({
          isLoading: false,
          error: fileError,
        });
        config.onError(fileError);
        throw fileError;
      }
    },
    [processFiles, state.results, updateState, createError, config]
  );

  const importFromUrl = useCallback(
    async (url: string): Promise<FileImportResult> => {
      updateState({
        isLoading: true,
        progress: 0,
        error: null,
      });

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const fileName = url.split('/').pop() || 'unknown';
        const arrayBuffer = await response.arrayBuffer();
        const file = new File([arrayBuffer], fileName);

        const validationError = validateFile(file);
        if (validationError) {
          throw validationError;
        }

        const result = await loadFile(file);

        updateState({
          isLoading: false,
          progress: 100,
          results: [...state.results, result],
        });

        config.onSuccess(result);
        return result;
      } catch (error) {
        const urlError = createError(
          `URL 导入失败: ${url}`,
          'URL_IMPORT_ERROR',
          url,
          error as Error
        );
        updateState({
          isLoading: false,
          error: urlError,
        });
        config.onError(urlError);
        throw urlError;
      }
    },
    [validateFile, loadFile, state.results, updateState, createError, config]
  );

  const dragDropHandlers = {
    onDragEnter: useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    }, []),

    onDragLeave: useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    }, []),

    onDragOver: useCallback((event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    }, []),

    onDrop: useCallback(
      async (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer.files;
        if (files.length > 0) {
          await uploadFiles(files);
        }
      },
      [uploadFiles]
    ),
  };

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      progress: 0,
      error: null,
      results: [],
    });
  }, []);

  return {
    state,
    uploadFiles,
    importFromUrl,
    dragDropHandlers,
    reset,
  };
};
