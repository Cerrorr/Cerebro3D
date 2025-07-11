/**
 * 几何面板相关常量
 * @author Cerror
 * @since 2025-07-11
 */

import { GeometryState } from '../types/GeometryPanel.types';

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