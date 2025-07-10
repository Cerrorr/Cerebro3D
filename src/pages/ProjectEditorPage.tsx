import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  Toolbar,
  SceneTree,
  Canvas3D,
  ResizablePanel,
  RightSidebar,
  BottomPanel,
} from '@/components/projectEditor';
import ImportPanel from '@/components/projectEditor/topToolbar/ImportPanel';
import type {
  SceneNode,
  CanvasSettings,
  RightSidebarTabType,
  BottomPanelType,
} from '@/components/projectEditor/types';
import type { FileImportResult } from '@/hooks/three';
import { ProjectEditorPageProps } from './types';
import {
  DEFAULT_CANVAS_SETTINGS,
  DEFAULT_PANEL_CONFIG,
  getLeftToolbarActions,
  RIGHT_TOOLBAR_ACTIONS,
  MOCK_SCENE_NODES,
} from './constants';
import { extractModelStructure } from '@/utils/threeUtils';
import './styles/ProjectEditorPage.scss';
import {usePageTracking } from '@/utils/analytics';
import { useHistoryRecorder } from '@/hooks/business/useHistoryRecorder';
// 使用来自常量的模拟场景数据

/**
 * 项目页面主组件
 * 提供3D编辑器界面，包含工具栏、场景树、3D画布和可调整面板
 * @param props 组件属性
 * @returns 项目页面React组件
 * @author Cerror
 * @since 2025-07-08 */
const ProjectEditorPage: React.FC<ProjectEditorPageProps> = ({
  projectTitle: initialTitle,
  projectLogo = '/images/logo.png',
}) => {
  usePageTracking('/project', 'Cerebro3D项目编辑器');

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
  const finalProjectTitle =
    routeState?.projectTitle || initialTitle || '新建项目';

  const [projectTitle, setProjectTitle] = useState(finalProjectTitle);
  const [sceneNodes, setSceneNodes] = useState<SceneNode[]>([
    ...MOCK_SCENE_NODES,
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cube1');
  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(
    DEFAULT_PANEL_CONFIG.BOTTOM_PANEL_HEIGHT
  );
  const [rightSidebarTab, setRightSidebarTab] =
    useState<RightSidebarTabType>('scene');
  const [bottomPanelType, setBottomPanelType] =
    useState<BottomPanelType>('assets');
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>({
    ...DEFAULT_CANVAS_SETTINGS,
  });
  const [importPanelVisible, setImportPanelVisible] = useState(false);

  // 历史记录 & 日志 Hook
  const { addHistory, logs } = useHistoryRecorder();

  /**
   * 打开导入面板
   */
  const handleOpenImportPanel = useCallback(() => {
    setImportPanelVisible(true);
    addHistory({
      actionType: 'import',
      targetType: 'scene',
      targetName: projectTitle,
      description: '打开导入面板',
      logLevel: 'info'
    });
  }, [addHistory, projectTitle]);

  const handleImportSuccess = useCallback((results: FileImportResult[]) => {
    // 创建新的场景节点
    const newNodes: SceneNode[] = results.map((result, index) => ({
      id: `imported_${Date.now()}_${index}`,
      name: result.fileName,
      type: 'mesh',
      visible: true,
      expanded: true, // 展开以显示模型结构
      importedObject: result.object,
      // 使用计算的位置信息，如果没有则默认为原点
      position: result.position ? {
        x: result.position.x,
        y: result.position.y,
        z: result.position.z
      } : { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      children: extractModelStructure(result.object, result.fileName) // 提取模型结构树
    }));

    // 将导入的模型添加到Scene节点下
    setSceneNodes(prev => {
      return prev.map(node => {
        if (node.id === 'scene') {
          return {
            ...node,
            children: [...(node.children || []), ...newNodes]
          };
        }
        return node;
      });
    });

    // 记录导入历史
    results.forEach(result => {
      addHistory({
        actionType: 'import',
        targetType: 'object',
        targetName: result.fileName,
        description: `导入3D模型: ${result.fileName} (${result.fileType.toUpperCase()})`,
        logLevel: 'info'
      });
    });

    message.success(`成功导入 ${results.length} 个3D模型`);
  }, [addHistory]);

  /**
   * 处理文件导入错误
   * @param error 错误信息
   */
  const handleImportError = useCallback((error: string) => {
    console.error('导入错误:', error);
    addHistory({
      actionType: 'import',
      targetType: 'scene',
      targetName: projectTitle,
      description: `导入失败: ${error}`,
      logLevel: 'error'
    });
  }, [addHistory, projectTitle]);

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
  const rawLeftActions = getLeftToolbarActions();

  const leftActions = rawLeftActions.map(item => {
    // 处理工具栏按钮
    switch (item.id) {
      case 'import':
        return { ...item, onClick: handleOpenImportPanel };
      case 'undo':
        return { ...item, onClick: () => addHistory({ actionType: 'undo', targetType: 'scene', targetName: projectTitle, description: '撤回一次操作' }) };
      case 'redo':
        return { ...item, onClick: () => addHistory({ actionType: 'redo', targetType: 'scene', targetName: projectTitle, description: '重做一次操作' }) };
      case 'delete':
        return { ...item, onClick: () => addHistory({ actionType: 'delete', targetType: 'scene', targetName: projectTitle, description: '删除选中对象' }) };
      case 'clear':
        return { ...item, onClick: () => addHistory({ actionType: 'scene', targetType: 'scene', targetName: projectTitle, description: '清空场景对象' }) };
      case 'copy':
        return { ...item, onClick: () => addHistory({ actionType: 'create', targetType: 'scene', targetName: projectTitle, description: '复制选中对象' }) };
      default:
        return item;
    }
  });

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
  const handleNodeVisibilityToggle = useCallback(
    (nodeId: string) => {
      let prevVisible: boolean | undefined;
      let nodeName: string = nodeId;

      const toggleVisibility = (nodes: SceneNode[]): SceneNode[] => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            prevVisible = node.visible !== false;
            nodeName = node.name ?? node.id;
            return { ...node, visible: !prevVisible };
          }
          if (node.children) {
            return { ...node, children: toggleVisibility(node.children) };
          }
          return node;
        });
      };

      setSceneNodes(prev => toggleVisibility(prev));

      const newVisible = !(prevVisible ?? true);
      const actionText = newVisible ? '显示' : '隐藏';

      addHistory({
        actionType: 'modify',
        targetType: 'object',
        targetId: nodeId,
        targetName: nodeName,
        description: `${actionText}对象：${nodeName}`,
        oldValue: { visible: prevVisible },
        newValue: { visible: newVisible },
        logLevel: 'info',
      });
    },
    [addHistory]
  );

  /**
   * 处理右侧栏标签切换
   * @param tab 标签类型
   */
  const handleRightSidebarTabChange = useCallback(
    (tab: RightSidebarTabType) => {
      setRightSidebarTab(tab);
    },
    []
  );

  /**
   * 处理底部面板类型切换
   * @param type 面板类型
   */
  const handleBottomPanelTypeChange = useCallback((type: BottomPanelType) => {
    setBottomPanelType(type);
    console.log('切换底部面板类型:', type);
  }, []);

  const handleExportClick = useCallback(() => {
    addHistory({
      actionType: 'export',
      targetType: 'scene',
      targetName: projectTitle,
      description: `导出项目：${projectTitle}`,
    });
  }, [addHistory, projectTitle]);

  const handleSaveClick = useCallback(() => {
    addHistory({
      actionType: 'scene',
      targetType: 'scene',
      targetName: projectTitle,
      description: `保存项目：${projectTitle}`,
    });
  }, [addHistory, projectTitle]);

  const rightActions = RIGHT_TOOLBAR_ACTIONS.map(act => {
    if (act.id === 'export') return { ...act, onClick: handleExportClick };
    if (act.id === 'save') return { ...act, onClick: handleSaveClick };
    return act;
  });

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
          onLogoClick={() => navigate('/')}
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
                sceneNodes={sceneNodes}
              />
            </div>

            {/* 底部面板 */}
            <ResizablePanel
              initialHeight={bottomPanelHeight}
              minHeight={0}
              maxHeight={400}
              position="bottom"
              onHeightChange={setBottomPanelHeight}
            >
              <BottomPanel
                defaultActiveType={bottomPanelType}
                onTypeChange={handleBottomPanelTypeChange}
                height={bottomPanelHeight - 4} // 减去边框高度
                logs={logs}
              />
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

      {/* 导入面板 */}
      <ImportPanel
        visible={importPanelVisible}
        onClose={() => setImportPanelVisible(false)}
        onImportSuccess={handleImportSuccess}
        onImportError={handleImportError}
      />
    </div>
  );
};

export default ProjectEditorPage;
