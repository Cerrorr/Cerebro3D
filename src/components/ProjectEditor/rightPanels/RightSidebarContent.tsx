import React from 'react';
import type { RightSidebarTabType } from './types';
import SceneConfigPanel from './SceneConfigPanel';
import CameraConfigPanel from './CameraConfigPanel';
import LightingConfigPanel from './LightingConfigPanel';
import PostProcessingPanel from './PostProcessingPanel';
import WeatherConfigPanel from './WeatherConfigPanel';
import RendererConfigPanel from './RendererConfigPanel';
import HistoryPanel from './HistoryPanel';
import AnimationPanel from './AnimationPanel';
import ObjectPanel from './ObjectPanel';
import MaterialPanel from './MaterialPanel';
import GeometryPanel from './GeometryPanel';
import { EMPTY_STATE_ICONS, TAB_TITLE_MAP } from './constants/RightSidebar.constants';

/**
 * RightSidebarContent组件属性接口
 * @author Cerror
 * @since 2025-07-08
 */
interface RightSidebarContentProps {
  /** 当前激活的标签页类型 */
  currentTab: RightSidebarTabType;
  /** 所有面板状态和回调函数集合 */
  panelsProps: Record<string, any>;
}

/**
 * RightSidebarContent组件
 * 右侧边栏内容区域，根据当前标签页渲染对应的面板
 * @author Cerror
 * @since 2025-07-08
 */

const RightSidebarContent: React.FC<RightSidebarContentProps> = ({ currentTab, panelsProps }) => {
  const {
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
    // 回调函数们
    ...handlers
  } = panelsProps;

  return (
    <div className="right-sidebar__content">
      <div className="right-sidebar__content-inner">
        {currentTab === 'scene' ? (
          <SceneConfigPanel
            projectInfo={projectInfo}
            sceneConfig={sceneConfig}
            onProjectInfoChange={handlers.onProjectInfoChange}
            onSceneConfigChange={handlers.onSceneConfigChange}
          />
        ) : currentTab === 'camera' ? (
          <CameraConfigPanel
            cameraConfig={cameraConfig}
            onCameraConfigChange={handlers.onCameraConfigChange}
          />
        ) : currentTab === 'lighting' ? (
          <LightingConfigPanel
            lightingConfig={lightingConfig}
            onLightingConfigChange={handlers.onLightingConfigChange}
          />
        ) : currentTab === 'postprocess' ? (
          <PostProcessingPanel
            config={postProcessingConfig}
            onChange={handlers.onChange}
          />
        ) : currentTab === 'weather' ? (
          <WeatherConfigPanel
            config={weatherConfig}
            onChange={handlers.onWeatherChange ?? handlers.onChange}
          />
        ) : currentTab === 'renderer' ? (
          <RendererConfigPanel
            config={rendererConfig}
            onChange={handlers.onRendererChange ?? handlers.onChange}
          />
        ) : currentTab === 'history' ? (
          <HistoryPanel
            historyState={historyState}
            config={historyConfig}
            onClearHistory={handlers.onClearHistory}
            onJumpToRecord={handlers.onJumpToRecord}
            onFilterChange={handlers.onFilterChange}
            onConfigChange={handlers.onConfigChange}
          />
        ) : currentTab === 'animation' ? (
          <AnimationPanel
            animationState={animationState}
            onAnimationPlay={handlers.onAnimationPlay}
            onAnimationPause={handlers.onAnimationPause}
            onAnimationStop={handlers.onAnimationStop}
            onProgressChange={handlers.onProgressChange}
            onSpeedChange={handlers.onSpeedChange}
            onConfigChange={handlers.onPlaybackConfigChange}
            onSearch={handlers.onSearch}
            onFilter={handlers.onFilter}
          />
        ) : currentTab === 'object' ? (
          <ObjectPanel
            objectState={objectState}
            onInfoChange={handlers.onObjectInfoChange}
            onTransformChange={handlers.onObjectTransformChange}
            onShadowChange={handlers.onObjectShadowChange}
            onVisibilityChange={handlers.onObjectVisibilityChange}
            onRenderOrderChange={handlers.onObjectRenderOrderChange}
            onClippingChange={handlers.onObjectClippingChange}
            onExplodeChange={handlers.onObjectExplodeChange}
            onCustomDataChange={handlers.onObjectCustomDataChange}
          />
        ) : currentTab === 'material' ? (
          <MaterialPanel
            materialState={materialState}
            onInfoChange={handlers.onMaterialInfoChange}
            onAppearanceChange={handlers.onMaterialAppearanceChange}
            onTextureChange={handlers.onMaterialTextureChange}
            onRenderChange={handlers.onMaterialRenderChange}
            onCustomDataChange={handlers.onMaterialCustomDataChange}
            onMaterialSelect={handlers.onMaterialSelect}
            onMaterialApply={handlers.onMaterialApply}
          />
        ) : currentTab === 'geometry' ? (
          <GeometryPanel
            geometryState={geometryState}
            onInfoChange={handlers.onGeometryInfoChange}
            onMorphSettingsChange={handlers.onGeometryMorphSettingsChange}
            onOperationsChange={handlers.onGeometryOperationsChange}
            onShowVertexNormals={handlers.onShowVertexNormals}
            onComputeVertexNormals={handlers.onComputeVertexNormals}
            onCenter={handlers.onCenter}
            onRefreshBounds={handlers.onRefreshBounds}
            onCustomDataChange={handlers.onGeometryCustomDataChange}
          />
        ) : (
          <>
            <div className="right-sidebar__content-header">
              <h3>{TAB_TITLE_MAP[currentTab]}</h3>
            </div>
            <div className="right-sidebar__content-body">
              <div className="right-sidebar__empty-state">
                <div className="empty-icon">{EMPTY_STATE_ICONS[currentTab]}</div>
                <div className="empty-text">{TAB_TITLE_MAP[currentTab]}面板开发中...</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebarContent; 