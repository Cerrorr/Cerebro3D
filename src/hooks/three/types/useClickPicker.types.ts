/**
 * useClickPicker Hook 类型定义
 * 3D场景中的模型点击拾取功能类型定义
 * @author Cerror
 * @since 2025-07-11
 */

import type { Object3D, Intersection } from 'three';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';

/**
 * 拾取到的对象信息
 */
export interface PickedObject {
  // 对象唯一标识
  id: string;
  // Three.js对象引用
  object3D: Object3D;
  // 场景节点引用
  node: SceneNode;
  // 拾取时间戳
  pickedAt: number;
  // 具体拾取到的mesh
  hitMesh: Object3D;
  // 拾取点在3D空间中的位置
  hitPoint: { x: number; y: number };
  // 射线检测的原始结果
  intersection: Intersection | any;
}

/**
 * 拾取粒度枚举
 */
export type PickingGranularity = 'object' | 'mesh' | 'both';

/**
 * 点击拾取配置选项
 */
export interface UseClickPickerOptions {
  // 是否启用点击拾取
  enabled?: boolean;
  // 拾取粒度：'object' = 整个模型, 'mesh' = 具体mesh, 'both' = 同时提供两者信息
  granularity?: PickingGranularity;
  // 拾取成功回调
  onObjectPicked?: (pickedObject: PickedObject) => void;
  // 点击空白区域回调
  onEmptySpacePicked?: () => void;
  // 是否启用调试日志
  debug?: boolean;
}

/**
 * 点击拾取Hook返回值
 */
export interface UseClickPickerResult {
  // 当前拾取的对象
  pickedObject: PickedObject | null;
  // 处理点击事件（兼容旧接口）
  handleClick: (event: any) => void;
  // 创建对象点击处理器
  createObjectClickHandler: (objectId: string) => (event: any) => void;
  // 处理空白区域点击
  handleEmptySpaceClick: (event: any) => void;
  // 清空拾取
  clearPicked: () => void;
  // 检查对象是否被拾取
  isPicked: (objectId: string) => boolean;
} 