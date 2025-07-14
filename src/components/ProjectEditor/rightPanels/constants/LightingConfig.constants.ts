/**
 * 灯光配置相关常量
 * @author Cerror
 * @since 2025-07-11
 */

import { LightingConfig } from '../types/LightingConfig.types';

/**
 * 默认灯光配置
 */
export const DEFAULT_LIGHTING_CONFIG: LightingConfig = {
  ambient: {
    enabled: true,
    intensity: 0.6,
    color: '#ffffff'
  },
  directional: {
    enabled: true,
    intensity: 0.5,
    color: '#ffffff',
    position: { x: 5, y: 10, z: 7 },
    castShadow: true,
    shadowMapSize: 1024
  },
  hemisphere: {
    enabled: false,
    skyColor: '#87ceeb',
    groundColor: '#8b4513',
    intensity: 0.6,
    position: { x: 0, y: 1, z: 0 }
  },
  point: {
    enabled: false,
    color: '#ffffff',
    intensity: 1.0,
    distance: 100,
    decay: 2,
    position: { x: 0, y: 5, z: 0 },
    castShadow: false,
    shadowMapSize: 512
  },
  spot: {
    enabled: false,
    color: '#ffffff',
    intensity: 1.0,
    distance: 100,
    angle: Math.PI / 4,
    penumbra: 0.1,
    decay: 2,
    position: { x: 0, y: 10, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    castShadow: false,
    shadowMapSize: 512
  }
};