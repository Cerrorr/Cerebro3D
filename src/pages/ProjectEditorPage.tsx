import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { App } from 'antd';
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
  RightSidebarTabType,
  BottomPanelType,
} from '@/components/projectEditor/types';
import { ProjectEditorPageProps } from './types';
import {
  DEFAULT_PANEL_CONFIG,
  RIGHT_TOOLBAR_ACTIONS,
  getLeftToolbarActions,
} from './constants';
import { extractModelStructure } from '@/hooks/three/utils/threeUtils';
import { Scene3DService } from '@/hooks/three/services';
import './styles/ProjectEditorPage.scss';
import { useHistoryRecorder } from '@/hooks/business/useHistoryRecorder';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  addSceneNode, 
  selectNode, 
  toggleNodeVisibility
} from '@/store/slices/sceneSlice';

/**
 * 项目页面主组件 (重构版)
 * 业务逻辑通过Redux管理，3D渲染完全分离
 * @param props 组件属性
 * @returns 项目页面React组件
 * @author Cerror
 * @since 2025-07-11 */
const ProjectEditorPage: React.FC<ProjectEditorPageProps> = ({
  projectTitle: initialTitle,
  projectLogo = '/images/logo.png',
}) => {
  // 路由相关hooks
  const { } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 从Redux获取状态
  const { nodes: sceneNodes, selectedNodeId } = useAppSelector(state => state.scene);
  
  // 本地UI状态（不涉及3D或业务逻辑）
  const [projectTitle, setProjectTitle] = useState('');
  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(
    DEFAULT_PANEL_CONFIG.BOTTOM_PANEL_HEIGHT
  );
  const [rightSidebarTab, setRightSidebarTab] =
    useState<RightSidebarTabType>('scene');
  const [bottomPanelType, setBottomPanelType] =
    useState<BottomPanelType>('assets');
  const [importPanelVisible, setImportPanelVisible] = useState(false);

  // 历史记录 & 日志 Hook
  const { addHistory, logs } = useHistoryRecorder();
  
  // 使用 App 组件的 message API
  const { message } = App.useApp();

  // 场景初始化状态标记
  const [sceneInitialized, setSceneInitialized] = useState(false);

  // 3D场景服务实例
  const [scene3DService] = useState(() => new Scene3DService({
    container: null, // 将在ViewportScene中设置
    onError: (error: Error) => {
      console.error('3D场景错误:', error);
      addHistory({
        actionType: 'scene',
        targetType: 'scene',
        targetName: projectTitle,
        description: `3D场景错误: ${error.message}`,
        logLevel: 'error'
      });
    },
    onSceneUpdate: (object) => {
      console.log('场景更新:', object);
    }
  }));

  // 场景初始化
  useEffect(() => {
    // 防止重复初始化
    if (sceneInitialized) return;

    const initializeScene = async () => {
      try {
        const result = await scene3DService.initialize();
        if (result.success) {
          // 只有在真正的初始化成功时才记录日志，避免重复的"已初始化"消息
          if (result.message === '3D场景初始化成功') {
            addHistory({
              actionType: 'scene',
              targetType: 'scene',
              targetName: projectTitle || '新建项目',
              description: '3D场景初始化成功',
              logLevel: 'info'
            });
          }
          setSceneInitialized(true);
        } else {
          addHistory({
            actionType: 'scene',
            targetType: 'scene',
            targetName: projectTitle || '新建项目',
            description: `3D场景初始化失败: ${result.message}`,
            logLevel: 'error'
          });
        }
      } catch (error) {
        console.error('场景初始化错误:', error);
        addHistory({
          actionType: 'scene',
          targetType: 'scene',
          targetName: projectTitle || '新建项目',
          description: `场景初始化错误: ${error instanceof Error ? error.message : '未知错误'}`,
          logLevel: 'error'
        });
      }
    };

    // 延迟初始化，确保组件已挂载
    setTimeout(initializeScene, 100);
  }, [scene3DService, addHistory]); // 移除projectTitle依赖

  // 初始化项目标题
  useEffect(() => {
    const routeState = location.state as {
      projectTitle?: string;
      projectType?: string;
      isNewProject?: boolean;
    } | null;

    const finalProjectTitle =
      routeState?.projectTitle || initialTitle || '新建项目';
    setProjectTitle(finalProjectTitle);
  }, [location.state, initialTitle]);

  const handleImportSuccess = useCallback((results: any[]) => {
    // 处理导入的模型
    results.forEach(result => {
      // 生成唯一ID
      const objectId = `imported_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      
      // 将Three.js对象存储到3D服务中
      const addResult = scene3DService.addObject(objectId, result.object, {
        position: result.position ? {
          x: result.position.x,
          y: result.position.y,
          z: result.position.z
        } : { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      });

      if (!addResult.success) {
        console.error('添加3D对象失败:', addResult.message);
        return;
      }

      // Redux只存储元数据，不包含Three.js对象
      const newNode = {
        name: result.fileName,
        type: 'mesh' as const,
        visible: true,
        expanded: true,
        // 只存储对象ID引用，不存储Three.js对象
        objectId: objectId,
        position: result.position ? {
          x: result.position.x,
          y: result.position.y,
          z: result.position.z
        } : { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        children: result.object ? extractModelStructure(result.object, result.fileName) : []
      };

      // 添加到Scene节点下
      dispatch(addSceneNode({
        parentId: 'scene',
        node: newNode
      }));
    });

    // 记录导入历史 - 合并为一条记录
    if (results.length > 0) {
      addHistory({
        actionType: 'import',
        targetType: 'scene',
        targetName: projectTitle,
        description: `成功导入 ${results.length} 个3D模型: ${results.map(r => r.fileName).join(', ')}`,
        logLevel: 'info'
      });
    }

    message.success(`成功导入 ${results.length} 个3D模型`);
  }, [addHistory, dispatch]);

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

  /**
   * 处理场景树节点选择 - 通过Redux管理
   * @param nodeId 节点ID
   */
  const handleNodeSelect = useCallback((nodeId: string) => {
    dispatch(selectNode(nodeId));
    console.log('选中节点:', nodeId);
  }, [dispatch]);

  /**
   * 处理场景树节点可见性切换 - 通过Redux管理
   * @param nodeId 节点ID
   */
  const handleNodeVisibilityToggle = useCallback(
    (nodeId: string) => {
      dispatch(toggleNodeVisibility(nodeId));
      
      // 查找节点名称用于历史记录
      const findNodeName = (nodes: any[], id: string): string => {
        for (const node of nodes) {
          if (node.id === id) return node.name || id;
          if (node.children) {
            const found = findNodeName(node.children, id);
            if (found) return found;
          }
        }
        return id;
      };

      const nodeName = findNodeName(sceneNodes, nodeId);
      const visible = sceneNodes.find(node => node.id === nodeId)?.visible;
      addHistory({
        actionType: 'modify',
        targetType: 'object',
        targetId: nodeId,
        targetName: nodeName,
        description: `切换对象可见性：${nodeName}${visible ? '显示' : '隐藏'}`,
        logLevel: 'info',
      });
    },
    [dispatch, addHistory, sceneNodes]
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

  // 工具栏左侧按钮 - 使用原有的配置并覆盖onClick
  const leftActions = getLeftToolbarActions().map(action => {
    switch (action.id) {
      case 'import':
        return { ...action, onClick: () => setImportPanelVisible(true) };
      case 'undo':
        return { ...action, onClick: () => addHistory({ actionType: 'undo', targetType: 'scene', targetName: projectTitle, description: '撤回一次操作' }) };
      case 'redo':
        return { ...action, onClick: () => addHistory({ actionType: 'redo', targetType: 'scene', targetName: projectTitle, description: '重做一次操作' }) };
      case 'delete':
        return { ...action, onClick: () => addHistory({ actionType: 'delete', targetType: 'scene', targetName: projectTitle, description: '删除选中对象' }) };
      case 'clear':
        return { ...action, onClick: () => addHistory({ actionType: 'scene', targetType: 'scene', targetName: projectTitle, description: '清空场景对象' }) };
      case 'copy':
        return { ...action, onClick: () => addHistory({ actionType: 'create', targetType: 'scene', targetName: projectTitle, description: '复制选中对象' }) };
      default:
        return action;
    }
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
              selectedNodeId={selectedNodeId || ''}
              onNodeSelect={handleNodeSelect}
              onNodeVisibilityChange={handleNodeVisibilityToggle}
            />
          </div>

          {/* 中间画布区域 - 现在完全通过Redux管理状态 */}
          <div className="layout-center">
            <div className="canvas-container">
              <Canvas3D
                width="100%"
                height="100%"
                className=""
                scene3DService={scene3DService}
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
