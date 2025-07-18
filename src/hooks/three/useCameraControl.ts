/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 相机控制和管理Hook
 */

import { useThree, useFrame } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';
import { Vector3, Box3 } from 'three';
import type { UseCameraControlOptions, UseCameraControlResult, ViewType, ViewPreset } from './types';

// 预设视图配置
const VIEW_PRESETS: Record<ViewType, ViewPreset> = {
  perspective: {
    position: new Vector3(10, 10, 10),
    target: new Vector3(0, 0, 0),
  },
  front: {
    position: new Vector3(0, 0, 15),
    target: new Vector3(0, 0, 0),
    up: new Vector3(0, 1, 0),
  },
  back: {
    position: new Vector3(0, 0, -15),
    target: new Vector3(0, 0, 0),
    up: new Vector3(0, 1, 0),
  },
  left: {
    position: new Vector3(-15, 0, 0),
    target: new Vector3(0, 0, 0),
    up: new Vector3(0, 1, 0),
  },
  right: {
    position: new Vector3(15, 0, 0),
    target: new Vector3(0, 0, 0),
    up: new Vector3(0, 1, 0),
  },
  top: {
    position: new Vector3(0, 15, 0),
    target: new Vector3(0, 0, 0),
    up: new Vector3(0, 0, -1),
  },
  bottom: {
    position: new Vector3(0, -15, 0),
    target: new Vector3(0, 0, 0),
    up: new Vector3(0, 0, 1),
  },
};

/**
 * 相机控制Hook
 * 提供相机位置、目标、动画、六视图切换、缩放等控制功能
 */
export const useCameraControl = (options: UseCameraControlOptions = {}): UseCameraControlResult => {
  const { camera, scene } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentView, setCurrentViewState] = useState<ViewType | null>('perspective');
  
  const animationRef = useRef<{
    startPosition: Vector3;
    endPosition: Vector3;
    startTarget: Vector3;
    endTarget: Vector3;
    startUp?: Vector3;
    endUp?: Vector3;
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
    const resetTarget = new Vector3(0, 0, 0);
    const animationDuration = options.animationDuration || 1000;
    
    setIsAnimating(true);
    animationRef.current = {
      startPosition: camera.position.clone(),
      endPosition: initialPosition.current.clone(),
      startTarget: target.clone(),
      endTarget: resetTarget.clone(),
      duration: animationDuration,
      elapsed: 0
    };
    
    setCurrentViewState('perspective');
  }, [camera, target, options.animationDuration]);

  // 动画到指定位置
  const animateToPosition = useCallback((endPosition: Vector3, duration = 1000) => {
    setIsAnimating(true);
    animationRef.current = {
      startPosition: camera.position.clone(),
      endPosition: endPosition.clone(),
      startTarget: target.clone(),
      endTarget: target.clone(),
      duration,
      elapsed: 0
    };
  }, [camera, target]);

  // 六视图切换
  const setView = useCallback((view: ViewType, distance?: number) => {
    const preset = VIEW_PRESETS[view];
    if (!preset) return;

    const targetPosition = preset.position.clone();
    const targetTarget = preset.target.clone();
    const targetUp = preset.up?.clone();
    
    // 如果指定了距离，调整相机位置
    if (distance !== undefined) {
      const direction = targetPosition.clone().normalize();
      targetPosition.copy(direction.multiplyScalar(distance));
    }
    
    const animationDuration = options.animationDuration || 1000;
    
    setIsAnimating(true);
    animationRef.current = {
      startPosition: camera.position.clone(),
      endPosition: targetPosition,
      startTarget: target.clone(),
      endTarget: targetTarget,
      startUp: camera.up.clone(),
      endUp: targetUp,
      duration: animationDuration,
      elapsed: 0
    };
    
    setCurrentViewState(view);
  }, [camera, target, options.animationDuration]);

  // 获取当前视图
  const getCurrentView = useCallback(() => {
    return currentView;
  }, [currentView]);

  // 计算场景包围盒
  const getSceneBoundingBox = useCallback(() => {
    const box = new Box3();
    const hasObjects = scene.children.some(child => {
      // 排除光源、相机、辅助对象等
      return child.type === 'Mesh' || 
             child.type === 'Group' || 
             child.type === 'Object3D';
    });
    
    if (hasObjects) {
      box.setFromObject(scene);
    } else {
      // 如果没有对象，使用默认大小
      box.setFromCenterAndSize(new Vector3(0, 0, 0), new Vector3(10, 10, 10));
    }
    
    return box;
  }, [scene]);

  // 缩放到指定包围盒
  const zoomToFit = useCallback((boundingBox?: Box3) => {
    const box = boundingBox || getSceneBoundingBox();
    
    if (box.isEmpty()) {
      console.warn('包围盒为空，无法缩放');
      return;
    }
    
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // 计算相机距离，确保对象完全可见
    let distance: number;
    
    if ('fov' in camera) {
      // 透视相机
      const fov = camera.fov * (Math.PI / 180);
      distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.5; // 1.5倍缓冲
    } else {
      // 正交相机
      distance = maxDim * 2;
    }
    
    // 根据当前视图调整相机位置
    let newPosition: Vector3;
    
    if (currentView && currentView !== 'perspective') {
      const preset = VIEW_PRESETS[currentView];
      const direction = preset.position.clone().normalize();
      newPosition = center.clone().add(direction.multiplyScalar(distance));
    } else {
      // 透视视图，保持当前方向
      const direction = camera.position.clone().sub(target).normalize();
      newPosition = center.clone().add(direction.multiplyScalar(distance));
    }
    
    const animationDuration = options.animationDuration || 1000;
    
    setIsAnimating(true);
    animationRef.current = {
      startPosition: camera.position.clone(),
      endPosition: newPosition,
      startTarget: target.clone(),
      endTarget: center,
      duration: animationDuration,
      elapsed: 0
    };
  }, [camera, target, currentView, getSceneBoundingBox, options.animationDuration]);

  // 缩放到全部对象
  const zoomToFitAll = useCallback(() => {
    const boundingBox = getSceneBoundingBox();
    zoomToFit(boundingBox);
  }, [getSceneBoundingBox, zoomToFit]);

  // 相机动画帧更新
  useFrame((state, delta) => {
    if (animationRef.current && isAnimating) {
      const { 
        startPosition, 
        endPosition, 
        startTarget, 
        endTarget,
        startUp,
        endUp,
        duration 
      } = animationRef.current;
      
      animationRef.current.elapsed += delta * 1000;

      const progress = Math.min(animationRef.current.elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      // 插值相机位置
      camera.position.lerpVectors(startPosition, endPosition, easeProgress);
      
      // 插值目标位置
      const currentTarget = new Vector3().lerpVectors(startTarget, endTarget, easeProgress);
      setTargetState(currentTarget);
      
      // 插值相机朝向（如果指定了up向量）
      if (startUp && endUp) {
        camera.up.lerpVectors(startUp, endUp, easeProgress);
      }
      
      camera.lookAt(currentTarget);

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
    isAnimating,
    setView,
    getCurrentView,
    zoomToFit,
    zoomToFitAll
  };
};