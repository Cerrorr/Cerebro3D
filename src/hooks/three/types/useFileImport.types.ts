import { Object3D } from 'three';

export interface FileImportResult {
  object: Object3D;
  fileName: string;
  fileSize: number;
  fileType: string;
  loadTime: number;
}

export interface FileImportError {
  message: string;
  code: string;
  fileName?: string;
  originalError?: Error;
}

export interface FileImportOptions {
  maxFileSize?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onError?: (error: FileImportError) => void;
  onSuccess?: (result: FileImportResult) => void;
}

export interface FileImportState {
  isLoading: boolean;
  progress: number;
  error: FileImportError | null;
  results: FileImportResult[];
}

export interface DragDropHandlers {
  onDragEnter: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
}

export interface FileImportHookReturn {
  state: FileImportState;
  uploadFiles: (files: FileList | File[]) => Promise<FileImportResult[]>;
  importFromUrl: (url: string) => Promise<FileImportResult>;
  dragDropHandlers: DragDropHandlers;
  reset: () => void;
}

export type SupportedFileType = 'gltf' | 'glb' | 'obj' | 'fbx';

export const SUPPORTED_FILE_TYPES: Record<SupportedFileType, string[]> = {
  gltf: ['gltf'],
  glb: ['glb'],
  obj: ['obj'],
  fbx: ['fbx']
};

export const SUPPORTED_MIME_TYPES = [
  'model/gltf+json',
  'model/gltf-binary',
  'application/octet-stream',
  'text/plain'
];