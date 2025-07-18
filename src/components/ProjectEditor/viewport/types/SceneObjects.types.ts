/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description SceneObjects 组件类型定义
 */

import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import type { Scene3DService } from '@/hooks/three/services';
import type { PickedObject } from '@/hooks/three/types';
import type { SelectionState } from './canvasControls.types';

export interface SceneObjectsProps {
  nodes: SceneNode[];
  scene3DService?: Scene3DService;
  // 点击拾取回调
  onObjectPicked?: (pickedObject: PickedObject) => void;
  // 点击空白区域回调
  onEmptySpacePicked?: () => void;
  // 选择状态（控制拾取粒度）
  selectionState?: SelectionState;
}

export interface SceneObjectProps {
  node: SceneNode;
  scene3DService?: Scene3DService;
  allNodes: SceneNode[];
  // 点击拾取回调
  onObjectPicked?: (pickedObject: PickedObject) => void;
  // 创建对象点击处理器的函数
  createObjectClickHandler?: (objectId: string) => (event: any) => void;
}
