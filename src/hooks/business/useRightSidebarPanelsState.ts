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
  ObjectInfo,
  TransformConfig,
  ObjectShadowConfig,
  VisibilityConfig,
  RenderOrderConfig,
  ClippingConfig,
  ExplodeConfig,
  MaterialInfo,
  MaterialAppearance,
  MaterialTextures,
  TextureConfig,
  MaterialRender,
  GeometryInfo,
  GeometryAttributes,
  MorphSettings,
  GeometryOperations,
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

  // 场景配置（可更新）
  const [sceneConfig, setSceneConfig] = useState<SceneConfiguration>({
    background: { type: 'texture', value: 'Texture' },
    environment: { type: 'equirect', map: '/images/environment-preview.jpg', intensity: 1 },
    helpers: { enabled: true, axes: true, cameraHelper: false, lightHelper: false },
  });

  // 相机配置（可更新）
  const [cameraConfig, setCameraConfig] = useState<CameraConfiguration>({
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

  // 灯光配置（可更新）
  const [lightingConfig, setLightingConfig] = useState<LightingConfig>(DEFAULT_LIGHTING_CONFIG);
  // 后期处理、天气、渲染器配置（可更新）
  const [postProcessingConfig, setPostProcessingConfig] = useState<PostProcessingConfig>(
    DEFAULT_POST_PROCESSING_CONFIG
  );
  const [weatherConfig, setWeatherConfig] = useState<WeatherConfig>(DEFAULT_WEATHER_CONFIG);
  const [rendererConfig, setRendererConfig] = useState<RendererConfig>(DEFAULT_RENDERER_CONFIG);

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

  // 对象状态（可更新）
  const [objectState, setObjectState] = useState<ObjectState>(DEFAULT_OBJECT_STATE);
  // 材质、几何状态（可更新）
  const [materialState, setMaterialState] = useState<MaterialState>(DEFAULT_MATERIAL_STATE);
  const [geometryState, setGeometryState] = useState<GeometryState>(DEFAULT_GEOMETRY_STATE);

  /* --------- 通用记录器 --------- */
  const record = useCallback(
    (
      description: string,
      actionType: HistoryActionType = 'modify',
      targetType: HistoryTargetType = 'scene'
    ) => {
      addHistory({
        actionType,
        targetType,
        targetName: description,
        description,
      });
    },
    [addHistory]
  );

  /**
   * 场景配置变更回调
   * 支持局部更新，自动合并到旧配置
   */
  const handleSceneConfigChange = useCallback(
    (config: Partial<SceneConfiguration>) => {
      setSceneConfig(prev => ({ ...prev, ...config }));
      record('修改场景配置');
    },
    [record]
  );

  const gen = (desc: string, action: HistoryActionType = 'modify', target: HistoryTargetType = 'scene') => () => record(desc, action, target);

  const noop = gen('未实现操作');

  /* ---------------- 通用回调 ---------------- */
  const handleProjectInfoChange = useCallback((info: Partial<ProjectInfo>) => {
    setProjectInfo(prev => ({ ...prev, ...info }));
  }, []);

  /** 相机配置变更回调 */
  const handleCameraConfigChange = useCallback(
    (config: Partial<CameraConfiguration>) => {
      setCameraConfig(prev => ({ ...prev, ...config }));
      record('修改相机配置', 'modify', 'camera');
    },
    [record]
  );

  /** 灯光配置变更回调 */
  const handleLightingConfigChange = useCallback(
    (config: Partial<LightingConfig>) => {
      setLightingConfig(prev => ({ ...prev, ...config }));
      record('修改灯光配置', 'modify', 'light');
    },
    [record]
  );

  /** 后期处理配置变更回调 */
  const handlePostProcessingConfigChange = useCallback(
    (config: PostProcessingConfig) => {
      setPostProcessingConfig(config);
      record('修改后期处理配置');
    },
    [record]
  );

  /** 天气配置变更回调 */
  const handleWeatherConfigChange = useCallback(
    (config: WeatherConfig) => {
      setWeatherConfig(config);
      record('修改天气配置');
    },
    [record]
  );

  /** 渲染器配置变更回调 */
  const handleRendererConfigChange = useCallback(
    (config: RendererConfig) => {
      setRendererConfig(config);
      record('修改渲染器配置');
    },
    [record]
  );

  /** 对象信息变更 */
  const handleObjectInfoChange = useCallback(
    (info: Partial<ObjectInfo>) => {
      setObjectState(prev => ({ ...prev, info: { ...prev.info, ...info } }));
      record('修改对象信息');
    },
    [record]
  );

  /** 变换变更 */
  const handleObjectTransformChange = useCallback(
    (transform: Partial<TransformConfig>) => {
      setObjectState(prev => ({ ...prev, transform: { ...prev.transform, ...transform } }));
      record('修改对象变换');
    },
    [record]
  );

  /** 阴影配置变更 */
  const handleObjectShadowChange = useCallback(
    (shadow: Partial<ObjectShadowConfig>) => {
      setObjectState(prev => ({ ...prev, shadow: { ...prev.shadow, ...shadow } }));
      record('修改对象阴影');
    },
    [record]
  );

  /** 可见性变更 */
  const handleObjectVisibilityChange = useCallback(
    (visibility: Partial<VisibilityConfig>) => {
      setObjectState(prev => ({ ...prev, visibility: { ...prev.visibility, ...visibility } }));
      record('修改对象可见性');
    },
    [record]
  );

  /** 渲染次序变更 */
  const handleObjectRenderOrderChange = useCallback(
    (renderOrder: Partial<RenderOrderConfig>) => {
      setObjectState(prev => ({ ...prev, renderOrder: { ...prev.renderOrder, ...renderOrder } }));
      record('修改对象渲染次序');
    },
    [record]
  );

  /** 剖切配置变更 */
  const handleObjectClippingChange = useCallback(
    (clipping: Partial<ClippingConfig>) => {
      setObjectState(prev => ({ ...prev, clipping: { ...prev.clipping, ...clipping } }));
      record('修改对象剖切');
    },
    [record]
  );

  /** 爆炸配置变更 */
  const handleObjectExplodeChange = useCallback(
    (explode: Partial<ExplodeConfig>) => {
      setObjectState(prev => ({ ...prev, explode: { ...prev.explode, ...explode } }));
      record('修改对象爆炸');
    },
    [record]
  );

  /** 自定义数据变更 */
  const handleObjectCustomDataChange = useCallback(
    (customData: any) => {
      setObjectState(prev => ({ ...prev, customData }));
      record('修改对象自定义数据');
    },
    [record]
  );

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
    onCameraConfigChange: handleCameraConfigChange,
    onLightingConfigChange: handleLightingConfigChange,
    onChange: handlePostProcessingConfigChange,
    onWeatherChange: handleWeatherConfigChange,
    onRendererChange: handleRendererConfigChange,
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
    onObjectInfoChange: handleObjectInfoChange,
    onObjectTransformChange: handleObjectTransformChange,
    onObjectShadowChange: handleObjectShadowChange,
    onObjectVisibilityChange: handleObjectVisibilityChange,
    onObjectRenderOrderChange: handleObjectRenderOrderChange,
    onObjectClippingChange: handleObjectClippingChange,
    onObjectExplodeChange: handleObjectExplodeChange,
    onObjectCustomDataChange: handleObjectCustomDataChange,
    onMaterialInfoChange: (changes: Partial<MaterialInfo>) => {
      setMaterialState(prev => ({ ...prev!, info: { ...prev!.info, ...changes } } as any));
      record('修改材质信息');
    },
    onMaterialAppearanceChange: (changes: Partial<MaterialAppearance>) => {
      setMaterialState(prev => ({ ...prev!, appearance: { ...prev!.appearance, ...changes } } as any));
      record('修改材质外观');
    },
    onMaterialTextureChange: (
      textureType: keyof MaterialTextures,
      changes: Partial<TextureConfig>
    ) => {
      setMaterialState(prev => ({
        ...prev!,
        textures: {
          ...(prev!.textures as any),
          [textureType]: { ...(prev!.textures as any)[textureType], ...changes },
        },
      } as any));
      record('修改材质贴图');
    },
    onMaterialRenderChange: (changes: Partial<MaterialRender>) => {
      setMaterialState(prev => ({ ...prev!, render: { ...prev!.render, ...changes } } as any));
      record('修改材质渲染');
    },
    onMaterialCustomDataChange: (data: Record<string, any>) => {
      setMaterialState(prev => ({ ...prev!, customData: data } as any));
      record('修改材质自定义数据');
    },
    onMaterialSelect: (name: string) => record(`选择材质 ${name}`),
    onMaterialApply: () => record('应用材质'),
    onGeometryInfoChange: (changes: Partial<GeometryInfo>) => {
      setGeometryState(prev => ({ ...prev!, info: { ...prev!.info, ...changes } } as any));
      record('修改几何信息');
    },
    onGeometryAttributesChange: (changes: Partial<GeometryAttributes>) => {
      setGeometryState(prev => ({ ...prev!, attributes: { ...prev!.attributes, ...changes } } as any));
      record('修改几何属性');
    },
    onGeometryMorphSettingsChange: (changes: Partial<MorphSettings>) => {
      setGeometryState(prev => ({ ...prev!, morphSettings: { ...prev!.morphSettings, ...changes } } as any));
      record('修改几何Morph设置');
    },
    onGeometryOperationsChange: (changes: Partial<GeometryOperations>) => {
      setGeometryState(prev => ({ ...prev!, operations: { ...prev!.operations, ...changes } } as any));
      record('修改几何操作设置');
    },
    onShowVertexNormals: () => {
      record('显示顶点法线');
    },
    onComputeVertexNormals: () => {
      record('计算顶点法线');
    },
    onCenter: () => record('几何中心'),
    onRefreshBounds: () => record('刷新边界框'),
    onGeometryCustomDataChange: (data: Record<string, any>) => {
      setGeometryState(prev => ({ ...prev!, customData: data } as any));
      record('修改几何自定义数据');
    },
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