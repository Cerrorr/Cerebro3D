import { useState, useCallback } from 'react';
import {
  ProjectInfo,
  SceneConfiguration,
  CameraConfiguration,
  LightingConfig,
  PostProcessingConfig,
  WeatherConfig,
  RendererConfig,
  AnimationPanelState,
  AnimationType,
  AnimationStatus,
  ObjectState,
  MaterialState,
  GeometryState,
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
  GeometryOperations
} from '@/components/projectEditor/rightPanels/types';
import { 
  DEFAULT_LIGHTING_CONFIG,
  DEFAULT_POST_PROCESSING_CONFIG,
  DEFAULT_WEATHER_CONFIG,
  DEFAULT_RENDERER_CONFIG,
  DEFAULT_MATERIAL_STATE,
  DEFAULT_GEOMETRY_STATE,
  DEFAULT_OBJECT_STATE,
  DEFAULT_HISTORY_CONFIG
} from '@/components/projectEditor/rightPanels/constants';
import { devLog } from '@/utils/devLog';
import { useHistoryRecorder } from '@/hooks/business/useHistoryRecorder';
import type { HistoryActionType, HistoryTargetType } from '@/components/projectEditor/rightPanels/types/HistoryPanel.types';
import type {
  UseRightSidebarPanelsStateResult
} from './types/useRightSidebarPanelsState.types';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateCameraConfig } from '@/store/slices/sceneSlice';
import { addRecord } from '@/store/slices/historySlice';

/**
 * 右侧面板状态管理Hook
 * 管理右侧面板的所有状态和回调函数，包括项目信息、场景配置、相机设置等
 * @returns 返回右侧面板的所有状态和操作函数
 * @author Cerror
 * @since 2025-07-08 */
export const useRightSidebarPanelsState = (): UseRightSidebarPanelsStateResult => {
  const dispatch = useAppDispatch();
  
  /* ---------------- Redux状态 ---------------- */
  // 从Redux获取相机配置
  const cameraConfig = useAppSelector(state => state.scene.cameraConfig);

  /* ---------------- 基础状态 ---------------- */
  // 项目信息
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    sceneName: '1221',
    sceneCategory: '其他',
    sceneDescription: '请输入场景描述',
    projectType: 'Web3D',
    coverImage: undefined,
  });

  // 场景配置
  const [sceneConfig, setSceneConfig] = useState<SceneConfiguration>({
    background: { type: 'texture', value: 'Texture' },
    environment: { type: 'equirect', map: '/images/environment-preview.jpg', intensity: 1 },
    helpers: { enabled: true, axes: true, cameraHelper: false, lightHelper: false },
  });

  // 灯光配置
  const [lightingConfig, setLightingConfig] = useState<LightingConfig>(DEFAULT_LIGHTING_CONFIG);
  // 后期处理配置
  const [postProcessingConfig, setPostProcessingConfig] = useState<PostProcessingConfig>(
    DEFAULT_POST_PROCESSING_CONFIG
  );
  // 天气配置
  const [weatherConfig, setWeatherConfig] = useState<WeatherConfig>(DEFAULT_WEATHER_CONFIG);
  // 渲染器配置
  const [rendererConfig, setRendererConfig] = useState<RendererConfig>(DEFAULT_RENDERER_CONFIG);

  /* ---------------- 历史记录 ---------------- */
  const {
    historyState,
    addHistory,
    clearHistory,
    setHistoryFilter,
  } = useHistoryRecorder();

  // 历史面板配置
  const historyConfig = DEFAULT_HISTORY_CONFIG;

  // 动画面板状态
  const [animationState, setAnimationState] = useState<AnimationPanelState>({
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

  // 对象状态
  const [objectState, setObjectState] = useState<ObjectState>(DEFAULT_OBJECT_STATE);
  // 材质状态
  const [materialState, setMaterialState] = useState<MaterialState>(DEFAULT_MATERIAL_STATE);
  // 几何状态
  const [geometryState, setGeometryState] = useState<GeometryState>(DEFAULT_GEOMETRY_STATE);

  /* ---------------- 通用记录器 ---------------- */
  /**
   * 通用记录函数
   * @param description - 操作描述
   * @param actionType - 动作类型
   * @param targetType - 目标类型
   */
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
   * @param config - 场景配置的部分更新
   */
  const handleSceneConfigChange = useCallback(
    (config: Partial<SceneConfiguration>) => {
      setSceneConfig(prev => ({ ...prev, ...config }));
      record('修改场景配置');
    },
    [record]
  );

  /**
   * 生成器函数，用于创建通用记录函数
   * @param desc - 操作描述
   * @param action - 动作类型，默认为 'modify'
   * @param target - 目标类型，默认为 'scene'
   * @returns 返回一个无参数的记录函数
   * @deprecated 当前未使用，保留供将来扩展使用
   */
  // @ts-ignore - 保留供将来使用
  const gen = (desc: string, action: HistoryActionType = 'modify', target: HistoryTargetType = 'scene') => () => record(desc, action, target);

  /**
   * 动画配置变更回调
   * @param config - 动画配置的部分更新
   */
  const handleAnimationConfigChange = useCallback(
    (config: Partial<AnimationPanelState['config']>) => {
      setAnimationState(prev => ({ ...prev, config: { ...prev.config, ...config } }));
      record('修改动画配置');
    },
    [record]
  );

  /**
   * 播放动画
   */
  const handleAnimationPlay = useCallback(
    () => record('播放动画', 'modify', 'animation'),
    [record]
  );

  /**
   * 暂停动画
   */
  const handleAnimationPause = useCallback(
    () => record('暂停动画', 'modify', 'animation'),
    [record]
  );

  /**
   * 停止动画
   */
  const handleAnimationStop = useCallback(
    () => record('停止动画', 'modify', 'animation'),
    [record]
  );

  /**
   * 设置动画进度
   * @param progress - 动画进度百分比
   */
  const handleProgressChange = useCallback(
    (progress: number) => record(`设置动画进度: ${progress}%`),
    [record]
  );

  /**
   * 设置动画播放速度
   * @param speed - 播放速度倍数
   */
  const handleSpeedChange = useCallback(
    (speed: number) => {
      setAnimationState(prev => ({ 
        ...prev, 
        playbackConfig: { ...prev.playbackConfig, playbackSpeed: speed } 
      }));
      record(`设置动画速度: ${speed}x`);
    },
    [record]
  );

  /**
   * 搜索动画
   * @param keyword - 搜索关键词
   */
  const handleAnimationSearch = useCallback(
    (keyword: string) => {
      setAnimationState(prev => ({ ...prev, searchKeyword: keyword }));
    },
    []
  );

  /**
   * 过滤动画
   * @param filterStatus - 过滤状态
   * @param filterType - 过滤类型
   */
  const handleAnimationFilter = useCallback(
    (filterStatus: string, filterType: string) => {
      setAnimationState(prev => ({ 
        ...prev, 
        filterStatus: filterStatus as AnimationStatus | 'all',
        filterType: filterType as AnimationType | 'all'
      }));
    },
    []
  );

  /* ---------------- 通用回调 ---------------- */
  /**
   * 项目信息变更回调
   * @param info - 项目信息的部分更新
   */
  const handleProjectInfoChange = useCallback((info: Partial<ProjectInfo>) => {
    setProjectInfo(prev => ({ ...prev, ...info }));
  }, []);

  /**
   * 相机配置变更回调
   * @param config - 相机配置的部分更新
   */
  const handleCameraConfigChange = useCallback((updates: Partial<CameraConfiguration>) => {
    dispatch(updateCameraConfig(updates));
    
    // 记录历史操作
    dispatch(addRecord({
      actionType: 'modify',
      targetType: 'camera',
      targetName: '相机配置',
      description: `修改相机参数: ${Object.keys(updates).join(', ')}`,
      oldValue: cameraConfig,
      newValue: { ...cameraConfig, ...updates },
    }));
  }, [dispatch, cameraConfig]);

  /**
   * 灯光配置变更回调
   * @param config - 灯光配置的部分更新
   */
  const handleLightingConfigChange = useCallback(
    (config: Partial<LightingConfig>) => {
      setLightingConfig(prev => ({ ...prev, ...config }));
      record('修改灯光配置', 'modify', 'light');
    },
    [record]
  );

  /**
   * 后期处理配置变更回调
   * @param config - 后期处理配置
   */
  const handlePostProcessingConfigChange = useCallback(
    (config: PostProcessingConfig) => {
      setPostProcessingConfig(config);
      record('修改后期处理配置');
    },
    [record]
  );

  /**
   * 天气配置变更回调
   * @param config - 天气配置
   */
  const handleWeatherConfigChange = useCallback(
    (config: WeatherConfig) => {
      setWeatherConfig(config);
      record('修改天气配置');
    },
    [record]
  );

  /**
   * 渲染器配置变更回调
   * @param config - 渲染器配置
   */
  const handleRendererConfigChange = useCallback(
    (config: RendererConfig) => {
      setRendererConfig(config);
      record('修改渲染器配置');
    },
    [record]
  );

  /**
   * 对象信息变更回调
   * @param info - 对象信息的部分更新
   */
  const handleObjectInfoChange = useCallback(
    (info: Partial<ObjectInfo>) => {
      setObjectState(prev => ({ ...prev, info: { ...prev.info, ...info } }));
      record('修改对象信息');
    },
    [record]
  );

  /**
   * 对象变换配置变更回调
   * @param transform - 变换配置的部分更新
   */
  const handleObjectTransformChange = useCallback(
    (transform: Partial<TransformConfig>) => {
      setObjectState(prev => ({ ...prev, transform: { ...prev.transform, ...transform } }));
      record('修改对象变换');
    },
    [record]
  );

  /**
   * 对象阴影配置变更回调
   * @param shadow - 阴影配置的部分更新
   */
  const handleObjectShadowChange = useCallback(
    (shadow: Partial<ObjectShadowConfig>) => {
      setObjectState(prev => ({ ...prev, shadow: { ...prev.shadow, ...shadow } }));
      record('修改对象阴影');
    },
    [record]
  );

  /**
   * 对象可见性配置变更回调
   * @param visibility - 可见性配置的部分更新
   */
  const handleObjectVisibilityChange = useCallback(
    (visibility: Partial<VisibilityConfig>) => {
      setObjectState(prev => ({ ...prev, visibility: { ...prev.visibility, ...visibility } }));
      record('修改对象可见性');
    },
    [record]
  );

  /**
   * 对象渲染次序配置变更回调
   * @param renderOrder - 渲染次序配置的部分更新
   */
  const handleObjectRenderOrderChange = useCallback(
    (renderOrder: Partial<RenderOrderConfig>) => {
      setObjectState(prev => ({ ...prev, renderOrder: { ...prev.renderOrder, ...renderOrder } }));
      record('修改对象渲染次序');
    },
    [record]
  );

  /**
   * 对象剖切配置变更回调
   * @param clipping - 剖切配置的部分更新
   */
  const handleObjectClippingChange = useCallback(
    (clipping: Partial<ClippingConfig>) => {
      setObjectState(prev => ({ ...prev, clipping: { ...prev.clipping, ...clipping } }));
      record('修改对象剖切');
    },
    [record]
  );

  /**
   * 对象爆炸配置变更回调
   * @param explode - 爆炸配置的部分更新
   */
  const handleObjectExplodeChange = useCallback(
    (explode: Partial<ExplodeConfig>) => {
      setObjectState(prev => ({ ...prev, explode: { ...prev.explode, ...explode } }));
      record('修改对象爆炸');
    },
    [record]
  );

  /**
   * 对象自定义数据变更回调
   * @param customData - 自定义数据
   */
  const handleObjectCustomDataChange = useCallback(
    (customData: any) => {
      setObjectState(prev => ({ ...prev, customData }));
      record('修改对象自定义数据');
    },
    [record]
  );

  /* ---------------- 材质相关回调 ---------------- */
  /**
   * 材质信息变更回调
   * @param changes - 材质信息的部分更新
   */
  const handleMaterialInfoChange = useCallback(
    (changes: Partial<MaterialInfo>) => {
      setMaterialState(prev => ({ ...prev, info: { ...prev.info, ...changes } }));
      record('修改材质信息');
    },
    [record]
  );

  /**
   * 材质外观变更回调
   * @param changes - 材质外观的部分更新
   */
  const handleMaterialAppearanceChange = useCallback(
    (changes: Partial<MaterialAppearance>) => {
      setMaterialState(prev => ({ ...prev, appearance: { ...prev.appearance, ...changes } }));
      record('修改材质外观');
    },
    [record]
  );

  /**
   * 材质贴图变更回调
   * @param textureType - 贴图类型
   * @param changes - 贴图配置的部分更新
   */
  const handleMaterialTextureChange = useCallback(
    (textureType: keyof MaterialTextures, changes: Partial<TextureConfig>) => {
      setMaterialState(prev => ({
        ...prev,
        textures: {
          ...prev.textures,
          [textureType]: { ...prev.textures[textureType], ...changes },
        },
      }));
      record('修改材质贴图');
    },
    [record]
  );

  /**
   * 材质渲染配置变更回调
   * @param changes - 材质渲染配置的部分更新
   */
  const handleMaterialRenderChange = useCallback(
    (changes: Partial<MaterialRender>) => {
      setMaterialState(prev => ({ ...prev, render: { ...prev.render, ...changes } }));
      record('修改材质渲染');
    },
    [record]
  );

  /**
   * 材质自定义数据变更回调
   * @param data - 自定义数据
   */
  const handleMaterialCustomDataChange = useCallback(
    (data: Record<string, any>) => {
      setMaterialState(prev => ({ ...prev, customData: data }));
      record('修改材质自定义数据');
    },
    [record]
  );

  /**
   * 选择材质回调
   * @param name - 材质名称
   */
  const handleMaterialSelect = useCallback(
    (name: string) => record(`选择材质 ${name}`),
    [record]
  );

  // 应用材质
  const handleMaterialApply = useCallback(
    () => record('应用材质'),
    [record]
  );

  /* ---------------- 几何相关回调 ---------------- */
  /**
   * 几何信息变更回调
   * @param changes - 几何信息的部分更新
   */
  const handleGeometryInfoChange = useCallback(
    (changes: Partial<GeometryInfo>) => {
      setGeometryState(prev => ({ ...prev, info: { ...prev.info, ...changes } }));
      record('修改几何信息');
    },
    [record]
  );

  /**
   * 几何属性变更回调
   * @param changes - 几何属性的部分更新
   */
  const handleGeometryAttributesChange = useCallback(
    (changes: Partial<GeometryAttributes>) => {
      setGeometryState(prev => ({ ...prev, attributes: { ...prev.attributes, ...changes } }));
      record('修改几何属性');
    },
    [record]
  );

  /**
   * 几何Morph设置变更回调
   * @param changes - Morph设置的部分更新
   */
  const handleGeometryMorphSettingsChange = useCallback(
    (changes: Partial<MorphSettings>) => {
      setGeometryState(prev => ({ ...prev, morphSettings: { ...prev.morphSettings, ...changes } }));
      record('修改几何Morph设置');
    },
    [record]
  );

  /**
   * 几何操作设置变更回调
   * @param changes - 几何操作设置的部分更新
   */
  const handleGeometryOperationsChange = useCallback(
    (changes: Partial<GeometryOperations>) => {
      setGeometryState(prev => ({ ...prev, operations: { ...prev.operations, ...changes } }));
      record('修改几何操作设置');
    },
    [record]
  );

  // 显示顶点法线
  const handleShowVertexNormals = useCallback(
    () => record('显示顶点法线'),
    [record]
  );

  // 计算顶点法线
  const handleComputeVertexNormals = useCallback(
    () => record('计算顶点法线'),
    [record]
  );

  // 几何中心
  const handleCenter = useCallback(
    () => record('几何中心'),
    [record]
  );

  // 刷新边界框
  const handleRefreshBounds = useCallback(
    () => record('刷新边界框'),
    [record]
  );

  /**
   * 几何自定义数据变更回调
   * @param data - 自定义数据
   */
  const handleGeometryCustomDataChange = useCallback(
    (data: Record<string, any>) => {
      setGeometryState(prev => ({ ...prev, customData: data }));
      record('修改几何自定义数据');
    },
    [record]
  );

  /**
   * 跳转到历史记录回调
   * @param recordId - 记录ID
   */
  const handleJumpToRecord = useCallback(
    (recordId: string) => {
      devLog(`jump to record ${recordId}`);
    },
    []
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
    onJumpToRecord: handleJumpToRecord,
    onFilterChange: setHistoryFilter,
    onConfigChange: handleAnimationConfigChange,
    onAnimationPlay: handleAnimationPlay,
    onAnimationPause: handleAnimationPause,
    onAnimationStop: handleAnimationStop,
    onProgressChange: handleProgressChange,
    onSpeedChange: handleSpeedChange,
    onSearch: handleAnimationSearch,
    onFilter: handleAnimationFilter,
    onObjectInfoChange: handleObjectInfoChange,
    onObjectTransformChange: handleObjectTransformChange,
    onObjectShadowChange: handleObjectShadowChange,
    onObjectVisibilityChange: handleObjectVisibilityChange,
    onObjectRenderOrderChange: handleObjectRenderOrderChange,
    onObjectClippingChange: handleObjectClippingChange,
    onObjectExplodeChange: handleObjectExplodeChange,
    onObjectCustomDataChange: handleObjectCustomDataChange,
    onMaterialInfoChange: handleMaterialInfoChange,
    onMaterialAppearanceChange: handleMaterialAppearanceChange,
    onMaterialTextureChange: handleMaterialTextureChange,
    onMaterialRenderChange: handleMaterialRenderChange,
    onMaterialCustomDataChange: handleMaterialCustomDataChange,
    onMaterialSelect: handleMaterialSelect,
    onMaterialApply: handleMaterialApply,
    onGeometryInfoChange: handleGeometryInfoChange,
    onGeometryAttributesChange: handleGeometryAttributesChange,
    onGeometryMorphSettingsChange: handleGeometryMorphSettingsChange,
    onGeometryOperationsChange: handleGeometryOperationsChange,
    onShowVertexNormals: handleShowVertexNormals,
    onComputeVertexNormals: handleComputeVertexNormals,
    onCenter: handleCenter,
    onRefreshBounds: handleRefreshBounds,
    onGeometryCustomDataChange: handleGeometryCustomDataChange,
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