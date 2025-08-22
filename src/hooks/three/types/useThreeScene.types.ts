/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description useThreeScene Hook 类型定义
 */

import type { RootState } from '@react-three/fiber';

export interface UseThreeSceneOptions {
  backgroundColor?: string;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  enableShadows?: boolean;
}

export interface UseThreeSceneResult {
  scene: RootState['scene'];
  camera: RootState['camera'];
  renderer: RootState['gl'];
  setBackgroundColor: (color: string) => void;
  setBackgroundTexture: (imageUrl: string) => void;
  setBackgroundSkybox: (imageUrl: string) => void;
  setBackground: (type: 'color' | 'texture' | 'skybox', value: string) => void;
  setEnvironmentMap: (type: 'none' | 'equirect' | 'cube', imageUrl?: string, intensity?: number) => void;
  enableFog: (color: string, near: number, far: number) => void;
  disableFog: () => void;
  enableShadows: () => void;
  disableShadows: () => void;
}