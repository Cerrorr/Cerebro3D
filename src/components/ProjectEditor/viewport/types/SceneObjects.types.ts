/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description SceneObjects 组件类型定义
 */

import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import type { Scene3DService } from '@/hooks/three/services';

export interface SceneObjectsProps {
  nodes: SceneNode[];
  scene3DService?: Scene3DService;
}

export interface SceneObjectProps {
  node: SceneNode;
  scene3DService?: Scene3DService;
  allNodes?: SceneNode[];
}
