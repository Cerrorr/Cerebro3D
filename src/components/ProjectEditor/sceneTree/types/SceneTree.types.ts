/**
 * 场景树节点接口
 * 定义3D场景中各种对象的基本结构和属性
 */
export interface SceneNode {
  /** 节点唯一标识符 */
  id: string;
  /** 节点显示名称 */
  name: string;
  /** 节点类型：场景、文件夹、网格、几何体、灯光、相机、材质 */
  type: 'scene' | 'folder' | 'mesh' | 'geometry' | 'light' | 'camera' | 'material';
  /** 子节点列表（用于树形结构） */
  children?: SceneNode[];
  /** 是否展开状态（用于文件夹类型） */
  expanded?: boolean;
  /** 是否可见状态 */
  visible?: boolean;
  /** 3D空间位置坐标 */
  position?: { x: number; y: number; z: number };
  /** 3D空间旋转角度 */
  rotation?: { x: number; y: number; z: number };
  /** 3D空间缩放比例 */
  scale?: { x: number; y: number; z: number };
}

/**
 * 场景树组件属性接口
 */
export interface SceneTreeProps {
  /** 场景数据 */
  sceneData: SceneNode[];
  /** 当前选中的节点ID */
  selectedNodeId?: string;
  /** 节点选择回调函数 */
  onNodeSelect?: (nodeId: string) => void;
  /** 节点可见性变更回调函数 */
  onNodeVisibilityChange?: (nodeId: string, visible: boolean) => void;
} 