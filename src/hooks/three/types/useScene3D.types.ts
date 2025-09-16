/**
 * useScene3D Hook 类型定义
 * @author Cerror
 * @since 2025-09-06
 */

import type { Object3D } from 'three';
import type { Scene3DState, Transform3D, Scene3DOperationResult } from './Scene3DService.types';
import type { ClippingConfig } from '../services/ClippingManager';
import type { ExplodeConfig } from '../services/ExplodeManager';

/**
 * Scene3D服务接口
 * 定义3D场景服务的公共方法
 */
export interface Scene3DServiceInterface {
  // 初始化3D场景
  initialize(): Promise<Scene3DOperationResult>;
  
  // 添加3D对象到场景
  addObject(id: string, object: Object3D, transform?: Transform3D): Scene3DOperationResult;
  
  // 从场景移除3D对象
  removeObject(id: string): Scene3DOperationResult;
  
  // 更新3D对象变换
  updateObjectTransform(id: string, transform: Transform3D): Scene3DOperationResult;
  
  // 获取3D对象
  getObject(id: string): Object3D | undefined;
  
  // 获取所有3D对象
  getAllObjects(): Map<string, Object3D>;
  
  // 设置对象可见性
  setObjectVisibility(id: string, visible: boolean): Scene3DOperationResult;
  
  // 获取场景状态
  getState(): Scene3DState;
  
  // 清空场景
  clear(): Scene3DOperationResult;
  
  // 只清空场景对象
  clearSceneObjectsOnly(): Scene3DOperationResult;
  
  // 启用对象剖切
  enableObjectClipping(objectId: string, config: ClippingConfig): Scene3DOperationResult;
  
  // 禁用对象剖切
  disableObjectClipping(objectId: string): Scene3DOperationResult;
  
  // 更新对象剖切配置
  updateObjectClipping(objectId: string, config: ClippingConfig): Scene3DOperationResult;
  
  // 启用对象爆炸视图
  enableObjectExplode(objectId: string, config: ExplodeConfig): Scene3DOperationResult;
  
  // 禁用对象爆炸视图
  disableObjectExplode(objectId: string): Scene3DOperationResult;
  
  // 更新对象爆炸配置
  updateObjectExplode(objectId: string, config: ExplodeConfig): Scene3DOperationResult;
  
  // 切换对象爆炸状态
  toggleObjectExplode(objectId: string): Scene3DOperationResult;
  
  // 销毁服务
  destroy(): void;
}