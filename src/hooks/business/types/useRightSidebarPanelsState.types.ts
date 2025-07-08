import {
  ProjectInfo,
  SceneConfiguration,
  CameraConfiguration,
  LightingConfig,
  PostProcessingConfig,
  WeatherConfig,
  RendererConfig,
  AnimationPanelState,
  ObjectState,
  MaterialState,
  GeometryState,
  ObjectInfo,
  TransformConfig,
  ObjectShadowConfig,
  VisibilityConfig,
  RenderOrderConfig,
  ClippingConfig,
  ExplodeConfig,
  MaterialInfo,
  MaterialAppearance,
  MaterialTextures,
  TextureConfig,
  MaterialRender,
  GeometryInfo,
  GeometryAttributes,
  MorphSettings,
  GeometryOperations,
} from '@/components/projectEditor/rightPanels/types';
import type { HistorySliceState } from '@/store/types/historySlice.types';

/**
 * 右侧面板状态管理Hook返回值
 * @author Cerror
 * @since 2025-07-08 */
export interface UseRightSidebarPanelsStateResult {
  /** 面板属性配置 */
  panelsProps: Record<string, any>;
  /** 项目信息 */
  projectInfo: ProjectInfo;
  /** 场景配置 */
  sceneConfig: SceneConfiguration;
  /** 相机配置 */
  cameraConfig: CameraConfiguration;
  /** 光照配置 */
  lightingConfig: LightingConfig;
  /** 后处理配置 */
  postProcessingConfig: PostProcessingConfig;
  /** 天气配置 */
  weatherConfig: WeatherConfig;
  /** 渲染器配置 */
  rendererConfig: RendererConfig;
  /** 历史记录状态 */
  historyState: HistorySliceState;
  /** 历史面板配置 */
  historyConfig: any;
  /** 动画面板状态 */
  animationState: AnimationPanelState;
  /** 对象状态 */
  objectState: ObjectState;
  /** 材质状态 */
  materialState: MaterialState;
  /** 几何体状态 */
  geometryState: GeometryState;
  /** 处理项目信息变更 */
  handleProjectInfoChange: (info: Partial<ProjectInfo>) => void;
  /** 标签页特定回调 */
  handleTabSpecificCallbacks: Record<string, any>;
}

// 回调函数类型定义
export type ObjectInfoChangeHandler = (changes: Partial<ObjectInfo>) => void;
export type TransformConfigChangeHandler = (config: Partial<TransformConfig>) => void;
export type ObjectShadowConfigChangeHandler = (config: Partial<ObjectShadowConfig>) => void;
export type VisibilityConfigChangeHandler = (config: Partial<VisibilityConfig>) => void;
export type RenderOrderConfigChangeHandler = (config: Partial<RenderOrderConfig>) => void;
export type ClippingConfigChangeHandler = (config: Partial<ClippingConfig>) => void;
export type ExplodeConfigChangeHandler = (config: Partial<ExplodeConfig>) => void;

export type MaterialInfoChangeHandler = (changes: Partial<MaterialInfo>) => void;
export type MaterialAppearanceChangeHandler = (appearance: Partial<MaterialAppearance>) => void;
export type MaterialTexturesChangeHandler = (textures: Partial<MaterialTextures>) => void;
export type TextureConfigChangeHandler = (config: Partial<TextureConfig>) => void;
export type MaterialTextureChangeHandler = (textureType: keyof MaterialTextures, changes: Partial<TextureConfig>) => void;
export type MaterialRenderChangeHandler = (render: Partial<MaterialRender>) => void;

export type GeometryInfoChangeHandler = (info: Partial<GeometryInfo>) => void;
export type GeometryAttributesChangeHandler = (attributes: Partial<GeometryAttributes>) => void;
export type MorphSettingsChangeHandler = (settings: Partial<MorphSettings>) => void;
export type GeometryOperationsChangeHandler = (operations: Partial<GeometryOperations>) => void;