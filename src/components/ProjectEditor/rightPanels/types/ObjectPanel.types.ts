/**
 * 对象面板类型定义
 * 定义对象配置相关的所有类型
 * @author Cerror
 * @since 2024-01-22
 */

// 对象类型枚举
export type ObjectType = 
  | 'Group' 
  | 'Mesh' 
  | 'Light' 
  | 'Camera' 
  | 'Scene' 
  | 'Object3D';

// 3D向量类型
export interface ObjectVector3 {
  x: number;
  y: number;
  z: number;
}

// 对象基本信息
export interface ObjectInfo {
  /** 对象类型 */
  type: ObjectType;
  /** 识别码 */
  id: string;
  /** 名称 */
  name: string;
  /** 材质 */
  material?: string;
}

// 变换配置
export interface TransformConfig {
  /** 位置 */
  position: ObjectVector3;
  /** 旋转（欧拉角，度数） */
  rotation: ObjectVector3;
  /** 缩放 */
  scale: ObjectVector3;
}

// 阴影配置
export interface ObjectShadowConfig {
  /** 产生阴影 */
  castShadow: boolean;
  /** 接受阴影 */
  receiveShadow: boolean;
}

// 可见性配置
export interface VisibilityConfig {
  /** 可见性 */
  visible: boolean;
  /** 视锥体裁剪 */
  frustumCulled: boolean;
}

// 渲染次序配置
export interface RenderOrderConfig {
  /** 渲染次序 */
  renderOrder: number;
}

// 剖切配置
export interface ClippingConfig {
  /** 启用剖切 */
  enabled: boolean;
  /** 剖切平面法向量 */
  planeNormal: ObjectVector3;
  /** 剖切平面距离 */
  planeDistance: number;
  /** 剖切方向（正面/背面/双面） */
  side: 'front' | 'back' | 'double';
  /** 显示剖切边缘 */
  showEdges: boolean;
  /** 边缘颜色 */
  edgeColor: string;
  /** 边缘厚度 */
  edgeThickness: number;
}

// 爆炸配置
export interface ExplodeConfig {
  /** 启用爆炸视图 */
  enabled: boolean;
  /** 爆炸强度 */
  intensity: number;
  /** 爆炸中心点 */
  center: ObjectVector3;
  /** 爆炸方向 */
  direction: 'radial' | 'x' | 'y' | 'z';
  /** 爆炸动画时长（毫秒） */
  duration: number;
  /** 爆炸缓动函数 */
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

// 自定义数据
export interface CustomData {
  [key: string]: any;
}

// 对象完整状态
export interface ObjectState {
  /** 基本信息 */
  info: ObjectInfo;
  /** 变换配置 */
  transform: TransformConfig;
  /** 阴影配置 */
  shadow: ObjectShadowConfig;
  /** 可见性配置 */
  visibility: VisibilityConfig;
  /** 渲染次序配置 */
  renderOrder: RenderOrderConfig;
  /** 剖切配置 */
  clipping: ClippingConfig;
  /** 爆炸配置 */
  explode: ExplodeConfig;
  /** 自定义数据 */
  customData: CustomData;
}

// 对象面板Props
export interface ObjectPanelProps {
  /** 对象状态 */
  objectState: ObjectState | null;
  /** 对象信息变更回调 */
  onInfoChange?: (info: Partial<ObjectInfo>) => void;
  /** 变换变更回调 */
  onTransformChange?: (transform: Partial<TransformConfig>) => void;
  /** 阴影配置变更回调 */
  onShadowChange?: (shadow: Partial<ObjectShadowConfig>) => void;
  /** 可见性变更回调 */
  onVisibilityChange?: (visibility: Partial<VisibilityConfig>) => void;
  /** 渲染次序变更回调 */
  onRenderOrderChange?: (renderOrder: Partial<RenderOrderConfig>) => void;
  /** 剖切配置变更回调 */
  onClippingChange?: (clipping: Partial<ClippingConfig>) => void;
  /** 爆炸配置变更回调 */
  onExplodeChange?: (explode: Partial<ExplodeConfig>) => void;
  /** 自定义数据变更回调 */
  onCustomDataChange?: (customData: CustomData) => void;
}

// 默认值常量
export const DEFAULT_OBJECT_STATE: ObjectState = {
  info: {
    type: 'Object3D',
    id: '',
    name: '未选择对象',
    material: ''
  },
  transform: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  shadow: {
    castShadow: false,
    receiveShadow: false
  },
  visibility: {
    visible: true,
    frustumCulled: true
  },
  renderOrder: {
    renderOrder: 0
  },
  clipping: {
    enabled: false,
    planeNormal: { x: 0, y: 1, z: 0 },
    planeDistance: 0,
    side: 'front',
    showEdges: false,
    edgeColor: '#ffffff',
    edgeThickness: 1
  },
  explode: {
    enabled: false,
    intensity: 1.0,
    center: { x: 0, y: 0, z: 0 },
    direction: 'radial',
    duration: 1000,
    easing: 'easeOut'
  },
  customData: {}
};

// 对象类型图标映射
export const OBJECT_TYPE_ICONS: Record<ObjectType, string> = {
  'Group': '📁',
  'Mesh': '🧊',
  'Light': '💡',
  'Camera': '📹',
  'Scene': '🎬',
  'Object3D': '📦'
};

// 对象类型颜色映射
export const OBJECT_TYPE_COLORS: Record<ObjectType, string> = {
  'Group': '#52c41a',
  'Mesh': '#1890ff',
  'Light': '#faad14',
  'Camera': '#722ed1',
  'Scene': '#13c2c2',
  'Object3D': '#8c8c8c'
}; 