/**
 * 材质面板类型定义
 * 定义材质编辑器的所有配置选项
 * @author Cerror
 * @since 2024-01-22
 */

// 材质类型枚举
export type MaterialType = 
  | 'MeshBasicMaterial'
  | 'MeshStandardMaterial'
  | 'MeshPhongMaterial'
  | 'MeshLambertMaterial'
  | 'MeshPhysicalMaterial'
  | 'MeshToonMaterial';

// 混合模式枚举
export type BlendingMode = 
  | 'NoBlending'
  | 'NormalBlending'
  | 'AdditiveBlending'
  | 'SubtractiveBlending'
  | 'MultiplyBlending'
  | 'CustomBlending';

// 渲染面枚举
export type Side = 'FrontSide' | 'BackSide' | 'DoubleSide';

// 贴图配置接口
export interface TextureConfig {
  enabled: boolean;
  url?: string;
  repeat: { x: number; y: number };
  offset: { x: number; y: number };
  rotation: number;
  wrapS: 'RepeatWrapping' | 'ClampToEdgeWrapping' | 'MirroredRepeatWrapping';
  wrapT: 'RepeatWrapping' | 'ClampToEdgeWrapping' | 'MirroredRepeatWrapping';
}

// 材质基础信息
export interface MaterialInfo {
  name: string;
  type: MaterialType;
  id: string;
}

// 材质外观配置
export interface MaterialAppearance {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
  opacity: number;
  transparent: boolean;
  alphaTest: number;
  visible: boolean;
}

// 贴图配置组
export interface MaterialTextures {
  diffuse: TextureConfig;      // 漫反射贴图
  normal: TextureConfig;       // 法线贴图
  roughness: TextureConfig;    // 粗糙度贴图
  metalness: TextureConfig;    // 金属度贴图
  emissive: TextureConfig;     // 自发光贴图
  ao: TextureConfig;           // 环境光遮蔽贴图
  displacement: TextureConfig; // 置换贴图
  environment: TextureConfig;  // 环境贴图
}

// 材质渲染设置
export interface MaterialRender {
  side: Side;
  flatShading: boolean;
  blending: BlendingMode;
  depthTest: boolean;
  depthWrite: boolean;
  wireframe: boolean;
}

// 材质状态
export interface MaterialState {
  info: MaterialInfo;
  appearance: MaterialAppearance;
  textures: MaterialTextures;
  render: MaterialRender;
  customData: Record<string, any>;
}

// 材质面板Props
export interface MaterialPanelProps {
  materialState?: MaterialState;
  onInfoChange?: (changes: Partial<MaterialInfo>) => void;
  onAppearanceChange?: (changes: Partial<MaterialAppearance>) => void;
  onTextureChange?: (textureType: keyof MaterialTextures, changes: Partial<TextureConfig>) => void;
  onRenderChange?: (changes: Partial<MaterialRender>) => void;
  onCustomDataChange?: (customData: Record<string, any>) => void;
  onMaterialSelect?: (materialName: string) => void;
  onMaterialApply?: () => void;
} 