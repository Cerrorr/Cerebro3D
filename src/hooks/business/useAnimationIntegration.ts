/**
 * 动画集成Hook
 * 协调模型导入和动画管理
 * @author Cerror
 * @since 2025-09-04
 */

import { useCallback } from 'react';
import { Object3D, AnimationClip } from 'three';
import { useFileImport } from '../three/useFileImport';
import { useAnimationControl } from '../three/useAnimationControl';
import type { FileImportResult } from '../three/types';
import type { AnimationItem } from '@/components/projectEditor/rightPanels/types/AnimationPanel.types';

/**
 * 动画集成Hook选项
 */
export interface UseAnimationIntegrationOptions {
  onAnimationsLoaded?: (animations: AnimationItem[]) => void;
  onModelLoaded?: (result: FileImportResult) => void;
}

/**
 * 动画集成Hook返回值
 */
export interface UseAnimationIntegrationResult {
  // 文件导入功能
  fileImportState: ReturnType<typeof useFileImport>['state'];
  uploadFiles: ReturnType<typeof useFileImport>['uploadFiles'];
  importFromUrl: ReturnType<typeof useFileImport>['importFromUrl'];
  dragDropHandlers: ReturnType<typeof useFileImport>['dragDropHandlers'];
  reset: ReturnType<typeof useFileImport>['reset'];
  
  // 动画控制功能
  registerAnimatedObject: (objectId: string, object: Object3D, clips: AnimationClip[]) => void;
  removeAnimatedObject: (objectId: string) => void;
  playAnimation: (animationId: string, loop?: boolean) => void;
  pauseAnimation: (animationId: string) => void;
  stopAnimation: (animationId: string) => void;
  setAnimationProgress: (animationId: string, progress: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  stopAllAnimations: () => void;
  
  // 集成功能
  processModelWithAnimations: (result: FileImportResult) => void;
}

/**
 * 动画集成Hook
 * 提供模型导入和动画管理的完整集成功能
 * @param options 配置选项
 * @returns 集成的文件导入和动画控制接口
 */
export const useAnimationIntegration = (
  options: UseAnimationIntegrationOptions = {}
): UseAnimationIntegrationResult => {
  const { onAnimationsLoaded, onModelLoaded } = options;

  // 文件导入Hook
  const fileImport = useFileImport({
    onSuccess: (result: FileImportResult) => {
      processModelWithAnimations(result);
      onModelLoaded?.(result);
    }
  });

  // 动画控制Hook
  const animationControl = useAnimationControl();

  /**
   * 处理带动画的模型
   * @param result 文件导入结果
   */
  const processModelWithAnimations = useCallback((result: FileImportResult) => {
    const { object, animations, animationClips } = result;

    if (animations && animations.length > 0 && animationClips && animationClips.length > 0) {
      // 通知上层组件有动画数据
      onAnimationsLoaded?.(animations);
      
      // 注册动画对象到动画管理器（使用原始的AnimationClip）
      animationControl.registerAnimatedObject(object.uuid, object, animationClips);
    }
  }, [onAnimationsLoaded, animationControl]);

  return {
    // 文件导入功能
    fileImportState: fileImport.state,
    uploadFiles: fileImport.uploadFiles,
    importFromUrl: fileImport.importFromUrl,
    dragDropHandlers: fileImport.dragDropHandlers,
    reset: fileImport.reset,
    
    // 动画控制功能
    registerAnimatedObject: animationControl.registerAnimatedObject,
    removeAnimatedObject: animationControl.removeAnimatedObject,
    playAnimation: animationControl.playAnimation,
    pauseAnimation: animationControl.pauseAnimation,
    stopAnimation: animationControl.stopAnimation,
    setAnimationProgress: animationControl.setAnimationProgress,
    setPlaybackSpeed: animationControl.setPlaybackSpeed,
    stopAllAnimations: animationControl.stopAllAnimations,
    
    // 集成功能
    processModelWithAnimations,
  };
};