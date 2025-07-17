/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description useCameraControl Hook 类型定义
 */

import type { RootState } from '@react-three/fiber';
import { Vector3 } from 'three';

export interface UseCameraControlOptions {
  autoRotate?: boolean;
  rotationSpeed?: number;
  enableZoom?: boolean;
  minDistance?: number;
  maxDistance?: number;
  enablePan?: boolean;
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
}