/**
 * 材质面板相关常量
 * @author Cerror
 * @since 2025-07-11
 */

import { MaterialState } from '../types/MaterialPanel.types';

// 默认材质配置
export const DEFAULT_MATERIAL_STATE: MaterialState = {
  info: {
    name: 'lambert5',
    type: 'MeshStandardMaterial',
    id: '712fc46b-91b6-4e',
  },
  appearance: {
    color: '#ffffff',
    emissive: '#000000',
    emissiveIntensity: 1,
    roughness: 1,
    metalness: 0,
    opacity: 1,
    transparent: false,
    alphaTest: 0,
    visible: true,
  },
  textures: {
    diffuse: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
    normal: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
    roughness: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
    metalness: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
    emissive: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
    ao: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
    displacement: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
    environment: { enabled: false, repeat: { x: 1, y: 1 }, offset: { x: 0, y: 0 }, rotation: 0, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' },
  },
  render: {
    side: 'DoubleSide',
    flatShading: false,
    blending: 'NormalBlending',
    depthTest: true,
    depthWrite: true,
    wireframe: false,
  },
  customData: {},
};

// 材质类型选项
export const MATERIAL_TYPE_OPTIONS = [
  { label: 'MeshStandardMaterial', value: 'MeshStandardMaterial' },
  { label: 'MeshBasicMaterial', value: 'MeshBasicMaterial' },
  { label: 'MeshPhongMaterial', value: 'MeshPhongMaterial' },
  { label: 'MeshLambertMaterial', value: 'MeshLambertMaterial' },
  { label: 'MeshPhysicalMaterial', value: 'MeshPhysicalMaterial' },
  { label: 'MeshToonMaterial', value: 'MeshToonMaterial' },
];

// 混合模式选项
export const BLENDING_MODE_OPTIONS = [
  { label: 'Normal', value: 'NormalBlending' },
  { label: 'Additive', value: 'AdditiveBlending' },
  { label: 'Subtractive', value: 'SubtractiveBlending' },
  { label: 'Multiply', value: 'MultiplyBlending' },
  { label: 'No Blending', value: 'NoBlending' },
  { label: 'Custom', value: 'CustomBlending' },
];

// 渲染面选项
export const SIDE_OPTIONS = [
  { label: 'Double', value: 'DoubleSide' },
  { label: 'Front', value: 'FrontSide' },
  { label: 'Back', value: 'BackSide' },
];