/**
 * 文件导入相关常量定义
 * @author Cerror
 * @since 2025-07-11
 */

import type { SupportedFileType } from '../types';

/**
 * 支持的文件类型映射表
 * 定义各种3D模型文件格式及其对应的文件扩展名
 */
export const SUPPORTED_FILE_TYPES: Record<SupportedFileType, string[]> = {
  gltf: ['gltf'], // GLTF格式
  glb: ['glb'],   // GLB格式
  obj: ['obj'],   // OBJ格式
  fbx: ['fbx']    // FBX格式
};

/**
 * 支持的MIME类型数组
 * 定义3D模型文件的MIME类型，用于文件上传验证
 */
export const SUPPORTED_MIME_TYPES = [
  'model/gltf+json',        // GLTF JSON格式
  'model/gltf-binary',      // GLB二进制格式
  'application/octet-stream', // 通用二进制流
  'text/plain'              // 纯文本格式
];