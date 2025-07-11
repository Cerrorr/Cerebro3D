/**
 * React Three Fiber 环境效果 Hook
 * 封装环境效果功能，遵循cursor rules规范
 * @author Cerror
 * @since 2025-07-11
 */

import React, { useCallback, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useAppSelector } from '@/store';
import type { UseEnvironmentResult, LightConfig } from './types';

/**
 * 基于React Three Fiber的环境效果Hook
 * 专门处理场景的灯光、网格、坐标轴等环境元素
 */
export const useEnvironment = (): UseEnvironmentResult => {
  const { scene } = useThree();
  const { canvasSettings } = useAppSelector(state => state.scene);

  // 默认灯光配置
  const lightConfig: LightConfig = useMemo(() => ({
    ambientIntensity: 0.6,
    directionalIntensity: 0.5,
    directionalPosition: [5, 10, 7],
  }), []);

  // 更新灯光强度
  const updateLightIntensity = useCallback((lightType: 'ambient' | 'directional', intensity: number) => {
    scene.traverse((child) => {
      if (lightType === 'ambient' && child.type === 'AmbientLight') {
        (child as THREE.AmbientLight).intensity = intensity;
      } else if (lightType === 'directional' && child.type === 'DirectionalLight') {
        (child as THREE.DirectionalLight).intensity = intensity;
      }
    });
  }, [scene]);

  // 渲染灯光元素
  const lightElements = useMemo(() => [
    React.createElement('ambientLight', { key: "ambient", intensity: lightConfig.ambientIntensity }),
    React.createElement('directionalLight', { 
      key: "directional", 
      position: lightConfig.directionalPosition, 
      intensity: lightConfig.directionalIntensity 
    })
  ], [lightConfig]);

  // 渲染网格元素
  const gridElement = useMemo(() => {
    return canvasSettings.gridVisible ? 
      React.createElement('gridHelper', { key: "grid", args: [50, 50] }) : 
      null;
  }, [canvasSettings.gridVisible]);

  // 渲染坐标轴元素
  const axisElement = useMemo(() => {
    return canvasSettings.axisVisible ? 
      React.createElement('axesHelper', { key: "axis", args: [5] }) : 
      null;
  }, [canvasSettings.axisVisible]);

  return {
    lightElements,
    gridElement,
    axisElement,
    updateLightIntensity,
  };
};