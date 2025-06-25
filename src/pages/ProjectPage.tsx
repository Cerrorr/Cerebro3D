import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Toolbar, SceneTree, Canvas3D, ResizablePanel, RightSidebar } from '@/components/ProjectEditor';
import { SceneNode, CanvasSettings, RightSidebarTabType } from '@/components/ProjectEditor/types';
import { ProjectPageProps } from './types';
import {
  DEFAULT_CANVAS_SETTINGS,
  DEFAULT_PANEL_CONFIG,
  getLeftToolbarActions,
  RIGHT_TOOLBAR_ACTIONS,
  MOCK_SCENE_NODES
} from './constants';
import './styles/ProjectPage.scss';

// 使用来自常量的模拟场景数据

/**
 * 项目页面主组件
 * 提供3D编辑器界面，包含工具栏、场景树、3D画布和可调整面板
 * @param props 组件属性
 * @returns 项目页面React组件
 */
const ProjectPage: React.FC<ProjectPageProps> = ({
  projectTitle: initialTitle,
  projectLogo = '/images/logo.png'
}) => {
  // 路由相关hooks
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 从路由状态中获取项目信息
  const routeState = location.state as {
    projectTitle?: string;
    projectType?: string;
    isNewProject?: boolean;
  } | null;
  
  // 确定项目标题（优先使用路由状态，其次是props，最后是默认值）
  const finalProjectTitle = routeState?.projectTitle || initialTitle || '新建项目';
  
  const [projectTitle, setProjectTitle] = useState(finalProjectTitle);
  const [sceneNodes, setSceneNodes] = useState<SceneNode[]>([...MOCK_SCENE_NODES]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cube1');
  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(DEFAULT_PANEL_CONFIG.BOTTOM_PANEL_HEIGHT);
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTabType>('scene');
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    ...DEFAULT_CANVAS_SETTINGS
  });

  // 监听路由变化，更新项目标题
  useEffect(() => {
    if (routeState?.projectTitle) {
      setProjectTitle(routeState.projectTitle);
    }
    
    // 如果有projectId，可以在这里加载对应的项目数据
    if (projectId) {
      console.log('加载项目:', projectId);
      // TODO: 根据projectId从API加载项目数据
    }
  }, [routeState?.projectTitle, projectId]);



  // 使用常量文件中的工具栏配置
  const leftActions = getLeftToolbarActions(navigate);
  const rightActions = RIGHT_TOOLBAR_ACTIONS;

  /**
   * 处理场景树节点选择
   * @param nodeId 节点ID
   */
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    console.log('选中节点:', nodeId);
  }, []);

  /**
   * 处理场景树节点可见性切换
   * @param nodeId 节点ID
   */
  const handleNodeVisibilityToggle = useCallback((nodeId: string) => {
    /**
     * 递归切换节点可见性的内部函数
     * @param nodes 节点数组
     * @returns 更新后的节点数组
     */
    const toggleVisibility = (nodes: SceneNode[]): SceneNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, visible: !node.visible };
        }
        if (node.children) {
          return { ...node, children: toggleVisibility(node.children) };
        }
        return node;
      });
    };
    setSceneNodes(prev => toggleVisibility(prev));
    console.log('切换节点可见性:', nodeId);
  }, []);

  /**
   * 处理右侧栏标签切换
   * @param tab 标签类型
   */
  const handleRightSidebarTabChange = useCallback((tab: RightSidebarTabType) => {
    setRightSidebarTab(tab);
  }, []);

  return (
    <div className="project-page">
      <div className="project-layout">
        {/* 工具栏 */}
        <Toolbar
          projectTitle={projectTitle}
          onTitleChange={setProjectTitle}
          leftActions={leftActions}
          rightActions={rightActions}
          projectLogo={projectLogo}
        />

        {/* 主要内容区域 */}
        <div className="layout-main">
          {/* 左侧场景树 */}
          <div className="layout-sidebar">
            <SceneTree
              sceneData={sceneNodes}
              selectedNodeId={selectedNodeId}
              onNodeSelect={handleNodeSelect}
              onNodeVisibilityChange={handleNodeVisibilityToggle}
            />
          </div>

          {/* 中间画布区域 */}
          <div className="layout-center">
            <div className="canvas-container">
              <Canvas3D
                settings={canvasSettings}
                onSettingsChange={setCanvasSettings}
              />
            </div>

            {/* 底部面板 */}
            <ResizablePanel
              initialHeight={bottomPanelHeight}
              maxHeight={400}
              position="bottom"
              onHeightChange={setBottomPanelHeight}
            >
              <div className="panel-placeholder">
                底部扩展面板 - 属性编辑器、动画时间轴等功能
                <br />
                当前高度: {bottomPanelHeight}px
              </div>
            </ResizablePanel>
          </div>

          {/* 右侧面板 */}
          <div className="layout-right">
            <RightSidebar
              activeTab={rightSidebarTab}
              onTabChange={handleRightSidebarTabChange}
              visible={true}
              width={320}
              collapsible={true}
              defaultCollapsed={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage; 