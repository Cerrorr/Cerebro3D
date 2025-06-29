import { useState, useCallback } from 'react';
import {
  ProjectInfo,
  SceneConfiguration,
  CameraConfiguration,
  LightingConfig,
  DEFAULT_LIGHTING_CONFIG,
  PostProcessingConfig,
  DEFAULT_POST_PROCESSING_CONFIG,
  WeatherConfig,
  DEFAULT_WEATHER_CONFIG,
  RendererConfig,
  DEFAULT_RENDERER_CONFIG,
  HistoryState,
  HistoryPanelConfig,
  DEFAULT_HISTORY_STATE,
  DEFAULT_HISTORY_CONFIG,
  AnimationPanelState,
  ObjectState,
  DEFAULT_OBJECT_STATE,
  MaterialState,
  DEFAULT_MATERIAL_STATE,
  GeometryState,
  DEFAULT_GEOMETRY_STATE,
} from '@/components/projectEditor/rightPanels/types';
import { devLog } from '@/utils/devLog';

export interface UseRightSidebarPanelsStateResult {
  panelsProps: Record<string, any>;
  projectInfo: ProjectInfo;
  sceneConfig: SceneConfiguration;
  cameraConfig: CameraConfiguration;
  lightingConfig: LightingConfig;
  postProcessingConfig: PostProcessingConfig;
  weatherConfig: WeatherConfig;
  rendererConfig: RendererConfig;
  historyState: HistoryState;
  historyConfig: HistoryPanelConfig;
  animationState: AnimationPanelState;
  objectState: ObjectState;
  materialState: MaterialState;
  geometryState: GeometryState;
  handleProjectInfoChange: (info: Partial<ProjectInfo>) => void;
  handleTabSpecificCallbacks: Record<string, any>;
}

/**
 * useRightSidebarPanelsState
 * 将 RightSidebar 内部庞大的面板状态与回调拆分到独立 Hook，降低组件复杂度
 */
export const useRightSidebarPanelsState = (): UseRightSidebarPanelsStateResult => {
  /* ---------------- 基础状态 ---------------- */
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    sceneName: '1221',
    sceneCategory: '其他',
    sceneDescription: '请输入场景描述',
    projectType: 'Web3D',
    coverImage: undefined,
  });

  const [sceneConfig, setSceneConfig] = useState<SceneConfiguration>({
    background: { type: 'texture', value: 'Texture' },
    environment: { type: 'equirect', map: '/images/environment-preview.jpg', intensity: 1 },
    helpers: { enabled: true, axes: true, cameraHelper: false, lightHelper: false },
  });

  const [cameraConfig] = useState<CameraConfiguration>({
    type: 'perspective',
    perspective: { fov: 75, aspect: 16 / 9, near: 0.1, far: 1000 },
    orthographic: {
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
      near: 0.1,
      far: 1000,
      zoom: 1,
    },
    transform: {
      position: { x: 0, y: 5, z: 10 },
      rotation: { x: 0, y: 0, z: 0 },
      target: { x: 0, y: 0, z: 0 },
    },
  });

  const [lightingConfig] = useState<LightingConfig>(DEFAULT_LIGHTING_CONFIG);
  const [postProcessingConfig] = useState<PostProcessingConfig>(DEFAULT_POST_PROCESSING_CONFIG);
  const [weatherConfig] = useState<WeatherConfig>(DEFAULT_WEATHER_CONFIG);
  const [rendererConfig] = useState<RendererConfig>(DEFAULT_RENDERER_CONFIG);

  const [historyState] = useState<HistoryState>({
    ...DEFAULT_HISTORY_STATE,
    currentIndex: -1,
  });
  const [historyConfig] = useState<HistoryPanelConfig>(DEFAULT_HISTORY_CONFIG);

  const [animationState] = useState<AnimationPanelState>({
    animations: [],
    selectedAnimationId: null,
    playbackConfig: { playbackSpeed: 1, autoPlay: true, loopAll: false, blendMode: 'replace' },
    config: {
      showPreview: true,
      showTimeline: true,
      autoSave: false,
      listMode: 'compact',
      sortBy: 'name',
      sortOrder: 'asc',
    },
    searchKeyword: '',
    filterStatus: 'all',
    filterType: 'all',
  });

  const [objectState] = useState<ObjectState>(DEFAULT_OBJECT_STATE);
  const [materialState] = useState<MaterialState>(DEFAULT_MATERIAL_STATE);
  const [geometryState] = useState<GeometryState>(DEFAULT_GEOMETRY_STATE);

  /* ---------------- 通用回调 ---------------- */
  const handleProjectInfoChange = useCallback((info: Partial<ProjectInfo>) => {
    setProjectInfo(prev => ({ ...prev, ...info }));
  }, []);

  const handleSceneConfigChange = useCallback((cfg: Partial<SceneConfiguration>) => {
    setSceneConfig(prev => ({ ...prev, ...cfg }));
  }, []);

  // 此处省略大量相似 onChange 回调，为保持简洁
  const noop = () => devLog('callback skip');

  const panelsProps: Record<string, any> = {
    projectInfo,
    sceneConfig,
    cameraConfig,
    lightingConfig,
    postProcessingConfig,
    weatherConfig,
    rendererConfig,
    historyState,
    historyConfig,
    animationState,
    objectState,
    materialState,
    geometryState,
    /* 回调函数 */
    onProjectInfoChange: handleProjectInfoChange,
    onSceneConfigChange: handleSceneConfigChange,
    onCameraConfigChange: noop,
    onLightingConfigChange: noop,
    onChange: noop,
    onClearHistory: noop,
    onJumpToRecord: noop,
    onFilterChange: noop,
    onConfigChange: noop,
    onAnimationPlay: noop,
    onAnimationPause: noop,
    onAnimationStop: noop,
    onProgressChange: noop,
    onSpeedChange: noop,
    onSearch: noop,
    onFilter: noop,
    onInfoChange: noop,
    onTransformChange: noop,
    onShadowChange: noop,
    onVisibilityChange: noop,
    onRenderOrderChange: noop,
    onClippingChange: noop,
    onExplodeChange: noop,
    onCustomDataChange: noop,
    onAppearanceChange: noop,
    onTextureChange: noop,
    onRenderChange: noop,
    onMaterialSelect: noop,
    onMaterialApply: noop,
    onMorphSettingsChange: noop,
    onOperationsChange: noop,
    onShowVertexNormals: noop,
    onComputeVertexNormals: noop,
    onCenter: noop,
    onRefreshBounds: noop,
  };

  return {
    panelsProps,
    projectInfo,
    sceneConfig,
    cameraConfig,
    lightingConfig,
    postProcessingConfig,
    weatherConfig,
    rendererConfig,
    historyState,
    historyConfig,
    animationState,
    objectState,
    materialState,
    geometryState,
    handleProjectInfoChange,
    handleTabSpecificCallbacks: {}, // 预留
  };
}; 