/**
 * useCamera Hook 类型定义
 * @author Cerror
 * @since 2025-07-11
 */

import { Vector3 } from 'three';

/**
 * useCamera Hook 返回值类型
 */
export interface UseCameraResult {
  camera: THREE.Camera;
  setPosition: (position: Vector3 | [number, number, number]) => void;
  lookAt: (target: Vector3 | [number, number, number]) => void;
  resetToView: (view: 'perspective' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom') => void;
  zoomToFit: () => void;
  getCurrentPosition: () => [number, number, number];
  getCurrentTarget: () => [number, number, number];
}