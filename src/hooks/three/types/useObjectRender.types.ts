/**
 * useObjectRender Hook 类型定义
 * @author Cerror
 * @since 2025-07-11
 */

import { Object3D, Vector3 } from 'three';

/**
 * useObjectRender Hook 参数
 */
export interface UseObjectRenderOptions {
  /** 是否启用自动动画 */
  enableAnimation?: boolean;
  /** 动画速度 */
  animationSpeed?: number;
  /** 选中时的高亮效果 */
  highlightSelected?: boolean;
}

/**
 * useObjectRender Hook 返回值类型
 */
export interface UseObjectRenderResult {
  objectRef: React.RefObject<Object3D>;
  renderableNodes: JSX.Element[];
  updateObjectTransform: (nodeId: string, transform: { position?: Vector3; rotation?: Vector3; scale?: Vector3 }) => void;
}