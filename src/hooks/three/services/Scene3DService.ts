/**
 * 3D场景服务
 * 提供纯粹的3D场景初始化和管理功能，与业务逻辑完全分离
 * @author Cerror
 * @since 2025-07-11
 */

import type { 
  Scene3DConfig, 
  Scene3DState, 
  Transform3D, 
  Scene3DOperationResult 
} from '../types/Scene3DService.types';
import type { Object3D } from 'three';
import { ClippingManager, type ClippingConfig } from './ClippingManager';
import { ExplodeManager, type ExplodeConfig } from './ExplodeManager';

/**
 * 3D场景服务类
 * 负责管理3D场景的初始化、渲染和基础操作
 */
export class Scene3DService {
  private config: Scene3DConfig;
  private state: Scene3DState;
  private sceneObjects: Map<string, Object3D> = new Map();
  private clippingManager: ClippingManager = new ClippingManager();
  private explodeManager: ExplodeManager = new ExplodeManager();

  constructor(config: Scene3DConfig) {
    this.config = config;
    this.state = {
      initialized: false,
      rendererReady: false,
      loadedObjectsCount: 0,
    };
  }

  /**
   * 初始化3D场景
   * 在React Three Fiber架构中，容器由Canvas组件管理
   */
  async initialize(): Promise<Scene3DOperationResult> {
    try {
      // 如果已经初始化过，直接返回成功状态
      if (this.state.initialized) {
        return {
          success: true,
          message: '3D场景已初始化',
          data: {
            config: this.config,
            state: this.state,
          },
        };
      }

      // 在React Three Fiber架构中，不需要验证DOM容器
      // Canvas组件会自动处理渲染器和场景的创建
      
      // 设置初始化状态
      this.state.initialized = true;
      this.state.rendererReady = true;

      return {
        success: true,
        message: '3D场景初始化成功',
        data: {
          config: this.config,
          state: this.state,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      this.config.onError?.(error as Error);
      
      return {
        success: false,
        message: `3D场景初始化失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 添加3D对象到场景
   */
  addObject(id: string, object: Object3D, transform?: Transform3D): Scene3DOperationResult {
    try {
      if (this.sceneObjects.has(id)) {
        return {
          success: false,
          message: `对象 ID "${id}" 已存在`,
        };
      }

      // 应用变换
      if (transform) {
        if (transform.position) {
          object.position.set(transform.position.x, transform.position.y, transform.position.z);
        }
        if (transform.rotation) {
          object.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
        }
        if (transform.scale) {
          object.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
        }
      }

      this.sceneObjects.set(id, object);
      this.state.loadedObjectsCount = this.sceneObjects.size;

      // 通知场景更新
      this.config.onSceneUpdate?.(object);

      return {
        success: true,
        message: `成功添加对象: ${id}`,
        data: { objectId: id, object },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `添加对象失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 从场景移除3D对象
   */
  removeObject(id: string): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(id);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${id}" 不存在`,
        };
      }

      this.sceneObjects.delete(id);
      this.state.loadedObjectsCount = this.sceneObjects.size;

      // 清理对象资源
      if (object.parent) {
        object.parent.remove(object);
      }

      return {
        success: true,
        message: `成功移除对象: ${id}`,
        data: { objectId: id },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `移除对象失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 更新3D对象变换
   */
  updateObjectTransform(id: string, transform: Transform3D): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(id);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${id}" 不存在`,
        };
      }

      // 应用变换
      if (transform.position) {
        object.position.set(transform.position.x, transform.position.y, transform.position.z);
      }
      if (transform.rotation) {
        object.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
      }
      if (transform.scale) {
        object.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
      }

      return {
        success: true,
        message: `成功更新对象变换: ${id}`,
        data: { objectId: id, transform },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `更新对象变换失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 获取3D对象
   */
  getObject(id: string): Object3D | undefined {
    return this.sceneObjects.get(id);
  }

  /**
   * 获取所有3D对象
   */
  getAllObjects(): Map<string, Object3D> {
    return new Map(this.sceneObjects);
  }

  /**
   * 设置3D对象可见性
   */
  setObjectVisibility(id: string, visible: boolean): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(id);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${id}" 不存在`,
        };
      }

      // 设置对象及其所有子对象的可见性
      object.visible = visible;
      object.traverse((child) => {
        child.visible = visible;
      });

      return {
        success: true,
        message: `成功设置对象可见性: ${id} -> ${visible ? '显示' : '隐藏'}`,
        data: { objectId: id, visible },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `设置对象可见性失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 获取场景状态
   */
  getState(): Scene3DState {
    return { ...this.state };
  }

  /**
   * 清空场景
   */
  clear(): Scene3DOperationResult {
    try {
      // 清理所有对象
      this.sceneObjects.forEach((object) => {
        if (object.parent) {
          object.parent.remove(object);
        }
      });

      this.sceneObjects.clear();
      this.state.loadedObjectsCount = 0;

      return {
        success: true,
        message: '场景已清空',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `清空场景失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 清空场景对象但保留初始相机和光照
   * 移除所有导入的模型和用户对象，恢复到场景初始状态
   */
  clearSceneObjectsOnly(): Scene3DOperationResult {
    try {
      let removedCount = 0;

      // 清理所有对象（在React Three Fiber架构下，相机和光照由组件管理，不在sceneObjects中）
      this.sceneObjects.forEach((object) => {
        if (object.parent) {
          object.parent.remove(object);
        }
        removedCount++;
      });

      // 清空所有用户添加的对象
      this.sceneObjects.clear();
      this.state.loadedObjectsCount = 0;

      return {
        success: true,
        message: `场景对象已清空`,
        data: { removedCount },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `清空场景对象失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    this.clippingManager.clearAll();
    this.explodeManager.clearAll();
    this.clear();
    this.state.initialized = false;
    this.state.rendererReady = false;
  }

  // ============= 剖切功能方法 =============

  /**
   * 启用对象剖切
   * @param objectId 对象ID
   * @param config 剖切配置
   */
  enableObjectClipping(objectId: string, config: ClippingConfig): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(objectId);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${objectId}" 不存在`,
        };
      }

      const success = this.clippingManager.enableClipping(objectId, object, config);
      return {
        success,
        message: success ? '剖切启用成功' : '剖切启用失败',
        data: { objectId, config }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `启用剖切失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 禁用对象剖切
   * @param objectId 对象ID
   */
  disableObjectClipping(objectId: string): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(objectId);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${objectId}" 不存在`,
        };
      }

      const success = this.clippingManager.disableClipping(objectId, object);
      return {
        success,
        message: success ? '剖切禁用成功' : '剖切禁用失败',
        data: { objectId }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `禁用剖切失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 更新对象剖切配置
   * @param objectId 对象ID
   * @param config 剖切配置
   */
  updateObjectClipping(objectId: string, config: ClippingConfig): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(objectId);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${objectId}" 不存在`,
        };
      }

      const success = this.clippingManager.updateClipping(objectId, object, config);
      return {
        success,
        message: success ? '剖切配置更新成功' : '剖切配置更新失败',
        data: { objectId, config }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `更新剖切配置失败: ${errorMessage}`,
      };
    }
  }

  // ============= 爆炸功能方法 =============

  /**
   * 启用对象爆炸视图
   * @param objectId 对象ID
   * @param config 爆炸配置
   */
  enableObjectExplode(objectId: string, config: ExplodeConfig): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(objectId);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${objectId}" 不存在`,
        };
      }

      const success = this.explodeManager.enableExplode(objectId, object, config);
      return {
        success,
        message: success ? '爆炸视图启用成功' : '爆炸视图启用失败',
        data: { objectId, config }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `启用爆炸视图失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 禁用对象爆炸视图
   * @param objectId 对象ID
   */
  disableObjectExplode(objectId: string): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(objectId);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${objectId}" 不存在`,
        };
      }

      const success = this.explodeManager.disableExplode(objectId, object);
      return {
        success,
        message: success ? '爆炸视图禁用成功' : '爆炸视图禁用失败',
        data: { objectId }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `禁用爆炸视图失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 更新对象爆炸配置
   * @param objectId 对象ID
   * @param config 爆炸配置
   */
  updateObjectExplode(objectId: string, config: ExplodeConfig): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(objectId);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${objectId}" 不存在`,
        };
      }

      const success = this.explodeManager.updateExplode(objectId, object, config);
      return {
        success,
        message: success ? '爆炸配置更新成功' : '爆炸配置更新失败',
        data: { objectId, config }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `更新爆炸配置失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 切换对象爆炸状态
   * @param objectId 对象ID
   */
  toggleObjectExplode(objectId: string): Scene3DOperationResult {
    try {
      const object = this.sceneObjects.get(objectId);
      if (!object) {
        return {
          success: false,
          message: `对象 ID "${objectId}" 不存在`,
        };
      }

      const success = this.explodeManager.toggleExplode(objectId, object);
      const state = this.explodeManager.getExplodeState(objectId);
      
      return {
        success,
        message: success ? 
          `爆炸状态切换成功 - ${state?.isExploded ? '已爆炸' : '已收拢'}` : 
          '爆炸状态切换失败',
        data: { objectId, isExploded: state?.isExploded }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return {
        success: false,
        message: `切换爆炸状态失败: ${errorMessage}`,
      };
    }
  }

  /**
   * 获取剖切管理器（用于高级操作）
   */
  getClippingManager(): ClippingManager {
    return this.clippingManager;
  }

  /**
   * 获取爆炸管理器（用于高级操作）
   */
  getExplodeManager(): ExplodeManager {
    return this.explodeManager;
  }
}
