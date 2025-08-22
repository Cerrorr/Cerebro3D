/**
 * useSceneSelection Hook 类型定义
 * @author Cerror
 * @since 2025-08-22
 */

import { Object3D } from 'three';

export interface UseSceneSelectionProps {
  sceneNodes: any[];
  scene3DService: any;
  selectionState?: 'all' | 'partial';
}

export interface UseSceneSelectionReturn {
  selectedObjects: Object3D[];
  handleObjectPicked: (pickedObject: any) => void;
  handleEmptySpacePicked: () => void;
  findNodeIdByObjectId: (nodes: any[], objectId: string) => string | null;
  findMeshNodeId: (nodes: any[], meshObject: any) => string | null;
}