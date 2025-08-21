/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 三维场景初始化和管理Hook
 */

import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';
import { Color, Fog, PCFSoftShadowMap, TextureLoader, EquirectangularReflectionMapping } from 'three';
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
      scene.environment = texture; // 同时设置环境贴图
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
    enableFog,
    disableFog,
    enableShadows,
    disableShadows
  };
};