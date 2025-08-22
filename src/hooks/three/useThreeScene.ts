/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 三维场景初始化和管理Hook
 */

import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';
import { Color, Fog, PCFSoftShadowMap, TextureLoader, EquirectangularReflectionMapping, Mesh, Material, MeshStandardMaterial, MeshPhysicalMaterial } from 'three';
import type { UseThreeSceneOptions, UseThreeSceneResult } from './types';

/**
 * 三维场景管理Hook
 * 处理场景初始化、背景、雾效、阴影等基础配置
 */
export const useThreeScene = (options: UseThreeSceneOptions = {}): UseThreeSceneResult => {
  const { scene, camera, gl: renderer } = useThree();

  // 设置背景颜色
  const setBackgroundColor = useCallback((color: string) => {
    scene.background = new Color(color);
  }, [scene]);

  // 设置背景纹理
  const setBackgroundTexture = useCallback((imageUrl: string) => {
    const loader = new TextureLoader();
    loader.load(imageUrl, (texture) => {
      scene.background = texture;
    });
  }, [scene]);

  // 设置天空盒（使用等距柱状投影）
  const setBackgroundSkybox = useCallback((imageUrl: string) => {
    const loader = new TextureLoader();
    loader.load(imageUrl, (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      scene.background = texture;
      // 移除自动设置环境贴图，由独立的环境设置控制
    });
  }, [scene]);

  // 设置环境贴图（独立于背景）
  const setEnvironmentMap = useCallback((type: 'none' | 'equirect' | 'cube', imageUrl?: string, intensity: number = 1) => {
    if (type === 'none') {
      scene.environment = null;
      return;
    }

    if (!imageUrl) {
      console.warn('Environment map URL is required when type is not "none"');
      return;
    }

    const loader = new TextureLoader();
    loader.load(imageUrl, (texture) => {
      if (type === 'equirect' || type === 'cube') {
        texture.mapping = EquirectangularReflectionMapping;
      }
      scene.environment = texture;
      
      // 设置环境强度（通过调整场景中所有材质的环境贴图强度）
      scene.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: Material) => {
              if (mat instanceof MeshStandardMaterial || mat instanceof MeshPhysicalMaterial) {
                mat.envMapIntensity = intensity;
                mat.needsUpdate = true;
              }
            });
          } else {
            const material = mesh.material as Material;
            if (material instanceof MeshStandardMaterial || material instanceof MeshPhysicalMaterial) {
              material.envMapIntensity = intensity;
              material.needsUpdate = true;
            }
          }
        }
      });
    });
  }, [scene]);

  // 通用背景设置方法
  const setBackground = useCallback((type: 'color' | 'texture' | 'skybox', value: string) => {
    switch (type) {
      case 'color':
        setBackgroundColor(value);
        break;
      case 'texture':
        setBackgroundTexture(value);
        break;
      case 'skybox':
        setBackgroundSkybox(value);
        break;
    }
  }, [setBackgroundColor, setBackgroundTexture, setBackgroundSkybox]);

  // 启用雾效
  const enableFog = useCallback((color: string, near: number, far: number) => {
    scene.fog = new Fog(color, near, far);
  }, [scene]);

  // 禁用雾效
  const disableFog = useCallback(() => {
    scene.fog = null;
  }, [scene]);

  // 启用阴影
  const enableShadows = useCallback(() => {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
  }, [renderer]);

  // 禁用阴影
  const disableShadows = useCallback(() => {
    renderer.shadowMap.enabled = false;
  }, [renderer]);

  // 初始化场景配置
  useCallback(() => {
    if (options.backgroundColor) {
      setBackgroundColor(options.backgroundColor);
    }

    if (options.fog) {
      enableFog(options.fog.color, options.fog.near, options.fog.far);
    }

    if (options.enableShadows) {
      enableShadows();
    }
  }, [options, setBackgroundColor, enableFog, enableShadows]);

  return {
    scene,
    camera,
    renderer,
    setBackgroundColor,
    setBackgroundTexture,
    setBackgroundSkybox,
    setBackground,
    setEnvironmentMap,
    enableFog,
    disableFog,
    enableShadows,
    disableShadows
  };
};