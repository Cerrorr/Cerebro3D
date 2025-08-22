/**
 * 相机管理组件 - 使用useCameraControl Hook
 * @author Cerror
 * @since 2025-08-22
 */

import React, { useEffect, useImperativeHandle } from 'react';
import { useCameraControl } from '@/hooks/three';
import type { CameraControlRef } from '../types/viewportScene.types';
import type { ViewType } from '../types/Canvas3D.types';

export interface CameraManagerProps {
  cameraControlRef?: React.MutableRefObject<CameraControlRef | null>;
  onViewChange?: React.Dispatch<React.SetStateAction<ViewType>>;
}

const CameraManager: React.FC<CameraManagerProps> = ({ 
  cameraControlRef, 
  onViewChange 
}) => {
  const { resetCamera, setView, zoomToFitAll, getCurrentView } =
    useCameraControl({
      autoRotate: false,
      enableZoom: true,
      enablePan: true,
      animationDuration: 800,
    });

  // 暴露相机控制方法给父组件
  useImperativeHandle(
    cameraControlRef,
    () => ({
      resetCamera,
      setView,
      zoomToFitAll,
    }),
    [resetCamera, setView, zoomToFitAll]
  );

  // 监听视图变化，通知父组件
  useEffect(() => {
    const currentView = getCurrentView();
    if (onViewChange && currentView) {
      onViewChange(currentView);
    }
  }, [getCurrentView, onViewChange]);

  // 相机相关的键盘快捷键
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 阻止在输入框中触发快捷键
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'h':
        case 'home':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            resetCamera();
          }
          break;
        case 'f':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            zoomToFitAll();
          }
          break;
        case '1':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('front');
          }
          break;
        case '3':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('right');
          }
          break;
        case '7':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('top');
          }
          break;
        case '0':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('perspective');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resetCamera, zoomToFitAll, setView]);

  return null;
};

export default CameraManager;