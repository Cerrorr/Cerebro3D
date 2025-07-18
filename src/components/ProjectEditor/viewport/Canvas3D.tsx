/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description Canvas3D组件 - 3D视口容器组件
 */

import React, { useState, useRef } from 'react';
import ViewportScene from './ViewportScene';
import CanvasControls from './CanvasControls';
import RenderStats from './RenderStats';
import type {
  Canvas3DProps,
  ViewType,
  CanvasSettings,
} from './types/Canvas3D.types';
import type { CameraControlRef } from './types/viewportScene.types';
import type { SelectionState } from './types/canvasControls.types';
import './styles/Canvas3D.scss';
import { useRenderStats } from '@/hooks/three/useRenderStats';

/**
 * Canvas3D组件
 * 提供3D视口的容器和基础配置
 */
const Canvas3D: React.FC<Canvas3DProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  backgroundColor = '#2a2a2a',
  enableGrid = true,
  enableStats = false,
  scene3DService,
}) => {
  // 当前视图状态
  const [currentView, setCurrentView] = useState<ViewType>('perspective');
  // 选择状态 - 默认设置为全选
  const [selectionState, setSelectionState] = useState<SelectionState>('all');
  // 渲染性能统计
  const { stats } = useRenderStats(scene3DService);
  // 相机控制引用
  const cameraControlRef = useRef<CameraControlRef | null>(null);

  // 画布设置状态
  const [settings, setSettings] = useState<CanvasSettings>({
    gridVisible: enableGrid,
    axisVisible: false,
    backgroundColor: backgroundColor,
    cameraPosition: [10, 10, 10],
  });

  // 视图重置处理
  const handleViewReset = () => {
    if (cameraControlRef.current) {
      cameraControlRef.current.resetCamera();
      setCurrentView('perspective');
    }
  };

  // 缩放到全部处理
  const handleZoomExtents = () => {
    if (cameraControlRef.current) {
      cameraControlRef.current.zoomToFitAll();
    }
  };

  // 切换网格显示
  const handleToggleGrid = () => {
    setSettings(prev => ({
      ...prev,
      gridVisible: !prev.gridVisible,
    }));
  };

  // 视图切换处理
  const handleViewChange = (view: ViewType) => {
    if (cameraControlRef.current) {
      cameraControlRef.current.setView(view);
      setCurrentView(view);
    }
  };

  // 选择状态切换处理（仅切换状态，不实现具体功能）
  const handleSelectionToggle = () => {
    setSelectionState(prev => prev === 'all' ? 'partial' : 'all');
  };

  const viewOptions = [
    { value: 'perspective', label: '透视视图' },
    { value: 'front', label: '前视图' },
    { value: 'back', label: '后视图' },
    { value: 'left', label: '左视图' },
    { value: 'right', label: '右视图' },
    { value: 'top', label: '顶视图' },
    { value: 'bottom', label: '底视图' },
  ];
  
  return (
    <div
      className={`canvas-3d ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Canvas控制组件 */}
      <CanvasControls
        currentView={currentView}
        settings={settings}
        selectionState={selectionState}
        onViewReset={handleViewReset}
        onZoomExtents={handleZoomExtents}
        onToggleGrid={handleToggleGrid}
        onViewChange={handleViewChange}
        onSelectionToggle={handleSelectionToggle}
      />

      {/* 3D场景视口 */}
      <ViewportScene
        backgroundColor={backgroundColor}
        enableGrid={settings.gridVisible}
        enableStats={enableStats}
        enableFog={false}
        fogNear={10}
        fogFar={100}
        scene3DService={scene3DService}
        cameraControlRef={cameraControlRef}
        onViewChange={setCurrentView}
      />
      {/* 渲染信息 - 右下角 */}
      <RenderStats currentView={currentView} viewOptions={viewOptions} stats={stats} />
    </div>
  );
};

export default Canvas3D;
