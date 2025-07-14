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
  
  // 从Redux获取状态
  const { 
    canvasSettings, 
    currentView, 
    selectedNodeId, 
    cameraPosition,
    cameraConfig 
  } = useAppSelector(state => state.scene);

  // 处理视图切换
  const handleViewChange = useCallback((view: ViewType) => {
    dispatch(setCurrentView(view));
    dispatch(addRecord({
      actionType: 'modify',
      targetType: 'camera',
      targetName: '相机视图',
      description: `切换到${view}视图`,
    }));
  }, [dispatch]);

  // 处理视图重置
  const handleViewReset = useCallback(() => {
    dispatch(updateCameraPosition([6, 4, 6]));
    dispatch(addRecord({
      actionType: 'modify',
      targetType: 'camera',
      targetName: '相机位置',
      description: '重置相机视图',
    }));
  }, [dispatch]);

  // 处理缩放到全部
  const handleZoomExtents = useCallback(() => {
    dispatch(addRecord({
      actionType: 'modify',
      targetType: 'camera',
      targetName: '相机视图',
      description: '缩放到适合窗口',
    }));
  }, [dispatch]);

  // 处理网格切换
  const handleToggleGrid = useCallback(() => {
    dispatch(updateCanvasSettings({ 
      gridVisible: !canvasSettings.gridVisible 
    }));
    dispatch(addRecord({
      actionType: 'modify',
      targetType: 'scene',
      targetName: '网格显示',
      description: `${canvasSettings.gridVisible ? '隐藏' : '显示'}网格`,
    }));
  }, [dispatch, canvasSettings.gridVisible]);

  // 计算相机配置
  const cameraProps = {
    position: cameraPosition,
    fov: cameraConfig.type === 'perspective' ? cameraConfig.perspective.fov : 75,
    near: cameraConfig.type === 'perspective' 
      ? cameraConfig.perspective.near 
      : cameraConfig.orthographic.near,
    far: cameraConfig.type === 'perspective' 
      ? cameraConfig.perspective.far 
      : cameraConfig.orthographic.far,
    aspect: cameraConfig.type === 'perspective' ? cameraConfig.perspective.aspect : 1,
  };

  // 如果是正交相机，还需要额外的参数
  const orthographicProps = cameraConfig.type === 'orthographic' ? {
    left: cameraConfig.orthographic.left,
    right: cameraConfig.orthographic.right,
    top: cameraConfig.orthographic.top,
    bottom: cameraConfig.orthographic.bottom,
    zoom: cameraConfig.orthographic.zoom,
  } : {};

  return (
    <div className={`canvas-3d ${className || ''}`} style={{ width, height }}>
      {/* R3F Canvas - 纯3D渲染容器 */}
      <Canvas 
        ref={canvasRef}
        camera={{ 
          ...cameraProps,
          ...orthographicProps
        }}
        orthographic={cameraConfig.type === 'orthographic'}
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
        <span>相机: {cameraConfig.type === 'perspective' ? '透视' : '正交'}</span>
        <span>Near: {cameraProps.near}</span>
        <span>Far: {cameraProps.far}</span>
        {selectedNodeId && <span>选中: {selectedNodeId}</span>}
      </div>
    </div>
  );
};

export default Canvas3D; 