/**
 * 天气配置相关常量
 * @author Cerror
 * @since 2025-07-11
 */

import { WeatherConfig } from '../types/WeatherConfig.types';

/**
 * 默认天气配置
 * @author Cerror
 * @since 2024-01-22
 */
export const DEFAULT_WEATHER_CONFIG: WeatherConfig = {
  fog: {
    enabled: false,
    type: 'Linear',
    color: '#ffffff',
    near: 0.1,
    far: 50,
  },
  rain: {
    enabled: false,
    speed: 0.4,
    color: '#ffffff',
    size: 0.5,
    arc: 95,
    opacity: 0.4,
  },
  snow: {
    enabled: false,
    speed: 1,
    density: 1,
    size: 0.5,
    opacity: 0.5,
  },
};