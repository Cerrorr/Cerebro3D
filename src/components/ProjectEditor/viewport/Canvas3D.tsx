import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Canvas3DProps, ViewType } from './types';
import ViewportScene from './ViewportScene';
import CanvasControls from './CanvasControls';
import './styles/Canvas3D.scss';
import { useHistoryRecorder } from '@/hooks/business/useHistoryRecorder';

/**
 * Canvas3D
 * @param settings 3D场景设置
 * @param onSettingsChange 设置变更回调
 * @param width 宽度
 * @param height 高度
 * @param className CSS类名
 */
const Canvas3D: React.FC<Canvas3DProps> = ({
  settings,
  onSettingsChange,
  width = '100%',
  height = '100%',
  className
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('perspective');

  // history recorder
  const { addHistory } = useHistoryRecorder();

  /* ---------- 交互回调 ---------- */
  const handleViewReset = useCallback(() => {
    setCurrentView('perspective');
    addHistory({
      actionType: 'camera',
      targetType: 'scene',
      targetName: 'Canvas',
      description: '重置视角',
    });
  }, [addHistory]);
  const handleZoomExtents = useCallback(() => {
    addHistory({
      actionType: 'camera',
      targetType: 'scene',
      targetName: 'Canvas',
      description: '缩放到全景',
    });
  }, [addHistory]);
  const handleToggleGrid = useCallback(() => {
    onSettingsChange?.({ ...settings, gridVisible: !settings.gridVisible });
    addHistory({
      actionType: 'scene',
      targetType: 'scene',
      targetName: 'Grid',
      description: settings.gridVisible ? '隐藏网格' : '显示网格',
    });
  }, [onSettingsChange, settings, addHistory]);
  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    addHistory({
      actionType: 'camera',
      targetType: 'scene',
      targetName: 'Canvas',
      description: `切换视图: ${view}`,
    });
  }, [addHistory]);

  return (
    <div className={`canvas-3d ${className || ''}`} style={{ width, height }}>
      {/* R3F Canvas */}
      <Canvas camera={{ position: settings.cameraPosition || [6, 4, 6], fov: 60 }}>
        <ViewportScene settings={settings} />
        <OrbitControls makeDefault />
      </Canvas>

      {/* 控制面板 */}
      <CanvasControls
        currentView={currentView}
        settings={settings}
        onViewReset={handleViewReset}
        onZoomExtents={handleZoomExtents}
        onToggleGrid={handleToggleGrid}
        onViewChange={handleViewChange}
      />

      {/* 渲染信息（占位） */}
      <div className="render-info">
        <span>视图: {currentView}</span>
      </div>
    </div>
  );
};

export default Canvas3D; 