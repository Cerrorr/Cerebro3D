/**
 * 重构后的文件导入 Hook
 * 精简版本，委托给 FileImportService 处理具体逻辑
 * @author Cerror
 * @since 2025-07-10
 */

import { useState, useCallback } from 'react';
import { FileImportService } from './services';
import type {
  FileImportHookReturn,
  FileImportState,
  FileImportOptions,
  FileImportResult,
  FileImportError,
} from './types';

/**
 * 默认文件导入配置选项
 */
const DEFAULT_OPTIONS: Required<FileImportOptions> = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['gltf', 'glb', 'obj', 'fbx'],
  onProgress: () => {},
  onError: () => {},
  onSuccess: () => {},
};

/**
 * 文件导入 Hook
 * 提供3D模型文件导入功能，支持 GLB、GLTF、OBJ、FBX 格式和 ZIP 压缩包
 * @param options 导入配置选项
 * @returns 文件导入状态和操作方法
 */
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

  // 创建文件导入服务实例
  const [fileImportService] = useState(() => new FileImportService(config));

  /**
   * 更新导入状态
   */
  const updateState = useCallback((updates: Partial<FileImportState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 创建错误对象
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
   * 上传文件
   */
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
        const results: FileImportResult[] = [];
        let processedCount = 0;

        // 逐个处理文件
        for (const file of fileArray) {
          try {
            const fileResults = await fileImportService.processFiles([file]);
            
            // 处理每个结果的回调
            fileResults.forEach(result => {
              results.push(result);
              config.onSuccess(result);
            });
          } catch (error) {
            const fileError = error as FileImportError;
            config.onError(fileError);
          }

          // 更新进度
          processedCount++;
          const progress = (processedCount / fileArray.length) * 100;
          updateState({ progress });
          config.onProgress(progress);
        }

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
    [fileImportService, state.results, updateState, createError, config]
  );

  /**
   * 从URL导入
   */
  const importFromUrl = useCallback(
    async (url: string): Promise<FileImportResult> => {
      updateState({
        isLoading: true,
        progress: 0,
        error: null,
      });

      try {
        const result = await fileImportService.importFromUrl(url);

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
    [fileImportService, state.results, updateState, createError, config]
  );

  /**
   * 拖拽处理函数
   */
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

  /**
   * 重置状态
   */
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