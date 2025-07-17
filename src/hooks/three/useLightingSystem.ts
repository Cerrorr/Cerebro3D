/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 光照系统管理Hook
 */

import { useThree } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import { AmbientLight, DirectionalLight, Vector3 } from 'three';
import type { UseLightingSystemOptions, UseLightingSystemResult } from './types';

/**
 * 光照系统Hook
 * 管理环境光、平行光等光照配置
 */
export const useLightingSystem = (options: UseLightingSystemOptions = {}): UseLightingSystemResult => {
  const { scene } = useThree();
  const ambientLightRef = useRef<AmbientLight | null>(null);
  const directionalLightRef = useRef<DirectionalLight | null>(null);
  const [ambientLight, setAmbientLight] = useState<AmbientLight | null>(null);
  const [directionalLight, setDirectionalLight] = useState<DirectionalLight | null>(null);

  // 添加环境光
  const addAmbientLight = useCallback((intensity = 0.6, color = '#ffffff') => {
    if (ambientLightRef.current) {
      scene.remove(ambientLightRef.current);
    }

    const light = new AmbientLight(color, intensity);
    ambientLightRef.current = light;
    setAmbientLight(light);
    scene.add(light);
    
    return light;
  }, [scene]);

  // 移除环境光
  const removeAmbientLight = useCallback(() => {
    if (ambientLightRef.current) {
      scene.remove(ambientLightRef.current);
      ambientLightRef.current = null;
      setAmbientLight(null);
    }
  }, [scene]);

  // 添加平行光
  const addDirectionalLight = useCallback((
    position = new Vector3(5, 5, 5), 
    intensity = 1
  ) => {
    if (directionalLightRef.current) {
      scene.remove(directionalLightRef.current);
    }

    const light = new DirectionalLight('#ffffff', intensity);
    light.position.copy(position);
    
    if (options.enableShadows) {
      light.castShadow = true;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 50;
      light.shadow.camera.left = -10;
      light.shadow.camera.right = 10;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
    }

    directionalLightRef.current = light;
    setDirectionalLight(light);
    scene.add(light);
    
    return light;
  }, [scene, options.enableShadows]);

  // 移除平行光
  const removeDirectionalLight = useCallback(() => {
    if (directionalLightRef.current) {
      scene.remove(directionalLightRef.current);
      directionalLightRef.current = null;
      setDirectionalLight(null);
    }
  }, [scene]);

  // 更新环境光强度
  const updateAmbientIntensity = useCallback((intensity: number) => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = intensity;
    }
  }, []);

  // 更新平行光强度
  const updateDirectionalIntensity = useCallback((intensity: number) => {
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = intensity;
    }
  }, []);

  // 更新平行光位置
  const updateDirectionalPosition = useCallback((position: Vector3) => {
    if (directionalLightRef.current) {
      directionalLightRef.current.position.copy(position);
    }
  }, []);

  return {
    ambientLight,
    directionalLight,
    addAmbientLight,
    removeAmbientLight,
    addDirectionalLight,
    removeDirectionalLight,
    updateAmbientIntensity,
    updateDirectionalIntensity,
    updateDirectionalPosition
  };
};