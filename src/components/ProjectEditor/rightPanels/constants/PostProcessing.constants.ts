/**
 * 后期处理配置相关常量
 * @author Cerror
 * @since 2025-07-11
 */

import { PostProcessingConfig } from '../types/PostProcessing.types';

// 默认后期处理配置
export const DEFAULT_POST_PROCESSING_CONFIG: PostProcessingConfig = {
  antialiasing: {
    enabled: false,
  },
  outline: {
    enabled: false,
    edgeStrength: 1.0,
    edgeGlow: 0.0,
    edgeThickness: 1.0,
    visibleEdgeColor: '#ffee00',
    hiddenEdgeColor: '#ff6a00',
  },
  bloom: {
    enabled: false,
    radius: 0.4,
    threshold: 0.85,
    strength: 1.0,
  },
  lut: {
    enabled: false,
    lutType: 'Bourbon 64.CUBE',
    intensity: 1.0,
  },
  motionBlur: {
    enabled: false,
    decay: 0.9,
  },
  zoom: {
    enabled: false,
    focus: 1.0,
    aperture: 0.025,
    maxBlur: 0.01,
  },
  pixel: {
    enabled: false,
    pixelSize: 6.0,
    normalEdgeStrength: 0.3,
    depthEdgeStrength: 0.4,
  },
  halftone: {
    enabled: false,
    shape: 'dot',
    radius: 4.0,
    rotateR: 15.0,
    rotateG: 45.0,
    rotateB: 0.0,
    scatter: 0.0,
    blending: 1.0,
    blendingMode: 'linear',
    greyscale: false,
  },
};