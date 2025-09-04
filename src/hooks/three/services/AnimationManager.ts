/**
 * 动画管理器
 * 管理 Three.js 动画混合器和动画剪辑的播放控制
 * @author Cerror
 * @since 2025-09-04
 */

import { AnimationMixer, AnimationAction, AnimationClip, Object3D, LoopRepeat, LoopOnce } from 'three';
import type { AnimationStatus } from '@/components/projectEditor/rightPanels/types/AnimationPanel.types';

/**
 * 动画控制器接口
 */
export interface AnimationController {
  mixer: AnimationMixer;
  actions: Map<string, AnimationAction>;
  clips: AnimationClip[];
}

/**
 * 动画播放事件
 */
export interface AnimationPlayEvent {
  animationId: string;
  status: AnimationStatus;
  progress: number;
}

/**
 * 动画管理器类
 */
export class AnimationManager {
  private controllers = new Map<string, AnimationController>();
  private globalSpeed = 1.0;
  private onAnimationUpdate?: (event: AnimationPlayEvent) => void;

  /**
   * 注册动画更新监听器
   * @param callback 更新回调函数
   */
  setAnimationUpdateListener(callback: (event: AnimationPlayEvent) => void) {
    this.onAnimationUpdate = callback;
  }

  /**
   * 为对象创建动画控制器
   * @param objectId 对象ID
   * @param object 3D对象
   * @param animationClips 动画剪辑数组
   * @param animationItems 动画项数组（包含预定义的ID）
   * @returns 创建的控制器
   */
  createController(objectId: string, object: Object3D, animationClips: AnimationClip[], animationItems?: any[]): AnimationController {
    // 如果已经存在控制器，先清理
    if (this.controllers.has(objectId)) {
      this.removeController(objectId);
    }

    // 创建混合器
    const mixer = new AnimationMixer(object);
    const actions = new Map<string, AnimationAction>();

    // 为每个动画剪辑创建动作
    animationClips.forEach((clip, index) => {
      const action = mixer.clipAction(clip);
      // 使用预定义的动画ID，如果没有则生成新的
      const animationId = animationItems?.[index]?.id || `animation_${index}_${Date.now()}`;
      actions.set(animationId, action);
      
      
      // 设置动作事件监听器
      action.getMixer().addEventListener('finished', (event) => {
        if (event.action === action && this.onAnimationUpdate) {
          this.onAnimationUpdate({
            animationId,
            status: 'completed',
            progress: 100
          });
        }
      });
    });

    const controller = { mixer, actions, clips: animationClips };
    this.controllers.set(objectId, controller);


    return controller;
  }

  /**
   * 移除对象的动画控制器
   * @param objectId 对象ID
   */
  removeController(objectId: string): void {
    const controller = this.controllers.get(objectId);
    if (controller) {
      // 停止所有动作
      controller.actions.forEach(action => {
        action.stop();
      });
      // 清理混合器
      controller.mixer.stopAllAction();
      controller.mixer.uncacheRoot(controller.mixer.getRoot());
      this.controllers.delete(objectId);
    }
  }

  /**
   * 播放动画
   * @param animationId 动画ID
   * @param loop 是否循环播放
   */
  playAnimation(animationId: string, loop: boolean = false): void {
    const action = this.findAction(animationId);
    if (action) {
      // 设置循环模式
      action.setLoop(loop ? LoopRepeat : LoopOnce, loop ? Infinity : 1);
      
      // 重置并播放动画
      action.reset().play();
      
      // 设置播放速度
      action.setEffectiveTimeScale(this.globalSpeed);

      if (this.onAnimationUpdate) {
        this.onAnimationUpdate({
          animationId,
          status: 'playing',
          progress: 0
        });
      }
    } else {
    }
  }

  /**
   * 获取所有可用的动作ID（调试用）
   */
  private getAllActionIds(): string[] {
    const allIds: string[] = [];
    this.controllers.forEach(controller => {
      allIds.push(...Array.from(controller.actions.keys()));
    });
    return allIds;
  }

  /**
   * 暂停动画
   * @param animationId 动画ID
   */
  pauseAnimation(animationId: string): void {
    const action = this.findAction(animationId);
    if (action) {
      action.paused = true;
      
      if (this.onAnimationUpdate) {
        this.onAnimationUpdate({
          animationId,
          status: 'paused',
          progress: this.getAnimationProgress(animationId)
        });
      }
    }
  }

  /**
   * 恢复动画播放
   * @param animationId 动画ID
   */
  resumeAnimation(animationId: string): void {
    const action = this.findAction(animationId);
    if (action) {
      action.paused = false;
      
      if (this.onAnimationUpdate) {
        this.onAnimationUpdate({
          animationId,
          status: 'playing',
          progress: this.getAnimationProgress(animationId)
        });
      }
    }
  }

  /**
   * 停止动画
   * @param animationId 动画ID
   */
  stopAnimation(animationId: string): void {
    const action = this.findAction(animationId);
    if (action) {
      action.stop();
      
      if (this.onAnimationUpdate) {
        this.onAnimationUpdate({
          animationId,
          status: 'stopped',
          progress: 0
        });
      }
    }
  }

  /**
   * 设置动画进度
   * @param animationId 动画ID
   * @param progress 进度百分比 (0-100)
   */
  setAnimationProgress(animationId: string, progress: number): void {
    const action = this.findAction(animationId);
    if (action && action.getClip()) {
      const clip = action.getClip();
      const time = (progress / 100) * clip.duration;
      action.time = time;
      
      if (this.onAnimationUpdate) {
        this.onAnimationUpdate({
          animationId,
          status: action.paused ? 'paused' : 'playing',
          progress
        });
      }
    }
  }

  /**
   * 获取动画进度
   * @param animationId 动画ID
   * @returns 进度百分比 (0-100)
   */
  getAnimationProgress(animationId: string): number {
    const action = this.findAction(animationId);
    if (action && action.getClip()) {
      const clip = action.getClip();
      return (action.time / clip.duration) * 100;
    }
    return 0;
  }

  /**
   * 设置全局播放速度
   * @param speed 速度倍率 (0.1 - 5.0)
   */
  setGlobalSpeed(speed: number): void {
    this.globalSpeed = Math.max(0.1, Math.min(5.0, speed));
    
    // 更新所有活跃动作的速度
    this.controllers.forEach(controller => {
      controller.actions.forEach(action => {
        if (action.isRunning()) {
          action.setEffectiveTimeScale(this.globalSpeed);
        }
      });
    });
  }

  /**
   * 停止所有动画
   */
  stopAllAnimations(): void {
    this.controllers.forEach(controller => {
      controller.actions.forEach((action, animationId) => {
        if (action.isRunning()) {
          action.stop();
          
          if (this.onAnimationUpdate) {
            this.onAnimationUpdate({
              animationId,
              status: 'stopped',
              progress: 0
            });
          }
        }
      });
    });
  }

  /**
   * 更新所有动画混合器
   * @param deltaTime 时间增量
   */
  update(deltaTime: number): void {
    this.controllers.forEach(controller => {
      controller.mixer.update(deltaTime);
      
      // 更新动画进度
      controller.actions.forEach((action, animationId) => {
        if (action.isRunning() && this.onAnimationUpdate) {
          const progress = this.getAnimationProgress(animationId);
          this.onAnimationUpdate({
            animationId,
            status: action.paused ? 'paused' : 'playing',
            progress
          });
        }
      });
    });
  }

  /**
   * 查找动画动作
   * @param animationId 动画ID
   * @returns 动画动作或undefined
   */
  private findAction(animationId: string): AnimationAction | undefined {
    for (const controller of this.controllers.values()) {
      const action = controller.actions.get(animationId);
      if (action) {
        return action;
      }
    }
    return undefined;
  }

  /**
   * 获取所有控制器
   * @returns 控制器Map
   */
  getControllers(): Map<string, AnimationController> {
    return this.controllers;
  }

  /**
   * 清理所有资源
   */
  dispose(): void {
    this.controllers.forEach((_, objectId) => {
      this.removeController(objectId);
    });
    this.controllers.clear();
  }
}

// 创建全局动画管理器实例
export const globalAnimationManager = new AnimationManager();