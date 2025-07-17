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
  enableFog: (color: string, near: number, far: number) => void;
  disableFog: () => void;
  enableShadows: () => void;
  disableShadows: () => void;
}