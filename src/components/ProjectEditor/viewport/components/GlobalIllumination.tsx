/**
 * 全局光影效果组件 - 基于渲染器配置应用全局光影（性能优化版）
 * @author Cerror
 * @since 2025-08-28
 */

import React, { useEffect, useRef, useMemo, memo } from 'react';
import { useThree } from '@react-three/fiber';
import { useAppSelector } from '@/store';
import * as THREE from 'three';

export interface GlobalIlluminationProps {
  // 可选的额外配置
}

const GlobalIllumination: React.FC<GlobalIlluminationProps> = memo(() => {
  const { scene, gl } = useThree();
  const { globalIllumination } = useAppSelector(state => state.renderer.config);
  
  // 使用ref来缓存光源，避免重复创建
  const globalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const lastConfigRef = useRef<typeof globalIllumination | null>(null);

  // 分离配置以减少不必要的重渲染
  const lightConfig = useMemo(() => ({
    enabled: globalIllumination.enabled,
    intensity: globalIllumination.lightIntensity,
    color: globalIllumination.lightColor,
  }), [
    globalIllumination.enabled,
    globalIllumination.lightIntensity,
    globalIllumination.lightColor,
  ]);

  const lightPosition = useMemo(() => ({
    x: globalIllumination.lightDirectionX * 10,
    y: globalIllumination.lightDirectionY * 10,
    z: globalIllumination.lightDirectionZ * 10,
  }), [
    globalIllumination.lightDirectionX,
    globalIllumination.lightDirectionY,
    globalIllumination.lightDirectionZ,
  ]);

  const shadowConfig = useMemo(() => ({
    enabled: globalIllumination.bounce,
    distance: globalIllumination.shadowDistance,
    mapSize: globalIllumination.shadowMapSize,
    cascadeSplits: globalIllumination.cascadeSplits,
  }), [
    globalIllumination.bounce,
    globalIllumination.shadowDistance,
    globalIllumination.shadowMapSize,
    globalIllumination.cascadeSplits,
  ]);

  // 创建或更新全局光影
  useEffect(() => {
    if (!scene || !gl) return;

    if (!lightConfig.enabled) {
      // 如果禁用，移除现有光源
      if (globalLightRef.current) {
        scene.remove(globalLightRef.current);
        scene.remove(globalLightRef.current.target);
        globalLightRef.current = null;
      }
      return;
    }

    // 如果光源不存在，创建新的
    if (!globalLightRef.current) {
      const globalLight = new THREE.DirectionalLight();
      globalLight.name = 'global-illumination-light';
      globalLight.target.position.set(0, 0, 0);
      
      scene.add(globalLight);
      scene.add(globalLight.target);
      globalLightRef.current = globalLight;
    }

    const globalLight = globalLightRef.current;

    // 更新光源属性（只在值实际改变时更新）
    const lastConfig = lastConfigRef.current;
    
    if (!lastConfig || lastConfig.lightIntensity !== lightConfig.intensity) {
      globalLight.intensity = lightConfig.intensity;
    }

    if (!lastConfig || lastConfig.lightColor !== lightConfig.color) {
      globalLight.color.setHex(parseInt(lightConfig.color.replace('#', '0x')));
    }

  }, [scene, gl, lightConfig]);

  // 更新光源位置（独立处理以提高性能）
  useEffect(() => {
    if (!globalLightRef.current) return;

    const lastConfig = lastConfigRef.current;
    if (lastConfig && 
        lastConfig.lightDirectionX === globalIllumination.lightDirectionX &&
        lastConfig.lightDirectionY === globalIllumination.lightDirectionY &&
        lastConfig.lightDirectionZ === globalIllumination.lightDirectionZ) {
      return;
    }

    globalLightRef.current.position.set(
      lightPosition.x,
      lightPosition.y,
      lightPosition.z
    );

  }, [lightPosition, globalIllumination.lightDirectionX, globalIllumination.lightDirectionY, globalIllumination.lightDirectionZ]);

  // 更新阴影配置（独立处理）
  useEffect(() => {
    if (!globalLightRef.current) return;

    const globalLight = globalLightRef.current;
    const lastConfig = lastConfigRef.current;

    // 检查阴影启用状态
    if (!lastConfig || lastConfig.bounce !== shadowConfig.enabled) {
      globalLight.castShadow = shadowConfig.enabled;
    }

    if (!shadowConfig.enabled) return;

    // 更新阴影贴图尺寸
    if (!lastConfig || lastConfig.shadowMapSize !== shadowConfig.mapSize) {
      const mapSizeStr = shadowConfig.mapSize.split(' * ')[0];
      const mapSize = parseInt(mapSizeStr);
      
      if (globalLight.shadow.mapSize.width !== mapSize) {
        globalLight.shadow.mapSize.width = mapSize;
        globalLight.shadow.mapSize.height = mapSize;
        globalLight.shadow.map?.dispose(); // 释放旧的阴影贴图
        globalLight.shadow.map = null;
      }
    }

    // 更新阴影距离
    if (!lastConfig || lastConfig.shadowDistance !== shadowConfig.distance) {
      globalLight.shadow.camera.near = 0.5;
      globalLight.shadow.camera.far = shadowConfig.distance;
    }

    // 更新级联分割配置
    if (!lastConfig || lastConfig.cascadeSplits !== shadowConfig.cascadeSplits) {
      switch (shadowConfig.cascadeSplits) {
        case 'uniform':
          globalLight.shadow.bias = -0.0001;
          break;
        case 'logarithmic':
          globalLight.shadow.bias = -0.00005;
          break;
        case 'practical':
        default:
          globalLight.shadow.bias = -0.0005;
          break;
      }
    }

    // 设置阴影相机的视锥体大小（只在需要时更新）
    if (!lastConfig) {
      const d = 50;
      const shadowCamera = globalLight.shadow.camera as THREE.OrthographicCamera;
      shadowCamera.left = -d;
      shadowCamera.right = d;
      shadowCamera.top = d;
      shadowCamera.bottom = -d;
      shadowCamera.updateProjectionMatrix();
    }

  }, [shadowConfig]);

  // 更新配置引用
  useEffect(() => {
    lastConfigRef.current = globalIllumination;
  }, [globalIllumination]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (globalLightRef.current && scene) {
        scene.remove(globalLightRef.current);
        scene.remove(globalLightRef.current.target);
        globalLightRef.current = null;
      }
    };
  }, [scene]);

  // 这个组件不需要渲染任何内容，只负责配置同步
  return null;
});

GlobalIllumination.displayName = 'GlobalIllumination';

export default GlobalIllumination;