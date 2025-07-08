import { useState, useCallback } from 'react';
import { GLTFLoader, OBJLoader, FBXLoader } from 'three-stdlib';
import JSZip from 'jszip';
import {
  FileImportHookReturn,
  FileImportState,
  FileImportOptions,
  FileImportResult,
  FileImportError,
  SupportedFileType,
  SUPPORTED_FILE_TYPES,
} from './types';

/**
 * 默认文件导入配置选项
 * @author Cerror
 * @since 2025-07-08 */
const DEFAULT_OPTIONS: Required<FileImportOptions> = {
  maxFileSize: 50 * 1024 * 1024, // 50MB 最大文件大小限制
  allowedTypes: Object.keys(SUPPORTED_FILE_TYPES), // 允许的文件类型
  onProgress: () => {}, // 进度回调函数
  onError: () => {}, // 错误回调函数
  onSuccess: () => {}, // 成功回调函数
};

/**
 * React Three Fiber 文件导入 Hook
 * 提供3D模型文件导入功能，支持 GLB、GLTF、OBJ、FBX 格式和 ZIP 压缩包
 * @param options 导入配置选项
 * @returns 文件导入状态和操作方法
 */
export const useR3FFileImport = (
  options: FileImportOptions = {}
): FileImportHookReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [state, setState] = useState<FileImportState>({
    isLoading: false,
    progress: 0,
    error: null,
    results: [],
  });

  /**
   * 更新导入状态
   * @param updates 要更新的状态字段
   */
  const updateState = useCallback((updates: Partial<FileImportState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 创建错误对象
   * @param message 错误消息
   * @param code 错误代码
   * @param fileName 文件名（可选）
   * @param originalError 原始错误对象（可选）
   * @returns 格式化的错误对象
   */
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

  /**
   * 获取文件类型
   * @param fileName 文件名
   * @returns 支持的文件类型或null
   */
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

  /**
   * 验证文件是否符合导入要求
   * @param file 要验证的文件
   * @returns 验证错误或null（通过验证）
   */
  const validateFile = useCallback(
    (file: File): FileImportError | null => {
      // 检查文件大小限制
      if (file.size > config.maxFileSize) {
        return createError(
          `文件大小超过限制 (${Math.round(config.maxFileSize / 1024 / 1024)}MB)`,
          'FILE_TOO_LARGE',
          file.name
        );
      }

      // 检查文件类型是否支持
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

  /**
   * 使用 React Three Fiber 加载文件
   * @param file 要加载的文件
   * @returns Promise 返回加载结果
   */
  const loadFile = useCallback(
    async (file: File): Promise<FileImportResult> => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const fileType = getFileType(file.name);
        
        if (!fileType) {
          reject(createError('无法确定文件类型', 'UNKNOWN_FILE_TYPE', file.name));
          return;
        }

        const reader = new FileReader();
        
        // 读取文件完成后的处理
        reader.onload = (event) => {
          try {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            
            // 根据文件类型使用对应的加载器
            if (fileType === 'gltf') {
              const decoder = new TextDecoder('utf-8');
              const jsonString = decoder.decode(arrayBuffer);
              const loader = new GLTFLoader();
              
              loader.parse(
                jsonString,
                '',
                (gltf) => {
                  resolve({
                    object: gltf.scene,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType,
                    loadTime: Date.now() - startTime,
                  });
                },
                (error) => {
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
              const loader = new GLTFLoader();
              
              loader.parse(
                arrayBuffer,
                '',
                (gltf) => {
                  resolve({
                    object: gltf.scene,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType,
                    loadTime: Date.now() - startTime,
                  });
                },
                (error) => {
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
              const loader = new OBJLoader();
              const object = loader.parse(objString);
              
              resolve({
                object,
                fileName: file.name,
                fileSize: file.size,
                fileType,
                loadTime: Date.now() - startTime,
              });
            } else if (fileType === 'fbx') {
              const loader = new FBXLoader();
              const object = loader.parse(arrayBuffer, '');
              
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

        // 文件读取错误处理
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

        // 开始读取文件为 ArrayBuffer
        reader.readAsArrayBuffer(file);
      });
    },
    [getFileType, createError]
  );

  /**
   * 从 ZIP 文件中提取支持的 3D 文件
   * @param file ZIP 文件
   * @returns Promise 返回提取的文件列表
   */
  const extractZipFiles = useCallback(
    async (file: File): Promise<File[]> => {
      const zip = new JSZip();
      const arrayBuffer = await file.arrayBuffer();
      const zipData = await zip.loadAsync(arrayBuffer);
      const extractedFiles: File[] = [];

      // 遍历 ZIP 文件中的所有文件
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

  /**
   * 批量处理文件
   * @param files 要处理的文件列表
   * @returns Promise 返回处理结果列表
   */
  const processFiles = useCallback(
    async (files: File[]): Promise<FileImportResult[]> => {
      const results: FileImportResult[] = [];
      let processedCount = 0;

      // 逐个处理文件
      for (const file of files) {
        try {
          let filesToProcess: File[] = [];

          // 如果是 ZIP 文件，先解压
          if (file.name.toLowerCase().endsWith('.zip')) {
            filesToProcess = await extractZipFiles(file);
          } else {
            filesToProcess = [file];
          }

          // 处理每个文件
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

        // 更新处理进度
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
