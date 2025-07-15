import type { CanvasSettings } from './Canvas3D.types';
import type { SceneNode } from '../../sceneTree/types';
import type { Scene3DService } from '@/hooks/three/services';

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
}