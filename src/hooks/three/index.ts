/**
 * Three.js 相关 Hook 和服务的统一导出
 * @author Cerror
 * @since 2025-07-11
 */

export { useFileImport } from './useFileImport';
export type {
  FileImportResult,
  FileImportError,
  FileImportOptions,
  FileImportState,
  DragDropHandlers,
  FileImportHookReturn,
  SupportedFileType
} from './types';
export { SUPPORTED_FILE_TYPES, SUPPORTED_MIME_TYPES } from './types';

// Three.js Hooks
export { useScene } from './useScene';
export { useCamera } from './useCamera';
export { useObjectRender } from './useObjectRender';
export { useEnvironment } from './useEnvironment';

export type {
  UseSceneResult,
  UseCameraResult,
  UseObjectRenderResult,
  UseObjectRenderOptions,
  UseEnvironmentResult,
  LightConfig
} from './types';

// 3D Services
export { Scene3DService } from './services';
export type {
  Scene3DConfig,
  Scene3DState,
  Transform3D,
  Scene3DOperationResult
} from './types';