/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description useCameraControl Hook 类型定义
 */

import type { RootState } from '@react-three/fiber';
import { Vector3, Box3 } from 'three';

/**
 * 视图类型枚举
 */
export type ViewType = 'perspective' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

/**
 * 预设视图配置
 */
export interface ViewPreset {
  position: Vector3;
  target: Vector3;
  up?: Vector3;
}

export interface UseCameraControlOptions {
  autoRotate?: boolean;
  rotationSpeed?: number;
  enableZoom?: boolean;
  minDistance?: number;
  maxDistance?: number;
  enablePan?: boolean;
  // 动画持续时间（毫秒）
  animationDuration?: number;
}

export interface UseCameraControlResult {
  camera: RootState['camera'];
  position: Vector3;
  target: Vector3;
  setPosition: (position: Vector3) => void;
  setTarget: (target: Vector3) => void;
  lookAt: (target: Vector3) => void;
  resetCamera: () => void;
  animateToPosition: (position: Vector3, duration?: number) => void;
  isAnimating: boolean;
  
  // 六视图功能
  setView: (view: ViewType, distance?: number) => void;
  getCurrentView: () => ViewType | null;
  
  // 缩放功能
  zoomToFit: (boundingBox?: Box3) => void;
  zoomToFitAll: () => void;
}