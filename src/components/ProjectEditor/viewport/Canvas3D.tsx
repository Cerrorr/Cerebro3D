/**
 * @author Claude
 * @createTime 2025-07-15
 * @description Canvas3D组件 - 3D视口容器组件
 */

import React, { useState } from 'react';
import ViewportScene from './ViewportScene';
import CanvasControls from './CanvasControls';
import type {
  Canvas3DProps,
  ViewType,
  CanvasSettings,
} from './types/Canvas3D.types';
import './styles/Canvas3D.scss';
import { Tooltip } from 'antd';

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

  // 画布设置状态
  const [settings, setSettings] = useState<CanvasSettings>({
    gridVisible: enableGrid,
    axisVisible: false,
    backgroundColor: backgroundColor,
    cameraPosition: [10, 10, 10],
  });

  // 视图重置处理
  const handleViewReset = () => {
    // TODO: 实现视图重置逻辑
    console.log('重置视图');
  };

  // 缩放到全部处理
  const handleZoomExtents = () => {
    // TODO: 实现缩放到全部逻辑
    console.log('缩放到全部');
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
    setCurrentView(view);
    // TODO: 实现视图切换逻辑
    console.log('切换视图:', view);
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
        onViewReset={handleViewReset}
        onZoomExtents={handleZoomExtents}
        onToggleGrid={handleToggleGrid}
        onViewChange={handleViewChange}
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
      />
      {/* 渲染信息 - 右下角 */}
      <div className="render-info">
        <Tooltip title="实时渲染性能统计" placement="left">
          <div className="render-stats">
            <span>渲染时间: 16ms</span>
            <span>物体: 3</span>
            <span>顶点: 8</span>
            <span>三角面: 12</span>
            <span>
              视图: {viewOptions.find(v => v.value === currentView)?.label}
            </span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default Canvas3D;
