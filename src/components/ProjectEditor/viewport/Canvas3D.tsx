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
import type { PickedObject } from '@/hooks/three/types';
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
  // 当前拾取的对象
  const [pickedObject, setPickedObject] = useState<PickedObject | null>(null);
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

  // 处理对象拾取
  const handleObjectPicked = (picked: PickedObject) => {
    setPickedObject(picked);
    if (import.meta.env.DEV) {
      const mode = selectionState === 'all' ? '🔲 全选模式（整个模型）' : '🔳 部分选择模式（具体Mesh）';
      
      console.log('🎯 模型拾取详情:', {
        '当前模式': mode,
        '拾取粒度': picked.intersection?.granularity,
        '拾取描述': picked.intersection?.objectDescription,
        '模型ID': picked.id,
        '模型名称': picked.node.name,
        '被点击的Mesh': {
          名称: picked.hitMesh?.name || 'unnamed',
          类型: picked.hitMesh?.type,
          材质: picked.intersection?.materialName
        },
        '点击位置': picked.hitPoint,
        '3D交点': picked.intersection?.point,
        '三角面索引': picked.intersection?.faceIndex,
        '距离': picked.intersection?.distance?.toFixed(3),
        '时间戳': new Date(picked.pickedAt).toLocaleTimeString()
      });
      
      // 简化控制台输出
      console.log(`📍 ${mode} 拾取: ${picked.intersection?.objectDescription || picked.node.name || picked.id}`);
    }
  };

  // 处理空白区域点击
  const handleEmptySpacePicked = () => {
    setPickedObject(null);
    if (import.meta.env.DEV) {
      console.log('🔘 清空拾取');
    }
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
        onObjectPicked={handleObjectPicked}
        onEmptySpacePicked={handleEmptySpacePicked}
        selectionState={selectionState}
      />
      {/* 渲染信息 - 右下角 */}
      <RenderStats currentView={currentView} viewOptions={viewOptions} stats={stats} />
    </div>
  );
};

export default Canvas3D;
