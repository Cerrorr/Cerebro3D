import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Canvas3DProps, ViewType } from './types';
import ViewportScene from './ViewportScene';
import CanvasControls from './CanvasControls';
import './styles/Canvas3D.scss';

const Canvas3D: React.FC<Canvas3DProps> = ({
  settings,
  onSettingsChange,
  width = '100%',
  height = '100%',
  className
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('perspective');

  /* ---------- 交互回调 ---------- */
  const handleViewReset = useCallback(() => setCurrentView('perspective'), []);
  const handleZoomExtents = useCallback(() => {
    /* TODO: 实现包围盒缩放逻辑 */
  }, []);
  const handleToggleGrid = useCallback(() => {
    onSettingsChange?.({ ...settings, gridVisible: !settings.gridVisible });
  }, [onSettingsChange, settings]);
  const handleViewChange = useCallback((view: ViewType) => setCurrentView(view), []);

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