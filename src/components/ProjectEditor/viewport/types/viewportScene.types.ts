import type { CanvasSettings, ViewType } from './Canvas3D.types';
import type { SceneNode } from '../../sceneTree/types';
import type { Scene3DService } from '@/hooks/three/services';
import type { PickedObject } from '@/hooks/three/types';
import type { SelectionState } from './canvasControls.types';
import type { MutableRefObject, Dispatch, SetStateAction } from 'react';

/**
 * 相机控制接口
 */
export interface CameraControlRef {
  resetCamera: () => void;
  setView: (view: ViewType) => void;
  zoomToFitAll: () => void;
}

/**
 * ViewportScene组件属性接口
 * @author Cerror
 * @since 2025-07-08
 */
export interface ViewportSceneProps {
  // 3D场景设置 (可选，用于兼容)
  settings?: CanvasSettings;
  // 场景节点数据 (可选，用于兼容)
  sceneNodes?: SceneNode[];
  
  // 新增属性 - 场景配置
  backgroundColor?: string;
  enableGrid?: boolean;
  enableStats?: boolean;
  enableFog?: boolean;
  fogNear?: number;
  fogFar?: number;
  
  // 3D场景服务实例
  scene3DService?: Scene3DService;
  
  // 相机控制引用
  cameraControlRef?: MutableRefObject<CameraControlRef | null>;
  
  // 视图变化回调
  onViewChange?: Dispatch<SetStateAction<ViewType>>;
  
  // 点击拾取回调
  onObjectPicked?: (pickedObject: PickedObject) => void;
  
  // 点击空白区域回调
  onEmptySpacePicked?: () => void;
  
  // 选择状态（控制拾取粒度）
  selectionState?: SelectionState;
}