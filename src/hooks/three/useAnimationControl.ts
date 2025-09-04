/**
 * 动画控制Hook
 * 提供动画播放控制的React Hook接口
 * @author Cerror
 * @since 2025-09-04
 */

import { useCallback, useEffect, useRef } from 'react';
import { AnimationClip, Object3D } from 'three';
import { globalAnimationManager } from './services';
import type { AnimationStatus } from '@/components/projectEditor/rightPanels/types/AnimationPanel.types';

/**
 * 动画控制Hook选项
 */
export interface UseAnimationControlOptions {
  onAnimationUpdate?: (animationId: string, status: AnimationStatus, progress: number) => void;
}

/**
 * 动画控制Hook返回值
 */
export interface UseAnimationControlResult {
  // 注册带动画的对象
  registerAnimatedObject: (objectId: string, object: Object3D, clips: AnimationClip[], animationItems?: any[]) => void;
  // 移除对象动画
  removeAnimatedObject: (objectId: string) => void;
  // 播放动画
  playAnimation: (animationId: string, loop?: boolean) => void;
  // 暂停动画
  pauseAnimation: (animationId: string) => void;
  // 停止动画
  stopAnimation: (animationId: string) => void;
  // 设置动画进度
  setAnimationProgress: (animationId: string, progress: number) => void;
  // 设置播放速度
  setPlaybackSpeed: (speed: number) => void;
  // 停止所有动画
  stopAllAnimations: () => void;
}

/**
 * 动画控制Hook
 * @param options 配置选项
 * @returns 动画控制接口
 */
export const useAnimationControl = (
  options: UseAnimationControlOptions = {}
): UseAnimationControlResult => {
  const { onAnimationUpdate } = options;
  
  // 保存回调函数的引用
  const onUpdateRef = useRef(onAnimationUpdate);
  onUpdateRef.current = onAnimationUpdate;

  // 设置动画更新监听器
  useEffect(() => {
    globalAnimationManager.setAnimationUpdateListener((event) => {
      if (onUpdateRef.current) {
        onUpdateRef.current(event.animationId, event.status, event.progress);
      }
    });
  }, []);

  // 注册带动画的对象
  const registerAnimatedObject = useCallback((objectId: string, object: Object3D, clips: AnimationClip[], animationItems?: any[]) => {
    globalAnimationManager.createController(objectId, object, clips, animationItems);
  }, []);

  // 移除对象动画
  const removeAnimatedObject = useCallback((objectId: string) => {
    globalAnimationManager.removeController(objectId);
  }, []);

  // 播放动画
  const playAnimation = useCallback((animationId: string, loop: boolean = false) => {
    globalAnimationManager.playAnimation(animationId, loop);
  }, []);

  // 暂停动画
  const pauseAnimation = useCallback((animationId: string) => {
    globalAnimationManager.pauseAnimation(animationId);
  }, []);

  // 停止动画
  const stopAnimation = useCallback((animationId: string) => {
    globalAnimationManager.stopAnimation(animationId);
  }, []);

  // 设置动画进度
  const setAnimationProgress = useCallback((animationId: string, progress: number) => {
    globalAnimationManager.setAnimationProgress(animationId, progress);
  }, []);

  // 设置播放速度
  const setPlaybackSpeed = useCallback((speed: number) => {
    globalAnimationManager.setGlobalSpeed(speed);
  }, []);

  // 停止所有动画
  const stopAllAnimations = useCallback(() => {
    globalAnimationManager.stopAllAnimations();
  }, []);

  return {
    registerAnimatedObject,
    removeAnimatedObject,
    playAnimation,
    pauseAnimation,
    stopAnimation,
    setAnimationProgress,
    setPlaybackSpeed,
    stopAllAnimations,
  };
};