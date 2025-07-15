/**
 * @author Claude
 * @createTime 2025-07-15
 * @description 物体控制和变换Hook
 */

import { useFrame } from '@react-three/fiber';
import { useRef, useCallback, useState } from 'react';
import { Mesh, Group, Vector3, Euler } from 'three';
import type { UseObjectControlOptions, UseObjectControlResult } from './types';

/**
 * 物体控制Hook
 * 提供网格物体的位置、旋转、缩放、动画等控制功能
 */
export const useObjectControl = (options: UseObjectControlOptions = {}): UseObjectControlResult => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  
  const [position, setPositionState] = useState(new Vector3(0, 0, 0));
  const [rotation, setRotationState] = useState(new Euler(0, 0, 0));
  const [scale, setScaleState] = useState(new Vector3(1, 1, 1));
  const [isHovered, setIsHovered] = useState(false);
  const [isRotating, setIsRotating] = useState(options.autoRotate || false);

  const animationRef = useRef<{
    type: 'position' | 'scale';
    startValue: Vector3;
    endValue: Vector3;
    duration: number;
    elapsed: number;
  } | null>(null);

  // 设置位置
  const setPosition = useCallback((newPosition: Vector3) => {
    setPositionState(newPosition.clone());
    if (meshRef.current) {
      meshRef.current.position.copy(newPosition);
    }
    if (groupRef.current) {
      groupRef.current.position.copy(newPosition);
    }
  }, []);

  // 设置旋转
  const setRotation = useCallback((newRotation: Euler) => {
    setRotationState(newRotation.clone());
    if (meshRef.current) {
      meshRef.current.rotation.copy(newRotation);
    }
    if (groupRef.current) {
      groupRef.current.rotation.copy(newRotation);
    }
  }, []);

  // 设置缩放
  const setScale = useCallback((newScale: Vector3) => {
    setScaleState(newScale.clone());
    if (meshRef.current) {
      meshRef.current.scale.copy(newScale);
    }
    if (groupRef.current) {
      groupRef.current.scale.copy(newScale);
    }
  }, []);

  // 开始旋转
  const startRotation = useCallback(() => {
    setIsRotating(true);
  }, []);

  // 停止旋转
  const stopRotation = useCallback(() => {
    setIsRotating(false);
  }, []);

  // 切换旋转状态
  const toggleRotation = useCallback(() => {
    setIsRotating(prev => !prev);
  }, []);

  // 动画到目标位置
  const animateToPosition = useCallback((targetPosition: Vector3, duration = 1000) => {
    const currentPos = meshRef.current?.position || groupRef.current?.position;
    if (currentPos) {
      animationRef.current = {
        type: 'position',
        startValue: currentPos.clone(),
        endValue: targetPosition.clone(),
        duration,
        elapsed: 0
      };
    }
  }, []);

  // 动画到目标缩放
  const animateToScale = useCallback((targetScale: Vector3, duration = 1000) => {
    const currentScale = meshRef.current?.scale || groupRef.current?.scale;
    if (currentScale) {
      animationRef.current = {
        type: 'scale',
        startValue: currentScale.clone(),
        endValue: targetScale.clone(),
        duration,
        elapsed: 0
      };
    }
  }, []);

  // 悬停处理器
  const hoverHandlers = {
    onPointerEnter: useCallback(() => {
      setIsHovered(true);
      if (options.enableHover && options.hoverScale) {
        const hoverScale = new Vector3(options.hoverScale, options.hoverScale, options.hoverScale);
        animateToScale(hoverScale, 200);
      }
    }, [options.enableHover, options.hoverScale, animateToScale]),

    onPointerLeave: useCallback(() => {
      setIsHovered(false);
      if (options.enableHover) {
        animateToScale(new Vector3(1, 1, 1), 200);
      }
    }, [options.enableHover, animateToScale])
  };

  // 帧更新
  useFrame((_, delta) => {
    const object = meshRef.current || groupRef.current;
    if (!object) return;

    // 自动旋转
    if (isRotating) {
      const speed = options.rotationSpeed || 1;
      const axis = options.rotationAxis || 'y';
      object.rotation[axis] += delta * speed;
    }

    // 动画更新
    if (animationRef.current) {
      const { type, startValue, endValue, duration } = animationRef.current;
      animationRef.current.elapsed += delta * 1000;

      const progress = Math.min(animationRef.current.elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      if (type === 'position') {
        object.position.lerpVectors(startValue, endValue, easeProgress);
        setPositionState(object.position.clone());
      } else if (type === 'scale') {
        object.scale.lerpVectors(startValue, endValue, easeProgress);
        setScaleState(object.scale.clone());
      }

      if (progress >= 1) {
        animationRef.current = null;
      }
    }
  });

  return {
    meshRef,
    groupRef,
    position,
    rotation,
    scale,
    isHovered,
    isRotating,
    setPosition,
    setRotation,
    setScale,
    startRotation,
    stopRotation,
    toggleRotation,
    animateToPosition,
    animateToScale,
    hoverHandlers
  };
};