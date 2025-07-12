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
  // 相机实例
  camera: THREE.Camera;
  // 设置相机位置
  setPosition: (position: Vector3 | [number, number, number]) => void;
  // 设置相机朝向目标
  lookAt: (target: Vector3 | [number, number, number]) => void;
  // 重置到预设视角
  resetToView: (view: 'perspective' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom') => void;
  // 缩放到适合视野
  zoomToFit: () => void;
  // 获取当前相机位置
  getCurrentPosition: () => [number, number, number];
  // 获取当前相机目标点
  getCurrentTarget: () => [number, number, number];
}