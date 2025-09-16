/**
 * 爆炸视图管理器
 * 负责管理3D对象的爆炸视图动画功能
 * @author Cerror
 * @since 2025-09-06
 */

import { 
  Object3D, 
  Vector3, 
  Box3,
  Sphere
} from 'three';

/**
 * 爆炸配置接口
 */
export interface ExplodeConfig {
  enabled: boolean;
  intensity: number;
  center: { x: number; y: number; z: number };
  direction: 'radial' | 'x' | 'y' | 'z';
  duration: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * 爆炸状态接口
 */
export interface ExplodeState {
  objectId: string;
  config: ExplodeConfig;
  originalPositions: Map<string, Vector3>;
  explodedPositions: Map<string, Vector3>;
  isExploded: boolean;
  animationProgress: number;
}

/**
 * 缓动函数类型
 */
type EasingFunction = (t: number) => number;

/**
 * 爆炸管理器类
 */
export class ExplodeManager {
  private explodeStates = new Map<string, ExplodeState>();
  private animationIds = new Map<string, number>();

  /**
   * 缓动函数映射
   */
  private easingFunctions: Record<ExplodeConfig['easing'], EasingFunction> = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => 1 - (1 - t) * (1 - t),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };

  /**
   * 启用爆炸视图
   * @param objectId 对象ID
   * @param object 3D对象
   * @param config 爆炸配置
   */
  enableExplode(objectId: string, object: Object3D, config: ExplodeConfig): boolean {
    try {
      // 如果已存在，先清除
      if (this.explodeStates.has(objectId)) {
        this.disableExplode(objectId, object);
      }

      // 计算爆炸位置
      const originalPositions = new Map<string, Vector3>();
      const explodedPositions = new Map<string, Vector3>();
      
      this.calculateExplodePositions(object, config, originalPositions, explodedPositions);

      // 创建状态
      const state: ExplodeState = {
        objectId,
        config,
        originalPositions,
        explodedPositions,
        isExploded: false,
        animationProgress: 0
      };

      this.explodeStates.set(objectId, state);

      // 开始爆炸动画
      this.animateExplode(objectId, object, true);

      return true;
    } catch (error) {
      console.error('启用爆炸视图失败:', error);
      return false;
    }
  }

  /**
   * 禁用爆炸视图
   * @param objectId 对象ID
   * @param object 3D对象
   */
  disableExplode(objectId: string, object: Object3D): boolean {
    try {
      const state = this.explodeStates.get(objectId);
      if (!state) return false;

      // 停止动画
      const animationId = this.animationIds.get(objectId);
      if (animationId) {
        cancelAnimationFrame(animationId);
        this.animationIds.delete(objectId);
      }

      // 恢复原始位置
      this.restoreOriginalPositions(object, state);

      // 清除状态
      this.explodeStates.delete(objectId);

      return true;
    } catch (error) {
      console.error('禁用爆炸视图失败:', error);
      return false;
    }
  }

  /**
   * 更新爆炸配置
   * @param objectId 对象ID
   * @param object 3D对象
   * @param config 新的爆炸配置
   */
  updateExplode(objectId: string, object: Object3D, config: ExplodeConfig): boolean {
    const state = this.explodeStates.get(objectId);
    if (!state || !config.enabled) return false;

    // 重新启用爆炸
    return this.enableExplode(objectId, object, config);
  }

  /**
   * 切换爆炸状态
   * @param objectId 对象ID
   * @param object 3D对象
   */
  toggleExplode(objectId: string, object: Object3D): boolean {
    const state = this.explodeStates.get(objectId);
    if (!state) return false;

    this.animateExplode(objectId, object, !state.isExploded);
    return true;
  }

  /**
   * 获取爆炸状态
   * @param objectId 对象ID
   */
  getExplodeState(objectId: string): ExplodeState | undefined {
    return this.explodeStates.get(objectId);
  }

  /**
   * 计算爆炸位置
   * @param object 3D对象
   * @param config 爆炸配置
   * @param originalPositions 原始位置Map
   * @param explodedPositions 爆炸位置Map
   */
  private calculateExplodePositions(
    object: Object3D,
    config: ExplodeConfig,
    originalPositions: Map<string, Vector3>,
    explodedPositions: Map<string, Vector3>
  ): void {
    const centerPoint = new Vector3(config.center.x, config.center.y, config.center.z);
    
    // 计算对象包围球，用于径向爆炸
    const boundingSphere = new Sphere();
    if (object.children.length > 0) {
      const box = new Box3();
      box.setFromObject(object);
      box.getBoundingSphere(boundingSphere);
    }

    object.traverse((child) => {
      if (child !== object && child.parent === object) {
        // 保存原始位置
        originalPositions.set(child.uuid, child.position.clone());

        // 计算爆炸位移
        const displacement = this.calculateDisplacement(
          child.position,
          centerPoint,
          config,
          boundingSphere.radius
        );

        // 计算爆炸后位置
        const explodedPos = child.position.clone().add(displacement);
        explodedPositions.set(child.uuid, explodedPos);
      }
    });
  }

  /**
   * 计算单个子对象的爆炸位移
   * @param position 对象位置
   * @param center 爆炸中心
   * @param config 爆炸配置
   * @param boundingRadius 包围半径
   */
  private calculateDisplacement(
    position: Vector3,
    center: Vector3,
    config: ExplodeConfig,
    boundingRadius: number
  ): Vector3 {
    const displacement = new Vector3();
    const distance = position.distanceTo(center);
    const intensity = config.intensity;

    switch (config.direction) {
      case 'radial':
        // 径向爆炸：从中心点向外
        if (distance > 0.001) {
          displacement.copy(position).sub(center).normalize();
          displacement.multiplyScalar(intensity * boundingRadius);
        }
        break;

      case 'x':
        // X轴方向爆炸
        displacement.set(position.x > center.x ? intensity : -intensity, 0, 0);
        break;

      case 'y':
        // Y轴方向爆炸
        displacement.set(0, position.y > center.y ? intensity : -intensity, 0);
        break;

      case 'z':
        // Z轴方向爆炸
        displacement.set(0, 0, position.z > center.z ? intensity : -intensity);
        break;
    }

    return displacement;
  }

  /**
   * 执行爆炸动画
   * @param objectId 对象ID
   * @param object 3D对象
   * @param explode 是否爆炸（true为爆炸，false为还原）
   */
  private animateExplode(objectId: string, object: Object3D, explode: boolean): void {
    const state = this.explodeStates.get(objectId);
    if (!state) return;

    // 停止之前的动画
    const existingAnimationId = this.animationIds.get(objectId);
    if (existingAnimationId) {
      cancelAnimationFrame(existingAnimationId);
    }

    const startTime = performance.now();
    const duration = state.config.duration;
    const easingFn = this.easingFunctions[state.config.easing];

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / duration, 1);

      // 应用缓动函数
      progress = easingFn(progress);

      // 如果是收回动画，反向进度
      if (!explode) {
        progress = 1 - progress;
      }

      // 更新所有子对象位置
      object.traverse((child) => {
        if (child !== object && child.parent === object) {
          const originalPos = state.originalPositions.get(child.uuid);
          const explodedPos = state.explodedPositions.get(child.uuid);

          if (originalPos && explodedPos) {
            // 线性插值计算当前位置
            child.position.lerpVectors(originalPos, explodedPos, progress);
          }
        }
      });

      state.animationProgress = progress;

      // 继续动画或结束
      if (elapsed < duration) {
        const animationId = requestAnimationFrame(animate);
        this.animationIds.set(objectId, animationId);
      } else {
        state.isExploded = explode;
        state.animationProgress = explode ? 1 : 0;
        this.animationIds.delete(objectId);
      }
    };

    const animationId = requestAnimationFrame(animate);
    this.animationIds.set(objectId, animationId);
  }

  /**
   * 恢复对象的原始位置
   * @param object 3D对象
   * @param state 爆炸状态
   */
  private restoreOriginalPositions(object: Object3D, state: ExplodeState): void {
    object.traverse((child) => {
      if (child !== object && child.parent === object) {
        const originalPos = state.originalPositions.get(child.uuid);
        if (originalPos) {
          child.position.copy(originalPos);
        }
      }
    });
  }

  /**
   * 清除所有爆炸状态
   */
  clearAll(): void {
    // 停止所有动画
    this.animationIds.forEach(animationId => {
      cancelAnimationFrame(animationId);
    });
    
    this.explodeStates.clear();
    this.animationIds.clear();
  }

  /**
   * 获取所有爆炸状态
   */
  getAllStates(): Map<string, ExplodeState> {
    return new Map(this.explodeStates);
  }

  /**
   * 暂停爆炸动画
   * @param objectId 对象ID
   */
  pauseExplode(objectId: string): boolean {
    const animationId = this.animationIds.get(objectId);
    if (animationId) {
      cancelAnimationFrame(animationId);
      this.animationIds.delete(objectId);
      return true;
    }
    return false;
  }

  /**
   * 恢复爆炸动画
   * @param objectId 对象ID
   * @param object 3D对象
   */
  resumeExplode(objectId: string, object: Object3D): boolean {
    const state = this.explodeStates.get(objectId);
    if (state && !this.animationIds.has(objectId)) {
      this.animateExplode(objectId, object, !state.isExploded);
      return true;
    }
    return false;
  }
}