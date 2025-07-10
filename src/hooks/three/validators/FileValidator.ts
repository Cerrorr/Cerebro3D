/**
 * 文件验证器
 * 处理文件大小和类型验证
 * @author Cerror
 * @since 2025-07-10
 */

import type { FileImportError, SupportedFileType } from '../types';

/**
 * 文件验证配置接口
 */
export interface FileValidationConfig {
  maxFileSize: number;
  allowedTypes: string[];
  supportedFileTypes: Record<SupportedFileType, string[]>;
}

/**
 * 文件验证器类
 */
export class FileValidator {
  private config: FileValidationConfig;

  constructor(config: FileValidationConfig) {
    this.config = config;
  }

  /**
   * 创建错误对象
   * @param message 错误消息
   * @param code 错误代码
   * @param fileName 文件名
   * @param originalError 原始错误
   * @returns 格式化的错误对象
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
   * 获取文件类型
   * @param fileName 文件名
   * @returns 支持的文件类型或null
   */
  getFileType(fileName: string): SupportedFileType | null {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return null;

    for (const [type, extensions] of Object.entries(this.config.supportedFileTypes)) {
      if (extensions.includes(extension)) {
        return type as SupportedFileType;
      }
    }
    return null;
  }

  /**
   * 验证文件是否符合导入要求
   * @param file 要验证的文件
   * @returns 验证错误或null（通过验证）
   */
  validateFile(file: File): FileImportError | null {
    // 检查文件大小限制
    if (file.size > this.config.maxFileSize) {
      const maxSizeMB = Math.round(this.config.maxFileSize / (1024 * 1024));
      return this.createError(
        `文件大小超过限制 (${maxSizeMB}MB)`,
        'FILE_TOO_LARGE',
        file.name
      );
    }

    // 检查文件类型是否支持
    const fileType = this.getFileType(file.name);
    if (!fileType || !this.config.allowedTypes.includes(fileType)) {
      return this.createError(
        `不支持的文件类型: ${file.name}`,
        'UNSUPPORTED_FILE_TYPE',
        file.name
      );
    }

    return null;
  }

  /**
   * 检查是否为ZIP文件
   * @param fileName 文件名
   * @returns 是否为ZIP文件
   */
  isZipFile(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.zip');
  }
}