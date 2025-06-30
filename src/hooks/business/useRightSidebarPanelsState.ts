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
  HistoryPanelConfig,
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
import { useHistoryRecorder } from '@/hooks/business/useHistoryRecorder';
import type { HistoryActionType, HistoryTargetType } from '@/components/projectEditor/rightPanels/types/HistoryPanel.types';
import type { HistorySliceState } from '@/store/types/historySlice.types';

export interface UseRightSidebarPanelsStateResult {
  panelsProps: Record<string, any>;
  projectInfo: ProjectInfo;
  sceneConfig: SceneConfiguration;
  cameraConfig: CameraConfiguration;
  lightingConfig: LightingConfig;
  postProcessingConfig: PostProcessingConfig;
  weatherConfig: WeatherConfig;
  rendererConfig: RendererConfig;
  historyState: HistorySliceState;
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

  const [sceneConfig] = useState<SceneConfiguration>({
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

  /* --------- 历史记录（使用统一 Hook） --------- */
  const {
    historyState,
    addHistory,
    clearHistory,
    setHistoryFilter,
  } = useHistoryRecorder();

  const historyConfig = DEFAULT_HISTORY_CONFIG;

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

  /* --------- 通用记录器 --------- */
  const record = (description: string, actionType: HistoryActionType = 'modify', targetType: HistoryTargetType = 'scene') => {
    addHistory({
      actionType,
      targetType,
      targetName: description,
      description,
    });
  };

  const gen = (desc: string, action: HistoryActionType = 'modify', target: HistoryTargetType = 'scene') => () => record(desc, action, target);

  const noop = gen('未实现操作');

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
    onSceneConfigChange: () => record('修改场景配置'),
    onCameraConfigChange: () => record('修改相机配置', 'camera', 'camera'),
    onLightingConfigChange: () => record('修改灯光配置', 'lighting', 'light'),
    onChange: () => record('面板参数修改'),
    onClearHistory: clearHistory,
    onJumpToRecord: (recordId: string) => {
      devLog(`jump to record ${recordId}`);
    },
    onFilterChange: setHistoryFilter,
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