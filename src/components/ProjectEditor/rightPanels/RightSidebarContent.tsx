import React from 'react';
import { RightSidebarTabType } from './types';
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

interface RightSidebarContentProps {
  currentTab: RightSidebarTabType;
  // 所有面板状态 + 回调函数 (简化为 any，后续可细化)
  panelsProps: Record<string, any>;
}

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
            onChange={handlers.onChange}
          />
        ) : currentTab === 'renderer' ? (
          <RendererConfigPanel
            config={rendererConfig}
            onChange={handlers.onChange}
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
            onInfoChange={handlers.onInfoChange}
            onTransformChange={handlers.onTransformChange}
            onShadowChange={handlers.onShadowChange}
            onVisibilityChange={handlers.onVisibilityChange}
            onRenderOrderChange={handlers.onRenderOrderChange}
            onClippingChange={handlers.onClippingChange}
            onExplodeChange={handlers.onExplodeChange}
            onCustomDataChange={handlers.onCustomDataChange}
          />
        ) : currentTab === 'material' ? (
          <MaterialPanel
            materialState={materialState}
            onInfoChange={handlers.onInfoChange}
            onAppearanceChange={handlers.onAppearanceChange}
            onTextureChange={handlers.onTextureChange}
            onRenderChange={handlers.onRenderChange}
            onCustomDataChange={handlers.onCustomDataChange}
            onMaterialSelect={handlers.onMaterialSelect}
            onMaterialApply={handlers.onMaterialApply}
          />
        ) : currentTab === 'geometry' ? (
          <GeometryPanel
            geometryState={geometryState}
            onInfoChange={handlers.onInfoChange}
            onMorphSettingsChange={handlers.onMorphSettingsChange}
            onOperationsChange={handlers.onOperationsChange}
            onShowVertexNormals={handlers.onShowVertexNormals}
            onComputeVertexNormals={handlers.onComputeVertexNormals}
            onCenter={handlers.onCenter}
            onRefreshBounds={handlers.onRefreshBounds}
            onCustomDataChange={handlers.onCustomDataChange}
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