/**
 * 对象面板常量定义
 * @author Cerror
 * @since 2025-07-11
 */

import type { 
  ObjectState, 
  ObjectType 
} from '../types/ObjectPanel.types';

/**
 * 默认对象状态
 * 定义对象面板的默认状态配置
 */
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

/**
 * 对象类型图标映射表
 * 定义每种对象类型对应的图标
 */
export const OBJECT_TYPE_ICONS: Record<ObjectType, string> = {
  'Group': '📁',
  'Mesh': '🧊',
  'Light': '💡',
  'Camera': '📹',
  'Scene': '🎬',
  'Object3D': '📦'
};

/**
 * 对象类型颜色映射表
 * 定义每种对象类型对应的显示颜色
 */
export const OBJECT_TYPE_COLORS: Record<ObjectType, string> = {
  'Group': '#52c41a',
  'Mesh': '#1890ff',
  'Light': '#faad14',
  'Camera': '#722ed1',
  'Scene': '#13c2c2',
  'Object3D': '#8c8c8c'
};