/**
 * 场景状态接口
 */
import { SceneNode } from "@/components/projectEditor/sceneTree/types";
import { CanvasSettings } from "@/components/projectEditor/viewport/types";
import { CameraConfiguration } from "@/components/projectEditor/rightPanels/types/CameraConfig.types";
import { SceneConfiguration } from "@/components/projectEditor/rightPanels/types/SceneConfig.types";

export interface SceneState {
  /** 场景节点树 */
  nodes: SceneNode[];
  /** 当前选中的节点ID */
  selectedNodeId: string | null;
  /** 3D画布设置 */
  canvasSettings: CanvasSettings;
  /** 当前视图类型 */
  currentView: 'perspective' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  /** 相机位置 */
  cameraPosition: [number, number, number];
  /** 相机目标点 */
  cameraTarget: [number, number, number];
  /** 相机配置 */
  cameraConfig: CameraConfiguration;
  /** 场景配置 */
  sceneConfig: SceneConfiguration;
  /** 场景是否加载中 */
  isLoading: boolean;
}
