/**
 * 几何面板类型定义
 * 定义几何体编辑器的所有配置选项
 * @author Cerror
 * @since 2024-01-22
 */

// 几何体类型枚举
export type GeometryType = 
  | 'BufferGeometry'
  | 'BoxGeometry'
  | 'SphereGeometry'
  | 'PlaneGeometry'
  | 'CylinderGeometry'
  | 'ConeGeometry'
  | 'TorusGeometry'
  | 'RingGeometry'
  | 'CircleGeometry'
  | 'ExtrudeGeometry'
  | 'LatheGeometry'
  | 'ShapeGeometry'
  | 'TubeGeometry';

/**
 * 几何体基础信息
 */
export interface GeometryInfo {
  // 几何体类型
  type: GeometryType;
  // 几何体唯一标识
  id: string;
  // 几何体名称
  name: string;
}

/**
 * 几何体属性
 */
export interface GeometryAttributes {
  // 位置属性
  position: {
    // 顶点数量
    count: number;
    // 每个顶点的维度
    itemSize: number;
  };
  // 法线属性
  normal: {
    // 法线数量
    count: number;
    // 每个法线的维度
    itemSize: number;
  };
  // UV坐标属性
  uv: {
    // UV坐标数量
    count: number;
    // 每个UV坐标的维度
    itemSize: number;
  };
  // 索引属性（可选）
  index?: {
    // 索引数量
    count: number;
  };
}

/**
 * Morph属性
 */
export interface MorphAttributes {
  // 位置变形属性
  position52?: boolean;
  // 法线变形属性
  normal52?: boolean;
  // 其他自定义变形属性
  [key: string]: boolean | undefined;
}

/**
 * 几何体变形设置
 */
export interface MorphSettings {
  // 变形属性配置
  morphAttributes: MorphAttributes;
  // 是否使用相对变形
  morphRelative: boolean;
}

/**
 * 几何体边界框
 */
export interface GeometryBounds {
  // 最小边界点
  min: { x: number; y: number; z: number };
  // 最大边界点
  max: { x: number; y: number; z: number };
  // 中心点坐标
  center: { x: number; y: number; z: number };
  // 边界框尺寸
  size: { x: number; y: number; z: number };
}

/**
 * 几何体操作
 */
export interface GeometryOperations {
  // 是否显示顶点法线
  showVertexNormals: boolean;
  // 是否计算顶点法线
  computeVertexNormals: boolean;
  // 是否居中几何体
  center: boolean;
}

/**
 * 几何体统计信息
 */
export interface GeometryStats {
  // 顶点数量
  vertices: number;
  // 面数量
  faces: number;
  // 三角形数量
  triangles: number;
  // 组数量
  groups: number;
}

/**
 * 几何体状态
 */
export interface GeometryState {
  // 几何体基础信息
  info: GeometryInfo;
  // 几何体属性
  attributes: GeometryAttributes;
  // 变形设置
  morphSettings: MorphSettings;
  // 边界框信息
  bounds: GeometryBounds;
  // 操作状态
  operations: GeometryOperations;
  // 统计信息
  stats: GeometryStats;
  // 自定义数据
  customData: Record<string, any>;
}

/**
 * 几何面板Props
 */
export interface GeometryPanelProps {
  // 几何体状态
  geometryState?: GeometryState;
  // 基础信息变更回调
  onInfoChange?: (changes: Partial<GeometryInfo>) => void;
  // 属性变更回调
  onAttributesChange?: (changes: Partial<GeometryAttributes>) => void;
  // 变形设置变更回调
  onMorphSettingsChange?: (changes: Partial<MorphSettings>) => void;
  // 操作变更回调
  onOperationsChange?: (changes: Partial<GeometryOperations>) => void;
  // 显示顶点法线回调
  onShowVertexNormals?: () => void;
  // 计算顶点法线回调
  onComputeVertexNormals?: () => void;
  // 居中几何体回调
  onCenter?: () => void;
  // 刷新边界框回调
  onRefreshBounds?: () => void;
  // 自定义数据变更回调
  onCustomDataChange?: (customData: Record<string, any>) => void;
} 