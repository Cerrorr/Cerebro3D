/**
 * 文件导入服务
 * 协调各个处理器完成文件导入
 * @author Cerror
 * @since 2025-07-10
 */

import { LoaderManager } from '../loaders/LoaderManager';
import { ZipProcessor } from '../processors/ZipProcessor';
import { FileValidator } from '../validators/FileValidator';
import { ModelProcessor } from '../processors/ModelProcessor';
import type { 
  FileImportResult, 
  FileImportError, 
  FileImportOptions
} from '../types';
import { SUPPORTED_FILE_TYPES } from '../types';

/**
 * 文件大小常量定义
 */
const FILE_SIZE_LIMITS = {
  DEFAULT_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  MB: 1024 * 1024,
} as const;

/**
 * 文件导入服务类
 */
export class FileImportService {
  private loaderManager: LoaderManager;
  private zipProcessor: ZipProcessor;
  private fileValidator: FileValidator;
  private modelProcessor: ModelProcessor;

  constructor(options: FileImportOptions = {}) {
    // 配置默认选项
    const config = {
      maxFileSize: options.maxFileSize || FILE_SIZE_LIMITS.DEFAULT_MAX_SIZE,
      allowedTypes: options.allowedTypes || Object.keys(SUPPORTED_FILE_TYPES),
      supportedFileTypes: SUPPORTED_FILE_TYPES,
    };

    // 初始化各个处理器
    this.loaderManager = new LoaderManager();
    this.zipProcessor = new ZipProcessor(SUPPORTED_FILE_TYPES);
    this.fileValidator = new FileValidator(config);
    this.modelProcessor = new ModelProcessor();
  }

  /**
   * 创建错误对象
   */
  private createError(
    message: string,
    code: string,
    fileName?: string,
    originalError?: Error
  ): FileImportError {
    return {
      message,
      code,
      fileName,
      originalError,
    };
  }

  /**
   * 加载单个文件
   * @param file 要加载的文件
   * @param resourceMap 资源映射表（用于GLTF外部资源）
   * @returns Promise 返回加载结果
   */
  async loadSingleFile(
    file: File,
    resourceMap?: Map<string, string>
  ): Promise<FileImportResult> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      // 验证文件
      const validationError = this.fileValidator.validateFile(file);
      if (validationError) {
        reject(validationError);
        return;
      }

      // 获取文件类型
      const fileType = this.fileValidator.getFileType(file.name);
      if (!fileType) {
        reject(this.createError('无法确定文件类型', 'UNKNOWN_FILE_TYPE', file.name));
        return;
      }

      // 创建文件URL
      const url = URL.createObjectURL(file);

      // 如果是GLTF且有资源映射，设置自定义资源管理器
      if ((fileType === 'gltf' || fileType === 'glb') && resourceMap) {
        this.loaderManager.setupGLTFResourceManager(resourceMap);
      }

      // 定义回调函数
      const onLoad = (result: any) => {
        URL.revokeObjectURL(url);

        try {
          // 提取3D对象
          const rawObject = this.modelProcessor.extractObject(result, fileType);
          
          // 处理模型
          const processResult = this.modelProcessor.processModel(rawObject);

          resolve({
            object: processResult.object,
            fileName: file.name,
            fileSize: file.size,
            fileType,
            loadTime: Date.now() - startTime,
            position: processResult.position,
          });
        } catch (error) {
          reject(this.createError(
            '模型处理失败',
            'MODEL_PROCESS_ERROR',
            file.name,
            error as Error
          ));
        }
      };

      const onError = (error: any) => {
        URL.revokeObjectURL(url);
        reject(this.createError(
          `${fileType.toUpperCase()} 加载失败`,
          `${fileType.toUpperCase()}_LOAD_ERROR`,
          file.name,
          error as Error
        ));
      };

      // 使用加载器管理器加载文件
      this.loaderManager.loadFile(fileType, url, onLoad, undefined, onError);
    });
  }

  /**
   * 处理ZIP文件
   * @param file ZIP文件
   * @returns Promise 返回处理结果
   */
  async processZipFile(file: File): Promise<FileImportResult[]> {
    const extractResult = await this.zipProcessor.extractZipFiles(file);
    const results: FileImportResult[] = [];

    try {
      // 处理每个提取的文件
      for (const extractedFile of extractResult.files) {
        const result = await this.loadSingleFile(extractedFile, extractResult.resourceMap);
        results.push(result);
      }
    } finally {
      // 清理资源
      this.zipProcessor.cleanupResourceMap(extractResult.resourceMap);
    }

    return results;
  }

  /**
   * 处理单个或多个文件
   * @param files 文件列表
   * @returns Promise 返回处理结果列表
   */
  async processFiles(files: File[]): Promise<FileImportResult[]> {
    const results: FileImportResult[] = [];

    for (const file of files) {
      try {
        if (this.fileValidator.isZipFile(file.name)) {
          const zipResults = await this.processZipFile(file);
          results.push(...zipResults);
        } else {
          const result = await this.loadSingleFile(file);
          results.push(result);
        }
      } catch (error) {
        // 错误处理由调用方决定
        throw error;
      }
    }

    return results;
  }

  /**
   * 从URL导入文件
   * @param url 文件URL
   * @returns Promise 返回导入结果
   */
  async importFromUrl(url: string): Promise<FileImportResult> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const fileName = url.split('/').pop() || 'unknown';
    const arrayBuffer = await response.arrayBuffer();
    const file = new File([arrayBuffer], fileName);

    return this.loadSingleFile(file);
  }
}