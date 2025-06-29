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

// 默认几何体状态
export const DEFAULT_GEOMETRY_STATE: GeometryState = {
  info: {
    type: 'BufferGeometry',
    id: '0ff08bab-94bf-4c6',
    name: 'Please Input',
  },
  attributes: {
    position: {
      count: 2694,
      itemSize: 3,
    },
    normal: {
      count: 2694,
      itemSize: 3,
    },
    uv: {
      count: 2694,
      itemSize: 2,
    },
    index: {
      count: 15096,
    },
  },
  morphSettings: {
    morphAttributes: {
      position52: false,
      normal52: false,
    },
    morphRelative: false,
  },
  bounds: {
    min: { x: -50, y: -25, z: -30 },
    max: { x: 50, y: 25, z: 30 },
    center: { x: 0, y: 0, z: 0 },
    size: { x: 100, y: 50, z: 60 },
  },
  operations: {
    showVertexNormals: false,
    computeVertexNormals: false,
    center: false,
  },
  stats: {
    vertices: 2694,
    faces: 5032,
    triangles: 5032,
    groups: 1,
  },
  customData: {},
};

// 几何体类型选项
export const GEOMETRY_TYPE_OPTIONS = [
  { label: 'BufferGeometry', value: 'BufferGeometry' },
  { label: 'BoxGeometry', value: 'BoxGeometry' },
  { label: 'SphereGeometry', value: 'SphereGeometry' },
  { label: 'PlaneGeometry', value: 'PlaneGeometry' },
  { label: 'CylinderGeometry', value: 'CylinderGeometry' },
  { label: 'ConeGeometry', value: 'ConeGeometry' },
  { label: 'TorusGeometry', value: 'TorusGeometry' },
  { label: 'RingGeometry', value: 'RingGeometry' },
  { label: 'CircleGeometry', value: 'CircleGeometry' },
  { label: 'ExtrudeGeometry', value: 'ExtrudeGeometry' },
  { label: 'LatheGeometry', value: 'LatheGeometry' },
  { label: 'ShapeGeometry', value: 'ShapeGeometry' },
  { label: 'TubeGeometry', value: 'TubeGeometry' },
]; 