import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ImportOutlined,
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  ClearOutlined,
  CopyOutlined,
  FullscreenOutlined,
  ExportOutlined,
  SaveOutlined,
  EyeOutlined,
  SettingOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Toolbar, SceneTree, Canvas3D, ResizablePanel, RightSidebar } from '@/components/ProjectEditor';
import { ToolbarAction, SceneNode, CanvasSettings, RightSidebarTabType } from '@/components/ProjectEditor/types';
import { ProjectPageProps } from './types';
import './styles/ProjectPage.scss';

// 模拟场景数据
const mockSceneNodes: SceneNode[] = [
  {
    id: 'scene',
    name: '特效材质贴图',
    type: 'folder',
    expanded: true,
    visible: true,
    children: [
      {
        id: 'cameras',
        name: '默认相机',
        type: 'folder',
        expanded: true,
        visible: true,
        children: [
          {
            id: 'camera1',
            name: '正交视图',
            type: 'camera',
            visible: true
          },
          {
            id: 'camera2', 
            name: '透视视图',
            type: 'camera',
            visible: true
          }
        ]
      },
      {
        id: 'lights',
        name: '灯光',
        type: 'folder',
        expanded: true,
        visible: true,
        children: [
          {
            id: 'light1',
            name: '环境光',
            type: 'light',
            visible: true
          },
          {
            id: 'light2',
            name: '方向光',
            type: 'light',
            visible: true
          }
        ]
      },
      {
        id: 'meshes',
        name: '模型',
        type: 'folder',
        expanded: true,
        visible: true,
        children: [
          {
            id: 'cube1',
            name: '立方体',
            type: 'mesh',
            visible: true
          },
          {
            id: 'materials',
            name: '材质',
            type: 'folder',
            expanded: false,
            visible: true,
            children: [
              {
                id: 'material1',
                name: '默认材质',
                type: 'material',
                visible: true
              }
            ]
          }
        ]
      }
    ]
  }
];

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
  const [sceneNodes, setSceneNodes] = useState<SceneNode[]>(mockSceneNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cube1');
  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(120);
  const [rightSidebarTab, setRightSidebarTab] = useState<RightSidebarTabType>('scene');
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    gridVisible: true,
    axisVisible: true,
    backgroundColor: '#0a0a0a',
    cameraPosition: [5, 5, 5]
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



  // 工具栏左侧按钮配置
  const leftActions: ToolbarAction[] = [
    {
      id: 'home',
      label: '返回首页',
      icon: <ArrowLeftOutlined />,
      onClick: () => navigate('/')
    },
    {
      id: 'import',
      label: '导入',
      icon: <ImportOutlined />,
      onClick: () => console.log('导入文件')
    },
    {
      id: 'undo',
      label: '撤回',
      icon: <UndoOutlined />,
      onClick: () => console.log('撤回操作'),
      disabled: true
    },
    {
      id: 'redo',
      label: '重做',
      icon: <RedoOutlined />,
      onClick: () => console.log('重做操作'),
      disabled: true
    },
    {
      id: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      onClick: () => console.log('删除选中对象')
    },
    {
      id: 'clear',
      label: '清空',
      icon: <ClearOutlined />,
      onClick: () => console.log('清空场景')
    },
    {
      id: 'copy',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: () => console.log('复制选中对象')
    },
    {
      id: 'fullscreen',
      label: '全屏',
      icon: <FullscreenOutlined />,
      onClick: () => console.log('切换全屏模式')
    }
  ];

  // 工具栏右侧按钮配置
  const rightActions: ToolbarAction[] = [
    {
      id: 'export',
      label: '导出',
      icon: <ExportOutlined />,
      onClick: () => console.log('导出项目')
    },
    {
      id: 'save',
      label: '保存',
      icon: <SaveOutlined />,
      onClick: () => console.log('保存项目')
    },
    {
      id: 'preview',
      label: '预览',
      icon: <EyeOutlined />,
      onClick: () => console.log('预览模式')
    },
    {
      id: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
      onClick: () => console.log('打开设置')
    }
  ];

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