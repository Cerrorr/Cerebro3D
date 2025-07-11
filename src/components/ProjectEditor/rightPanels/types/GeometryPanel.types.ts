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

// 几何体基础信息
export interface GeometryInfo {
  type: GeometryType;
  id: string;
  name: string;
}

// 几何体属性
export interface GeometryAttributes {
  position: {
    count: number;
    itemSize: number;
  };
  normal: {
    count: number;
    itemSize: number;
  };
  uv: {
    count: number;
    itemSize: number;
  };
  index?: {
    count: number;
  };
}

// Morph属性
export interface MorphAttributes {
  position52?: boolean;
  normal52?: boolean;
  [key: string]: boolean | undefined;
}

// 几何体变形设置
export interface MorphSettings {
  morphAttributes: MorphAttributes;
  morphRelative: boolean;
}

// 几何体边界框
export interface GeometryBounds {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
  center: { x: number; y: number; z: number };
  size: { x: number; y: number; z: number };
}

// 几何体操作
export interface GeometryOperations {
  showVertexNormals: boolean;
  computeVertexNormals: boolean;
  center: boolean;
}

// 几何体统计信息
export interface GeometryStats {
  vertices: number;
  faces: number;
  triangles: number;
  groups: number;
}

// 几何体状态
export interface GeometryState {
  info: GeometryInfo;
  attributes: GeometryAttributes;
  morphSettings: MorphSettings;
  bounds: GeometryBounds;
  operations: GeometryOperations;
  stats: GeometryStats;
  customData: Record<string, any>;
}

// 几何面板Props
export interface GeometryPanelProps {
  geometryState?: GeometryState;
  onInfoChange?: (changes: Partial<GeometryInfo>) => void;
  onAttributesChange?: (changes: Partial<GeometryAttributes>) => void;
  onMorphSettingsChange?: (changes: Partial<MorphSettings>) => void;
  onOperationsChange?: (changes: Partial<GeometryOperations>) => void;
  onShowVertexNormals?: () => void;
  onComputeVertexNormals?: () => void;
  onCenter?: () => void;
  onRefreshBounds?: () => void;
  onCustomDataChange?: (customData: Record<string, any>) => void;
} 