/**
 * 材质面板类型定义
 * 定义材质编辑器的所有配置选项
 * @author Cerror
 * @since 2024-01-22
 */

/**
 * 材质类型枚举
 */
export type MaterialType = 
  | 'MeshBasicMaterial'
  | 'MeshStandardMaterial'
  | 'MeshPhongMaterial'
  | 'MeshLambertMaterial'
  | 'MeshPhysicalMaterial'
  | 'MeshToonMaterial';

/**
 * 混合模式枚举
 */
export type BlendingMode = 
  | 'NoBlending'
  | 'NormalBlending'
  | 'AdditiveBlending'
  | 'SubtractiveBlending'
  | 'MultiplyBlending'
  | 'CustomBlending';

/**
 * 渲染面枚举
 */
export type Side = 'FrontSide' | 'BackSide' | 'DoubleSide';

/**
 * 贴图配置接口
 */
export interface TextureConfig {
  // 是否启用
  enabled: boolean;
  // 贴图链接
  url?: string;
  // 重复坐标
  repeat: { x: number; y: number };
  // 偏移坐标
  offset: { x: number; y: number };
  // 旋转角度
  rotation: number;
  // S方向包裹模式
  wrapS: 'RepeatWrapping' | 'ClampToEdgeWrapping' | 'MirroredRepeatWrapping';
  // T方向包裹模式
  wrapT: 'RepeatWrapping' | 'ClampToEdgeWrapping' | 'MirroredRepeatWrapping';
}

/**
 * 材质基础信息
 */
export interface MaterialInfo {
  // 材质名称
  name: string;
  // 材质类型
  type: MaterialType;
  // 材质ID
  id: string;
}

/**
 * 材质外观配置
 */
export interface MaterialAppearance {
  // 基础颜色
  color: string;
  // 自发光颜色
  emissive: string;
  // 自发光强度
  emissiveIntensity: number;
  // 粗糙度
  roughness: number;
  // 金属度
  metalness: number;
  // 透明度
  opacity: number;
  // 是否透明
  transparent: boolean;
  // 透明度测试
  alphaTest: number;
  // 是否可见
  visible: boolean;
}

/**
 * 贴图配置组
 */
export interface MaterialTextures {
  // 漫反射贴图
  diffuse: TextureConfig;
  // 法线贴图
  normal: TextureConfig;
  // 粗糙度贴图
  roughness: TextureConfig;
  // 金属度贴图
  metalness: TextureConfig;
  // 自发光贴图
  emissive: TextureConfig;
  // 环境光遮蔽贴图
  ao: TextureConfig;
  // 置换贴图
  displacement: TextureConfig;
  // 环境贴图
  environment: TextureConfig;
}

/**
 * 材质渲染设置
 */
export interface MaterialRender {
  // 渲染面
  side: Side;
  // 平面着色
  flatShading: boolean;
  // 混合模式
  blending: BlendingMode;
  // 深度测试
  depthTest: boolean;
  // 深度写入
  depthWrite: boolean;
  // 线框模式
  wireframe: boolean;
}

/**
 * 材质状态
 */
export interface MaterialState {
  // 基础信息
  info: MaterialInfo;
  // 外观配置
  appearance: MaterialAppearance;
  // 贴图配置
  textures: MaterialTextures;
  // 渲染设置
  render: MaterialRender;
  // 自定义数据
  customData: Record<string, any>;
}

/**
 * 材质面板Props
 */
export interface MaterialPanelProps {
  // 材质状态
  materialState?: MaterialState;
  // 信息变更回调
  onInfoChange?: (changes: Partial<MaterialInfo>) => void;
  // 外观变更回调
  onAppearanceChange?: (changes: Partial<MaterialAppearance>) => void;
  // 贴图变更回调
  onTextureChange?: (textureType: keyof MaterialTextures, changes: Partial<TextureConfig>) => void;
  // 渲染设置变更回调
  onRenderChange?: (changes: Partial<MaterialRender>) => void;
  // 自定义数据变更回调
  onCustomDataChange?: (customData: Record<string, any>) => void;
  // 材质选择回调
  onMaterialSelect?: (materialName: string) => void;
  // 材质应用回调
  onMaterialApply?: () => void;
} 