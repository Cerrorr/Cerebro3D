import React, { useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Canvas3DProps, ViewType } from './types';
import ViewportScene from './ViewportScene';
import CanvasControls from './CanvasControls';
import './styles/Canvas3D.scss';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  setCurrentView, 
  updateCanvasSettings,
  updateCameraPosition 
} from '@/store/slices/sceneSlice';
import { addRecord } from '@/store/slices/historySlice';

/**
 * Canvas3D组件 (重构版)
 * 纯3D画布容器组件，业务逻辑通过Redux管理，3D逻辑委托给专门的Hook
 * @author Cerror
 * @since 2025-07-11
 * @param width 宽度
 * @param height 高度  
 * @param className CSS类名
 */
const Canvas3D: React.FC<Canvas3DProps> = ({
  width = '100%',
  height = '100%',
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  
  // 从Redux获取状态，而不是通过props
  const { 
    canvasSettings,
    currentView,
    selectedNodeId,
    cameraPosition 
  } = useAppSelector(state => state.scene);

  /* ---------- 交互回调（通过Redux管理状态） ---------- */
  const handleViewReset = useCallback(() => {
    dispatch(setCurrentView('perspective'));
    dispatch(updateCameraPosition([6, 4, 6]));
    dispatch(addRecord({
      actionType: 'camera',
      targetType: 'scene',
      targetName: 'Canvas',
      description: '重置视角',
    }));
  }, [dispatch]);

  const handleZoomExtents = useCallback(() => {
    // 缩放到适合视图的逻辑可以委托给3D服务
    dispatch(addRecord({
      actionType: 'camera',
      targetType: 'scene',
      targetName: 'Canvas',
      description: '缩放到全景',
    }));
  }, [dispatch]);

  const handleToggleGrid = useCallback(() => {
    dispatch(updateCanvasSettings({ 
      gridVisible: !canvasSettings.gridVisible 
    }));
    dispatch(addRecord({
      actionType: 'scene',
      targetType: 'scene',
      targetName: 'Grid',
      description: canvasSettings.gridVisible ? '隐藏网格' : '显示网格',
    }));
  }, [dispatch, canvasSettings.gridVisible]);

  const handleViewChange = useCallback((view: ViewType) => {
    dispatch(setCurrentView(view));
    dispatch(addRecord({
      actionType: 'camera',
      targetType: 'scene',
      targetName: 'Canvas',
      description: `切换视图: ${view}`,
    }));
  }, [dispatch]);

  // 初始化3D场景服务（如果需要）
  useEffect(() => {
    if (canvasRef.current) {
      // 这里可以初始化Scene3DService，但现在主要通过R3F管理
      console.log('Canvas3D mounted, container:', canvasRef.current);
    }
  }, []);

  return (
    <div className={`canvas-3d ${className || ''}`} style={{ width, height }}>
      {/* R3F Canvas - 纯3D渲染容器 */}
      <Canvas 
        ref={canvasRef}
        camera={{ 
          position: cameraPosition, 
          fov: 60 
        }}
      >
        {/* 3D场景渲染，所有3D逻辑都在ViewportScene和R3F Hook中 */}
        <ViewportScene 
          settings={canvasSettings} 
          sceneNodes={[]} // ViewportScene现在从Redux获取节点数据
        />
        <OrbitControls makeDefault />
      </Canvas>

      {/* 控制面板 - 纯UI组件 */}
      <CanvasControls
        currentView={currentView}
        settings={canvasSettings}
        onViewReset={handleViewReset}
        onZoomExtents={handleZoomExtents}
        onToggleGrid={handleToggleGrid}
        onViewChange={handleViewChange}
      />

      {/* 渲染信息 */}
      <div className="render-info">
        <span>视图: {currentView}</span>
        {selectedNodeId && <span>选中: {selectedNodeId}</span>}
      </div>
    </div>
  );
};

export default Canvas3D; 