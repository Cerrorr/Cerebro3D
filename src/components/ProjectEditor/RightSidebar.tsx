import React, { useState, useCallback } from 'react';
import { Tooltip } from 'antd';
import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { RightSidebarProps, RightSidebarTabType } from './types/RightSidebar.types';
import { ProjectInfo, SceneConfiguration } from './types/SceneConfig.types';
import { CameraConfiguration } from './types/CameraConfig.types';
import { LightingConfig, DEFAULT_LIGHTING_CONFIG } from './types/LightingConfig.types';
import { PostProcessingConfig, DEFAULT_POST_PROCESSING_CONFIG } from './types/PostProcessing.types';
import { WeatherConfig, DEFAULT_WEATHER_CONFIG } from './types/WeatherConfig.types';
import { RendererConfig, DEFAULT_RENDERER_CONFIG } from './types/RendererConfig.types';
import { HistoryState, HistoryPanelConfig, DEFAULT_HISTORY_STATE, DEFAULT_HISTORY_CONFIG } from './types/HistoryPanel.types';
import { AnimationPanelState, AnimationType, AnimationStatus } from './types/AnimationPanel.types';
import { ObjectState, DEFAULT_OBJECT_STATE } from './types/ObjectPanel.types';
import { MaterialState, DEFAULT_MATERIAL_STATE } from './types/MaterialPanel.types';
import { GeometryState, DEFAULT_GEOMETRY_STATE } from './types/GeometryPanel.types';
import { TAB_TITLE_MAP, EMPTY_STATE_ICONS, getTabItems, DEFAULT_CONFIG } from './constants';
import SceneConfigPanel from './SceneConfigPanel';
import CameraConfigPanel from './CameraConfigPanel';
import LightingConfigPanel from './LightingConfigPanel';
import PostProcessingPanel from './PostProcessingPanel';
import WeatherConfigPanel from './WeatherConfigPanel';
import RendererConfigPanel from './RendererConfigPanel';
import HistoryPanel from './HistoryPanel';
import AnimationPanel from './AnimationPanel';
import MaterialPanel from './MaterialPanel';
import GeometryPanel from './GeometryPanel';
import ObjectPanel from './ObjectPanel';
import './styles/RightSidebar.scss';

/**
 * 右侧栏组件
 * 提供3D编辑器的配置面板和工具栏
 * @param props 组件属性
 * @returns 右侧栏React组件
 */
const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab = DEFAULT_CONFIG.DEFAULT_ACTIVE_TAB,
  onTabChange,
  visible = true,
  width = DEFAULT_CONFIG.DEFAULT_WIDTH,
  collapsible = true,
  defaultCollapsed = DEFAULT_CONFIG.DEFAULT_COLLAPSED
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [currentTab, setCurrentTab] = useState<RightSidebarTabType>(activeTab);
  
  // 场景配置数据状态
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    sceneName: '1221',
    sceneCategory: '其他',
    sceneDescription: '请输入场景描述',
    projectType: 'Web3D',
    coverImage: undefined
  });

  const [sceneConfig, setSceneConfig] = useState<SceneConfiguration>({
    background: {
      type: 'texture',
      value: 'Texture'
    },
    environment: {
      type: 'equirect',
      map: '/images/environment-preview.jpg',
      intensity: 1.0
    },
    helpers: {
      enabled: true,
      axes: true,
      cameraHelper: false,
      lightHelper: false
    }
  });

  const [cameraConfig, setCameraConfig] = useState<CameraConfiguration>({
    type: 'perspective',
    perspective: {
      fov: 75,
      aspect: 16 / 9,
      near: 0.1,
      far: 1000
    },
    orthographic: {
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
      near: 0.1,
      far: 1000,
      zoom: 1
    },
    transform: {
      position: { x: 0, y: 5, z: 10 },
      rotation: { x: 0, y: 0, z: 0 },
      target: { x: 0, y: 0, z: 0 }
    }
  });

  const [lightingConfig, setLightingConfig] = useState<LightingConfig>(DEFAULT_LIGHTING_CONFIG);
  
  const [postProcessingConfig, setPostProcessingConfig] = useState<PostProcessingConfig>(DEFAULT_POST_PROCESSING_CONFIG);
  
  const [weatherConfig, setWeatherConfig] = useState<WeatherConfig>(DEFAULT_WEATHER_CONFIG);
  
  const [rendererConfig, setRendererConfig] = useState<RendererConfig>(DEFAULT_RENDERER_CONFIG);
  
  const [historyState, setHistoryState] = useState<HistoryState>({
    ...DEFAULT_HISTORY_STATE,
    records: [
      {
        id: '1',
        timestamp: Date.now() - 60000,
        actionType: 'create',
        targetType: 'object',
        targetId: 'cube-1',
        targetName: '立方体',
        description: '创建立方体',
        canUndo: true,
        canRedo: false,
        isUndone: false,
      },
      {
        id: '2',
        timestamp: Date.now() - 30000,
        actionType: 'transform',
        targetType: 'object',
        targetId: 'cube-1',
        targetName: '立方体',
        description: '移动对象位置',
        canUndo: true,
        canRedo: false,
        isUndone: false,
      },
      {
        id: '3',
        timestamp: Date.now() - 15000,
        actionType: 'material',
        targetType: 'object',
        targetId: 'cube-1',
        targetName: '立方体',
        description: '修改材质颜色',
        canUndo: true,
        canRedo: false,
        isUndone: false,
      },
      {
        id: '4',
        timestamp: Date.now() - 5000,
        actionType: 'lighting',
        targetType: 'light',
        targetId: 'light-1',
        targetName: '主光源',
        description: '调整光源强度',
        canUndo: true,
        canRedo: false,
        isUndone: false,
      }
    ],
    currentIndex: 3
  });
  
  const [historyConfig, setHistoryConfig] = useState<HistoryPanelConfig>(DEFAULT_HISTORY_CONFIG);

  // 对象面板状态
  const [objectState, setObjectState] = useState<ObjectState>({
    ...DEFAULT_OBJECT_STATE,
    info: {
      type: 'Group',
      id: 'f39da71b-646b-4856-af2b-2b8c45c1234a',
      name: 'morgh-targets-face_0'
    },
    transform: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    },
    shadow: {
      castShadow: true,
      receiveShadow: true
    },
    visibility: {
      visible: true,
      frustumCulled: true
    },
    renderOrder: {
      renderOrder: 0
    }
  });

  // 材质面板状态
  const [materialState, setMaterialState] = useState<MaterialState>(DEFAULT_MATERIAL_STATE);

  // 几何面板状态
  const [geometryState, setGeometryState] = useState<GeometryState>(DEFAULT_GEOMETRY_STATE);

  // 动画面板状态
  const [animationState, setAnimationState] = useState<AnimationPanelState>({
    animations: [
      // 测试数据
      {
        id: 'anim-1',
        name: '立方体旋转动画',
        type: 'rotation',
        targetId: 'cube-1',
        targetName: '立方体',
        duration: 3000,
        progress: 45.5,
        status: 'playing',
        easing: 'easeInOut',
        loop: true,
        delay: 0,
        createdAt: new Date(Date.now() - 120000),
        updatedAt: new Date(Date.now() - 60000),
        enabled: true
      },
      {
        id: 'anim-2',
        name: '球体位置移动',
        type: 'position',
        targetId: 'sphere-1',
        targetName: '球体',
        duration: 2000,
        progress: 0,
        status: 'stopped',
        easing: 'linear',
        loop: false,
        delay: 500,
        createdAt: new Date(Date.now() - 90000),
        updatedAt: new Date(Date.now() - 30000),
        enabled: true
      },
      {
        id: 'anim-3',
        name: '材质透明度变化',
        type: 'opacity',
        targetId: 'plane-1',
        targetName: '平面',
        duration: 1500,
        progress: 100,
        status: 'completed',
        easing: 'easeOut',
        loop: false,
        delay: 0,
        createdAt: new Date(Date.now() - 60000),
        updatedAt: new Date(Date.now() - 10000),
        enabled: true
      },
      {
        id: 'anim-4',
        name: '相机环绕运动',
        type: 'camera',
        targetId: 'camera-main',
        targetName: '主相机',
        duration: 5000,
        progress: 23.2,
        status: 'paused',
        easing: 'bounce',
        loop: true,
        delay: 1000,
        createdAt: new Date(Date.now() - 45000),
        updatedAt: new Date(Date.now() - 5000),
        enabled: false
      }
    ],
    selectedAnimationId: 'anim-1',
    playbackConfig: {
      playbackSpeed: 1.0,
      autoPlay: false,
      loopAll: false,
      blendMode: 'replace'
    },
    config: {
      showPreview: true,
      showTimeline: false,
      autoSave: true,
      listMode: 'detailed',
      sortBy: 'created',
      sortOrder: 'desc'
    },
    searchKeyword: '',
    filterType: 'all',
    filterStatus: 'all'
  });

  // 获取标签配置数据
  const tabItems = getTabItems();

  // 处理标签切换
  const handleTabChange = useCallback((tab: RightSidebarTabType) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setCurrentTab(tab);
    onTabChange?.(tab);
  }, [collapsed, onTabChange]);

  // 处理折叠切换
  const handleToggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  // 处理图标区域双击事件
  const handleTabListDoubleClick = useCallback(() => {
    if (collapsible) {
      setCollapsed(prev => !prev);
    }
  }, [collapsible]);

  // 获取标签标题
  const getTabTitle = (tabId: RightSidebarTabType): string => {
    return TAB_TITLE_MAP[tabId] || '未知';
  };

  // 处理项目信息变更
  const handleProjectInfoChange = useCallback((info: Partial<ProjectInfo>) => {
    setProjectInfo(prev => ({ ...prev, ...info }));
  }, []);

  // 处理场景配置变更
  const handleSceneConfigChange = useCallback((config: Partial<SceneConfiguration>) => {
    setSceneConfig(prev => ({ ...prev, ...config }));
  }, []);

  // 处理相机配置变更
  const handleCameraConfigChange = useCallback((config: Partial<CameraConfiguration>) => {
    setCameraConfig(prev => ({ ...prev, ...config }));
  }, []);

  // 处理灯光配置变更
  const handleLightingConfigChange = useCallback((config: Partial<LightingConfig>) => {
    setLightingConfig(prev => ({ ...prev, ...config }));
  }, []);

  // 处理后期处理配置变更
  const handlePostProcessingConfigChange = useCallback((config: PostProcessingConfig) => {
    setPostProcessingConfig(config);
  }, []);

  // 处理天气配置变更
  const handleWeatherConfigChange = useCallback((config: WeatherConfig) => {
    setWeatherConfig(config);
  }, []);

  // 处理渲染器配置变更
  const handleRendererConfigChange = useCallback((config: RendererConfig) => {
    setRendererConfig(config);
  }, []);



  // 处理清空历史记录
  const handleClearHistory = useCallback(() => {
    setHistoryState(prev => ({ ...prev, records: [], groups: [], currentIndex: -1 }));
  }, []);

  // 处理跳转到历史记录
  const handleJumpToRecord = useCallback((recordId: string) => {
    // TODO: 实现跳转逻辑
    console.log('跳转到记录:', recordId);
  }, []);

  // 处理历史记录过滤变更
  const handleHistoryFilterChange = useCallback((filter: any) => {
    setHistoryState(prev => ({ ...prev, filter }));
  }, []);

  // 处理历史记录配置变更
  const handleHistoryConfigChange = useCallback((config: Partial<HistoryPanelConfig>) => {
    setHistoryConfig(prev => ({ ...prev, ...config }));
  }, []);

  // 处理动画播放控制
  const handleAnimationPlay = useCallback((animationId: string) => {
    setAnimationState(prev => ({
      ...prev,
      animations: prev.animations.map(anim => 
        anim.id === animationId ? { ...anim, status: 'playing' as AnimationStatus } : anim
      )
    }));
  }, []);

  const handleAnimationPause = useCallback((animationId: string) => {
    setAnimationState(prev => ({
      ...prev,
      animations: prev.animations.map(anim => 
        anim.id === animationId ? { ...anim, status: 'paused' as AnimationStatus } : anim
      )
    }));
  }, []);

  const handleAnimationStop = useCallback((animationId: string) => {
    setAnimationState(prev => ({
      ...prev,
      animations: prev.animations.map(anim => 
        anim.id === animationId ? { ...anim, status: 'stopped' as AnimationStatus, progress: 0 } : anim
      )
    }));
  }, []);

  // 处理动画进度控制
  const handleAnimationProgressChange = useCallback((animationId: string, progress: number) => {
    setAnimationState(prev => ({
      ...prev,
      animations: prev.animations.map(anim => 
        anim.id === animationId ? { ...anim, progress } : anim
      )
    }));
  }, []);

  // 处理动画速度控制
  const handlePlaybackSpeedChange = useCallback((speed: number) => {
    setAnimationState(prev => ({
      ...prev,
      playbackConfig: { ...prev.playbackConfig, playbackSpeed: speed }
    }));
  }, []);

  // 处理动画面板配置变更
  const handleAnimationConfigChange = useCallback((config: any) => {
    setAnimationState(prev => ({ ...prev, config: { ...prev.config, ...config } }));
  }, []);

  // 处理动画搜索
  const handleAnimationSearch = useCallback((keyword: string) => {
    setAnimationState(prev => ({ ...prev, searchKeyword: keyword }));
  }, []);

  // 处理动画过滤
  const handleAnimationFilter = useCallback((filterType: AnimationType | 'all', filterStatus: AnimationStatus | 'all') => {
    setAnimationState(prev => ({ ...prev, filterType, filterStatus }));
  }, []);

  // 对象面板处理函数
  const handleObjectInfoChange = useCallback((info: any) => {
    setObjectState(prev => ({ ...prev, info: { ...prev.info, ...info } }));
  }, []);

  const handleObjectTransformChange = useCallback((transform: any) => {
    setObjectState(prev => ({ ...prev, transform: { ...prev.transform, ...transform } }));
  }, []);

  const handleObjectShadowChange = useCallback((shadow: any) => {
    setObjectState(prev => ({ ...prev, shadow: { ...prev.shadow, ...shadow } }));
  }, []);

  const handleObjectVisibilityChange = useCallback((visibility: any) => {
    setObjectState(prev => ({ ...prev, visibility: { ...prev.visibility, ...visibility } }));
  }, []);

  const handleObjectRenderOrderChange = useCallback((renderOrder: any) => {
    setObjectState(prev => ({ ...prev, renderOrder: { ...prev.renderOrder, ...renderOrder } }));
  }, []);

  const handleObjectClippingChange = useCallback((clipping: any) => {
    setObjectState(prev => ({ ...prev, clipping: { ...prev.clipping, ...clipping } }));
  }, []);

  const handleObjectExplodeChange = useCallback((explode: any) => {
    setObjectState(prev => ({ ...prev, explode: { ...prev.explode, ...explode } }));
  }, []);

  const handleObjectCustomDataChange = useCallback((customData: any) => {
    setObjectState(prev => ({ ...prev, customData }));
  }, []);

  // 材质面板处理函数
  const handleMaterialInfoChange = useCallback((info: any) => {
    setMaterialState(prev => ({ ...prev, info: { ...prev.info, ...info } }));
  }, []);

  const handleMaterialAppearanceChange = useCallback((appearance: any) => {
    setMaterialState(prev => ({ ...prev, appearance: { ...prev.appearance, ...appearance } }));
  }, []);

  const handleMaterialTextureChange = useCallback((textureType: keyof MaterialState['textures'], texture: any) => {
    setMaterialState(prev => ({ 
      ...prev, 
      textures: { 
        ...prev.textures, 
        [textureType]: { ...prev.textures[textureType], ...texture } 
      } 
    }));
  }, []);

  const handleMaterialRenderChange = useCallback((render: any) => {
    setMaterialState(prev => ({ ...prev, render: { ...prev.render, ...render } }));
  }, []);

  const handleMaterialCustomDataChange = useCallback((customData: any) => {
    setMaterialState(prev => ({ ...prev, customData }));
  }, []);

  const handleMaterialSelect = useCallback((materialName: string) => {
    // TODO: 实现材质选择逻辑
    console.log('选择材质:', materialName);
  }, []);

  const handleMaterialApply = useCallback(() => {
    // TODO: 实现材质应用逻辑
    console.log('应用材质:', materialState);
  }, [materialState]);

  // 几何面板处理函数
  const handleGeometryInfoChange = useCallback((info: any) => {
    setGeometryState(prev => ({ ...prev, info: { ...prev.info, ...info } }));
  }, []);

  const handleGeometryMorphSettingsChange = useCallback((morphSettings: any) => {
    setGeometryState(prev => ({ ...prev, morphSettings: { ...prev.morphSettings, ...morphSettings } }));
  }, []);

  const handleGeometryOperationsChange = useCallback((operations: any) => {
    setGeometryState(prev => ({ ...prev, operations: { ...prev.operations, ...operations } }));
  }, []);

  const handleShowVertexNormals = useCallback(() => {
    // TODO: 实现显示顶点法线逻辑
    console.log('显示顶点法线');
  }, []);

  const handleComputeVertexNormals = useCallback(() => {
    // TODO: 实现计算顶点法线逻辑
    console.log('计算顶点法线');
  }, []);

  const handleGeometryCenter = useCallback(() => {
    // TODO: 实现几何体居中逻辑
    console.log('几何体居中');
  }, []);

  const handleRefreshBounds = useCallback(() => {
    // TODO: 实现刷新边界逻辑
    console.log('刷新边界');
  }, []);

  const handleGeometryCustomDataChange = useCallback((customData: any) => {
    setGeometryState(prev => ({ ...prev, customData }));
  }, []);

  // 渲染内容区域
  const renderContent = () => {
    return (
      <div className="right-sidebar__content">
        <div className="right-sidebar__content-inner">
          {currentTab === 'scene' ? (
            <SceneConfigPanel
              projectInfo={projectInfo}
              sceneConfig={sceneConfig}
              onProjectInfoChange={handleProjectInfoChange}
              onSceneConfigChange={handleSceneConfigChange}
            />
          ) : currentTab === 'camera' ? (
            <CameraConfigPanel
              cameraConfig={cameraConfig}
              onCameraConfigChange={handleCameraConfigChange}
            />
          ) : currentTab === 'lighting' ? (
            <LightingConfigPanel
              lightingConfig={lightingConfig}
              onLightingConfigChange={handleLightingConfigChange}
            />
          ) : currentTab === 'postprocess' ? (
            <PostProcessingPanel
              config={postProcessingConfig}
              onChange={handlePostProcessingConfigChange}
            />
          ) : currentTab === 'weather' ? (
            <WeatherConfigPanel
              config={weatherConfig}
              onChange={handleWeatherConfigChange}
            />
          ) : currentTab === 'renderer' ? (
            <RendererConfigPanel
              config={rendererConfig}
              onChange={handleRendererConfigChange}
            />
          ) : currentTab === 'history' ? (
            <HistoryPanel
              historyState={historyState}
              config={historyConfig}
              onClearHistory={handleClearHistory}
              onJumpToRecord={handleJumpToRecord}
              onFilterChange={handleHistoryFilterChange}
              onConfigChange={handleHistoryConfigChange}
            />
          ) : currentTab === 'animation' ? (
            <AnimationPanel
              animationState={animationState}
              onAnimationPlay={handleAnimationPlay}
              onAnimationPause={handleAnimationPause}
              onAnimationStop={handleAnimationStop}
              onProgressChange={handleAnimationProgressChange}
              onSpeedChange={handlePlaybackSpeedChange}
              onConfigChange={handleAnimationConfigChange}
              onSearch={handleAnimationSearch}
              onFilter={handleAnimationFilter}
            />
          ) : currentTab === 'object' ? (
            <ObjectPanel
              objectState={objectState}
              onInfoChange={handleObjectInfoChange}
              onTransformChange={handleObjectTransformChange}
              onShadowChange={handleObjectShadowChange}
              onVisibilityChange={handleObjectVisibilityChange}
              onRenderOrderChange={handleObjectRenderOrderChange}
              onClippingChange={handleObjectClippingChange}
              onExplodeChange={handleObjectExplodeChange}
              onCustomDataChange={handleObjectCustomDataChange}
            />
          ) : currentTab === 'material' ? (
            <MaterialPanel
              materialState={materialState}
              onInfoChange={handleMaterialInfoChange}
              onAppearanceChange={handleMaterialAppearanceChange}
              onTextureChange={handleMaterialTextureChange}
              onRenderChange={handleMaterialRenderChange}
              onCustomDataChange={handleMaterialCustomDataChange}
              onMaterialSelect={handleMaterialSelect}
              onMaterialApply={handleMaterialApply}
            />
          ) : currentTab === 'geometry' ? (
            <GeometryPanel
              geometryState={geometryState}
              onInfoChange={handleGeometryInfoChange}
              onMorphSettingsChange={handleGeometryMorphSettingsChange}
              onOperationsChange={handleGeometryOperationsChange}
              onShowVertexNormals={handleShowVertexNormals}
              onComputeVertexNormals={handleComputeVertexNormals}
              onCenter={handleGeometryCenter}
              onRefreshBounds={handleRefreshBounds}
              onCustomDataChange={handleGeometryCustomDataChange}
            />
          ) : (
            <>
              <div className="right-sidebar__content-header">
                <h3>{getTabTitle(currentTab)}</h3>
              </div>
              <div className="right-sidebar__content-body">
                <div className="right-sidebar__empty-state">
                  <div className="empty-icon">
                    {EMPTY_STATE_ICONS[currentTab]}
                  </div>
                  <div className="empty-text">
                    {getTabTitle(currentTab)}面板开发中...
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // 渲染分割线
  const renderDivider = (index: number) => (
    <div key={`divider-${index}`} className="right-sidebar__divider" />
  );

  if (!visible) {
    return null;
  }

  if (import.meta.env.DEV) {
    console.log('RightSidebar render:', { collapsed, width, currentTab });
  }

  return (
    <div 
      className={`right-sidebar ${collapsed ? 'right-sidebar--collapsed' : 'right-sidebar--expanded'}`}
      style={{ width: collapsed ? DEFAULT_CONFIG.COLLAPSED_WIDTH : width }}
      data-collapsed={collapsed}
    >
      {/* 左侧图标按钮列表 */}
      <div 
        className="right-sidebar__tab-list"
        onDoubleClick={handleTabListDoubleClick}
        title={collapsed ? "双击展开面板" : "双击收起面板"}
      >
        {/* 折叠切换按钮 - 移到顶部 */}
        {collapsible && (
          <div className="right-sidebar__collapse-btn" onClick={handleToggleCollapse}>
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </div>
        )}
        
        {tabItems.map((item, index) => {
          // 在历史记录后添加分割线
          const showDivider = index === DEFAULT_CONFIG.HISTORY_TAB_INDEX;
          
          return (
            <React.Fragment key={item.id}>
              <Tooltip 
                title={item.label} 
                placement="left"
                mouseEnterDelay={0.5}
              >
                <button
                  className={`right-sidebar__tab-button ${
                    currentTab === item.id ? 'right-sidebar__tab-button--active' : ''
                  } ${
                    !item.enabled ? 'right-sidebar__tab-button--disabled' : ''
                  }`}
                  data-group={item.group}
                  data-tab={item.id}
                  onClick={() => item.enabled && handleTabChange(item.id)}
                  disabled={!item.enabled}
                  aria-label={item.label}
                >
                  {item.icon}
                </button>
              </Tooltip>
              {showDivider && renderDivider(index)}
            </React.Fragment>
          );
        })}
      </div>

      {/* 右侧内容区域 - 只在非收起状态下渲染 */}
      {!collapsed && renderContent()}
    </div>
  );
};

export default RightSidebar; 