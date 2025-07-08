import type { CanvasSettings } from './Canvas3D.types';
import type { SceneNode } from '../../sceneTree/types';

/**
 * ViewportScene组件属性接口
 * @author Cerror
 * @since 2025-07-08
 */
export interface ViewportSceneProps {
  /** 3D场景设置 */
  settings: CanvasSettings;
  /** 场景节点数据 */
  sceneNodes?: SceneNode[];
}