/**
 * 天气效果组件
 * 在Three.js场景中渲染天气效果
 * @author Cerror
 * @since 2025-09-01
 */

import React from 'react';
import { useWeatherManager } from '@/hooks/three/useWeatherManager';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

/**
 * 天气效果组件
 * 管理场景中的天气效果渲染
 */
export const WeatherEffects: React.FC = () => {
  const weatherConfig = useSelector((state: RootState) => state.scene.weatherConfig);
  
  // 使用天气管理器
  useWeatherManager(weatherConfig);
  
  // 这个组件不需要渲染任何内容，它只管理天气效果
  return null;
};