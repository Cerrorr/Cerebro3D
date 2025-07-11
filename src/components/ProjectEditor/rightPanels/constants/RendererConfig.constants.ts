/**
 * 渲染器配置相关常量
 * @author Cerror
 * @since 2025-07-11
 */

import { RendererConfig } from '../types/RendererConfig.types';

// 默认渲染器配置
export const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  antialiasing: {
    enabled: true,
  },
  toneMapping: {
    type: 'No',
  },
  frameRate: {
    type: '高帧率',
  },
  shadow: {
    enabled: true,
    type: 'PCF Soft',
  },
  globalIllumination: {
    enabled: false,
    bounce: false,
    shadowDistance: 1000,
    cascadeSplits: 'practical',
    shadowMapSize: '2048 * 2048',
    lightIntensity: 1,
    lightColor: '#ffffff',
    lightDirectionX: 0.5,
    lightDirectionY: 0.5,
    lightDirectionZ: 0.5,
  },
};