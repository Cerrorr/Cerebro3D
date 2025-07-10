/**
 * ZIP文件处理器
 * 处理ZIP文件解压和中文文件名编码
 * @author Cerror
 * @since 2025-07-10
 */

import JSZip from 'jszip';
import * as iconv from 'iconv-lite';
import { Buffer } from 'buffer';
import type { SupportedFileType } from '../types';

/**
 * ZIP解压结果接口
 */
export interface ZipExtractionResult {
  files: File[];
  resourceMap: Map<string, string>;
}

// ZIP文件处理器类
export class ZipProcessor {
  private supportedTypes: Set<string>;

  constructor(supportedFileTypes: Record<SupportedFileType, string[]>) {
    // 构建支持的文件扩展名集合
    this.supportedTypes = new Set(
      Object.values(supportedFileTypes).flat()
    );
  }

  /**
   * 检查文件是否为支持的3D文件类型
   * @param fileName 文件名
   * @returns 是否支持
   */
  private isSupportedFile(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? this.supportedTypes.has(extension) : false;
  }

  /**
   * 解码中文文件名
   * @param bytes 字节数组
   * @returns 解码后的文件名
   */
  private decodeFileName(bytes: any): string {
    try {
      const buffer = Buffer.from(bytes);
      return iconv.decode(buffer, 'gbk');
    } catch (e) {
      console.warn('Failed to decode filename with iconv, using fallback:', e);
      // 尝试不同的fallback方法
      try {
        if (bytes instanceof Uint8Array) {
          return String.fromCharCode(...Array.from(bytes));
        } else if (Array.isArray(bytes)) {
          return bytes.join('');
        } else {
          return bytes.toString();
        }
      } catch (fallbackError) {
        console.warn('Fallback also failed:', fallbackError);
        return 'unknown_filename';
      }
    }
  }

  /**
   * 从ZIP文件中提取支持的3D文件和相关资源
   * @param file ZIP文件
   * @returns Promise 返回提取的文件列表和资源映射
   */
  async extractZipFiles(file: File): Promise<ZipExtractionResult> {
    const arrayBuffer = await file.arrayBuffer();

    // 使用iconv解决中文文件名乱码问题
    const zipData = await JSZip.loadAsync(arrayBuffer, {
      decodeFileName: (bytes: any) => this.decodeFileName(bytes),
    });

    const extractedFiles: File[] = [];
    const resourceMap = new Map<string, string>();

    // 遍历ZIP文件中的所有文件
    for (const [fileName, zipEntry] of Object.entries(zipData.files)) {
      if (!zipEntry.dir) {
        const blob = await zipEntry.async('blob');
        const extractedFile = new File([blob], fileName, { type: blob.type });

        // 如果是支持的3D文件类型，加入主文件列表
        if (this.isSupportedFile(fileName)) {
          extractedFiles.push(extractedFile);
        }

        // 所有文件都创建blob URL映射，用于GLTF加载器访问资源
        const blobUrl = URL.createObjectURL(extractedFile);
        resourceMap.set(fileName, blobUrl);
      }
    }

    return { files: extractedFiles, resourceMap };
  }

  /**
   * 清理资源映射中的blob URLs
   * @param resourceMap 资源映射表
   */
  cleanupResourceMap(resourceMap: Map<string, string>): void {
    for (const blobUrl of resourceMap.values()) {
      URL.revokeObjectURL(blobUrl);
    }
  }
}