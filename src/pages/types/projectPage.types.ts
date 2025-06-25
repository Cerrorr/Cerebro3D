import { SceneNode, CanvasSettings } from '@/components/ProjectEditor/types';

/**
 * 项目页面组件属性接口
 * 定义项目页面的配置参数
 */
export interface ProjectPageProps {
  /** 项目标题（可选，默认为"特效材质贴图"） */
  projectTitle?: string;
  /** 项目logo图片路径（可选） */
  projectLogo?: string;
}

/**
 * 项目页面状态接口
 * 定义项目页面的内部状态管理
 */
export interface ProjectPageState {
  /** 项目标题 */
  projectTitle: string;
  /** 场景节点数据 */
  sceneNodes: SceneNode[];
  /** 当前选中的节点ID */
  selectedNodeId: string;
  /** 底部面板高度 */
  bottomPanelHeight: number;
  /** 画布设置 */
  canvasSettings: CanvasSettings;
}

/**
 * 项目页面事件处理器接口
 * 定义项目页面的事件处理函数类型
 */
export interface ProjectPageHandlers {
  /** 处理节点选择 */
  handleNodeSelect: (nodeId: string) => void;
  /** 处理节点展开/折叠 */
  handleNodeToggle: (nodeId: string) => void;
  /** 处理节点可见性切换 */
  handleNodeVisibilityToggle: (nodeId: string) => void;
  /** 处理标题变更 */
  handleTitleChange: (title: string) => void;
} 