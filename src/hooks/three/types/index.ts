/**
 * Three.js Hook 类型定义统一导出
 * @author Cerror
 * @since 2025-07-11
 */

// 文件导入相关类型和常量
export type {
  FileImportResult,
  FileImportError,
  FileImportOptions,
  FileImportState,
  DragDropHandlers,
  FileImportHookReturn,
  SupportedFileType
} from './useFileImport.types';

// 3D服务相关类型
export type {
  Scene3DConfig,
  Scene3DState,
  Transform3D,
  Scene3DOperationResult
} from './Scene3DService.types';

// R3F Hook相关类型
export type {
  UseSceneResult
} from './useScene.types';

export type {
  UseCameraResult
} from './useCamera.types';

export type {
  UseObjectRenderOptions,
  UseObjectRenderResult
} from './useObjectRender.types';

export type {
  UseEnvironmentResult,
  LightConfig
} from './useEnvironment.types';