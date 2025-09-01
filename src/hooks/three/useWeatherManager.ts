/**
 * 天气效果管理Hook
 * 提供天气效果的管理和同步功能
 * @author Cerror
 * @since 2025-09-01
 */

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { WeatherManager } from './services';
import type { WeatherConfig } from '@/components/projectEditor/rightPanels/types/WeatherConfig.types';

/**
 * 天气管理Hook
 * 管理场景中的天气效果
 */
export const useWeatherManager = (weatherConfig: WeatherConfig) => {
  const { scene } = useThree();
  const weatherManagerRef = useRef<WeatherManager | null>(null);

  useEffect(() => {
    // 初始化天气管理器
    if (!weatherManagerRef.current) {
      weatherManagerRef.current = new WeatherManager(scene);
      weatherManagerRef.current.startAnimation();
    }

    // 清理函数
    return () => {
      if (weatherManagerRef.current) {
        weatherManagerRef.current.destroy();
        weatherManagerRef.current = null;
      }
    };
  }, [scene]);

  useEffect(() => {
    // 更新天气配置
    if (weatherManagerRef.current) {
      weatherManagerRef.current.updateConfig(weatherConfig);
    }
  }, [weatherConfig]);

  return {
    weatherManager: weatherManagerRef.current,
    updateWeatherConfig: (config: WeatherConfig) => {
      if (weatherManagerRef.current) {
        weatherManagerRef.current.updateConfig(config);
      }
    }
  };
};