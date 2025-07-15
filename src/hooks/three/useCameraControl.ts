/**
 * @author Claude
 * @createTime 2025-07-15
 * @description 相机控制和管理Hook
 */

import { useThree, useFrame } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import { Vector3 } from 'three';
import type { UseCameraControlOptions, UseCameraControlResult } from './types';

/**
 * 相机控制Hook
 * 提供相机位置、目标、动画等控制功能
 */
export const useCameraControl = (options: UseCameraControlOptions = {}): UseCameraControlResult => {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<{
    startPosition: Vector3;
    endPosition: Vector3;
    duration: number;
    elapsed: number;
  } | null>(null);

  const initialPosition = useRef(camera.position.clone());
  const [target, setTargetState] = useState(new Vector3(0, 0, 0));

  // 设置相机位置
  const setPosition = useCallback((position: Vector3) => {
    camera.position.copy(position);
  }, [camera]);

  // 设置相机目标
  const setTarget = useCallback((newTarget: Vector3) => {
    setTargetState(newTarget.clone());
    camera.lookAt(newTarget);
  }, [camera]);

  // 相机朝向目标
  const lookAt = useCallback((lookAtTarget: Vector3) => {
    camera.lookAt(lookAtTarget);
  }, [camera]);

  // 重置相机到初始位置
  const resetCamera = useCallback(() => {
    camera.position.copy(initialPosition.current);
    camera.lookAt(new Vector3(0, 0, 0));
    setTargetState(new Vector3(0, 0, 0));
  }, [camera]);

  // 动画到指定位置
  const animateToPosition = useCallback((endPosition: Vector3, duration = 1000) => {
    setIsAnimating(true);
    animationRef.current = {
      startPosition: camera.position.clone(),
      endPosition: endPosition.clone(),
      duration,
      elapsed: 0
    };
  }, [camera]);

  // 相机动画帧更新
  useFrame((state, delta) => {
    if (animationRef.current && isAnimating) {
      const { startPosition, endPosition, duration } = animationRef.current;
      animationRef.current.elapsed += delta * 1000;

      const progress = Math.min(animationRef.current.elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      camera.position.lerpVectors(startPosition, endPosition, easeProgress);

      if (progress >= 1) {
        setIsAnimating(false);
        animationRef.current = null;
      }
    }

    // 自动旋转
    if (options.autoRotate && !isAnimating) {
      const speed = options.rotationSpeed || 0.5;
      camera.position.x = Math.cos(state.clock.elapsedTime * speed) * 10;
      camera.position.z = Math.sin(state.clock.elapsedTime * speed) * 10;
      camera.lookAt(target);
    }
  });

  return {
    camera,
    position: camera.position,
    target,
    setPosition,
    setTarget,
    lookAt,
    resetCamera,
    animateToPosition,
    isAnimating
  };
};