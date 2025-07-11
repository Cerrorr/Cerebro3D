/**
 * React Three Fiber 相机控制 Hook
 * 封装相机操作功能，遵循cursor rules规范
 * @author Cerror
 * @since 2025-07-11
 */

import { useThree } from '@react-three/fiber';
import { useCallback, useEffect } from 'react';
import { Vector3 } from 'three';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateCameraPosition, updateCameraTarget, setCurrentView } from '@/store/slices/sceneSlice';
import type { UseCameraResult } from './types';

/**
 * 预定义视图位置
 */
const VIEW_POSITIONS = {
  perspective: [6, 4, 6] as [number, number, number],
  front: [0, 0, 10] as [number, number, number],
  back: [0, 0, -10] as [number, number, number],
  left: [-10, 0, 0] as [number, number, number],
  right: [10, 0, 0] as [number, number, number],
  top: [0, 10, 0] as [number, number, number],
  bottom: [0, -10, 0] as [number, number, number],
};

/**
 * 基于React Three Fiber的相机控制Hook
 * 专门处理相机的位置、朝向和视图切换
 */
export const useCamera = (): UseCameraResult => {
  const { camera } = useThree();
  const dispatch = useAppDispatch();
  const { cameraPosition, cameraTarget } = useAppSelector(state => state.scene);

  // 设置相机位置
  const setPosition = useCallback((position: Vector3 | [number, number, number]) => {
    if (Array.isArray(position)) {
      camera.position.set(position[0], position[1], position[2]);
      dispatch(updateCameraPosition(position));
    } else {
      camera.position.copy(position);
      dispatch(updateCameraPosition([position.x, position.y, position.z]));
    }
  }, [camera, dispatch]);

  // 设置相机朝向
  const lookAt = useCallback((target: Vector3 | [number, number, number]) => {
    if (Array.isArray(target)) {
      camera.lookAt(target[0], target[1], target[2]);
      dispatch(updateCameraTarget(target));
    } else {
      camera.lookAt(target);
      dispatch(updateCameraTarget([target.x, target.y, target.z]));
    }
  }, [camera, dispatch]);

  // 重置到指定视图
  const resetToView = useCallback((view: keyof typeof VIEW_POSITIONS) => {
    const position = VIEW_POSITIONS[view];
    setPosition(position);
    lookAt([0, 0, 0]);
    dispatch(setCurrentView(view));
  }, [setPosition, lookAt, dispatch]);

  // 缩放适配场景
  const zoomToFit = useCallback(() => {
    // 这里可以实现自动计算场景边界并调整相机位置的逻辑
    // 暂时设置为默认透视视图
    resetToView('perspective');
  }, [resetToView]);

  // 获取当前相机位置
  const getCurrentPosition = useCallback((): [number, number, number] => {
    return [camera.position.x, camera.position.y, camera.position.z];
  }, [camera]);

  // 获取当前相机目标点
  const getCurrentTarget = useCallback((): [number, number, number] => {
    return cameraTarget;
  }, [cameraTarget]);

  // 同步Redux状态到相机
  useEffect(() => {
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
  }, [camera, cameraPosition]);

  useEffect(() => {
    camera.lookAt(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
  }, [camera, cameraTarget]);

  return {
    camera,
    setPosition,
    lookAt,
    resetToView,
    zoomToFit,
    getCurrentPosition,
    getCurrentTarget,
  };
};