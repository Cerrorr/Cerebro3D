import { Object3D, Vector3 } from 'three';

/**
 * 文件导入结果接口
 * @author Cerror
 * @since 2025-07-08 */
export interface FileImportResult {
  /** 导入的3D对象 */
  object: Object3D;
  /** 文件名 */
  fileName: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 文件类型 */
  fileType: string;
  /** 加载耗时（毫秒） */
  loadTime: number;
  /** 计算的位置信息（可选） */
  position?: Vector3;
}

/**
 * 文件导入错误接口
 */
export interface FileImportError {
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code: string;
  /** 文件名（可选） */
  fileName?: string;
  /** 原始错误对象（可选） */
  originalError?: Error;
}

/**
 * 文件导入配置选项接口
 */
export interface FileImportOptions {
  /** 最大文件大小（字节），默认50MB */
  maxFileSize?: number;
  /** 允许的文件类型数组 */
  allowedTypes?: string[];
  /** 进度回调函数 */
  onProgress?: (progress: number) => void;
  /** 错误回调函数 */
  onError?: (error: FileImportError) => void;
  /** 成功回调函数 */
  onSuccess?: (result: FileImportResult) => void;
}

/**
 * 文件导入状态接口
 */
export interface FileImportState {
  /** 是否正在加载 */
  isLoading: boolean;
  /** 加载进度（0-100） */
  progress: number;
  /** 错误信息 */
  error: FileImportError | null;
  /** 导入结果列表 */
  results: FileImportResult[];
}

/**
 * 拖拽处理函数接口
 */
export interface DragDropHandlers {
  /** 拖拽进入事件处理 */
  onDragEnter: (event: React.DragEvent) => void;
  /** 拖拽离开事件处理 */
  onDragLeave: (event: React.DragEvent) => void;
  /** 拖拽悬停事件处理 */
  onDragOver: (event: React.DragEvent) => void;
  /** 拖拽放下事件处理 */
  onDrop: (event: React.DragEvent) => void;
}

/**
 * 文件导入Hook返回值接口
 */
export interface FileImportHookReturn {
  /** 导入状态 */
  state: FileImportState;
  /** 上传文件方法 */
  uploadFiles: (files: FileList | File[]) => Promise<FileImportResult[]>;
  /** 从URL导入方法 */
  importFromUrl: (url: string) => Promise<FileImportResult>;
  /** 拖拽处理函数 */
  dragDropHandlers: DragDropHandlers;
  /** 重置状态方法 */
  reset: () => void;
}

/**
 * 支持的文件类型
 */
export type SupportedFileType = 'gltf' | 'glb' | 'obj' | 'fbx';

/**
 * 支持的文件类型映射表
 */
export const SUPPORTED_FILE_TYPES: Record<SupportedFileType, string[]> = {
  gltf: ['gltf'], // GLTF格式
  glb: ['glb'],   // GLB格式
  obj: ['obj'],   // OBJ格式
  fbx: ['fbx']    // FBX格式
};

/**
 * 支持的MIME类型数组
 */
export const SUPPORTED_MIME_TYPES = [
  'model/gltf+json',        // GLTF JSON格式
  'model/gltf-binary',      // GLB二进制格式
  'application/octet-stream', // 通用二进制流
  'text/plain'              // 纯文本格式
];