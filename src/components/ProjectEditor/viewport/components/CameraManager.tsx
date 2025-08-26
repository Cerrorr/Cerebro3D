/**
 * 相机管理组件 - 使用useCameraControl Hook
 * @author Cerror
 * @since 2025-08-22
 */

import React, { useEffect, useImperativeHandle } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3, PerspectiveCamera, OrthographicCamera } from 'three';
import { useCameraControl } from '@/hooks/three';
import type { CameraControlRef } from '../types/viewportScene.types';
import type { ViewType } from '../types/Canvas3D.types';
import type { CameraConfiguration } from '@/components/projectEditor/rightPanels/types/CameraConfig.types';

export interface CameraManagerProps {
  cameraControlRef?: React.MutableRefObject<CameraControlRef | null>;
  onViewChange?: React.Dispatch<React.SetStateAction<ViewType>>;
  cameraConfig?: CameraConfiguration;
}

const CameraManager: React.FC<CameraManagerProps> = ({ 
  cameraControlRef, 
  onViewChange,
  cameraConfig
}) => {
  const { camera, gl, size, scene, set } = useThree();
  
  const { resetCamera, setView, zoomToFitAll, getCurrentView, setPosition, setTarget } =
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

  // 切换相机类型
  useEffect(() => {
    if (cameraConfig) {
      let newCamera: PerspectiveCamera | OrthographicCamera;
      
      if (cameraConfig.type === 'orthographic') {
        // 创建正交相机
        const aspect = size.width / size.height;
        const frustumSize = 10;
        newCamera = new OrthographicCamera(
          -frustumSize * aspect / 2,
          frustumSize * aspect / 2,
          frustumSize / 2,
          -frustumSize / 2,
          cameraConfig.orthographic.near,
          cameraConfig.orthographic.far
        );
        
        // 应用正交相机的特定参数
        const orthoCamera = newCamera as OrthographicCamera;
        orthoCamera.zoom = cameraConfig.orthographic.zoom;
      } else {
        // 创建透视相机
        newCamera = new PerspectiveCamera(
          cameraConfig.perspective.fov,
          size.width / size.height,
          cameraConfig.perspective.near,
          cameraConfig.perspective.far
        );
      }
      
      // 复制当前相机的位置
      newCamera.position.set(
        cameraConfig.transform.position.x,
        cameraConfig.transform.position.y,
        cameraConfig.transform.position.z
      );
      
      // 让相机看向目标点
      newCamera.lookAt(
        cameraConfig.transform.target.x,
        cameraConfig.transform.target.y,
        cameraConfig.transform.target.z
      );
      
      newCamera.updateProjectionMatrix();
      
      // 如果相机类型改变了，更新场景中的相机
      if (camera.type !== newCamera.type) {
        set({ camera: newCamera });
      }
    }
  }, [cameraConfig?.type, size, set]);

  // 同步相机配置到场景
  useEffect(() => {
    if (cameraConfig) {
      // 更新相机位置
      const position = new Vector3(
        cameraConfig.transform.position.x,
        cameraConfig.transform.position.y,
        cameraConfig.transform.position.z
      );
      setPosition(position);
      
      // 更新相机目标
      const target = new Vector3(
        cameraConfig.transform.target.x,
        cameraConfig.transform.target.y,
        cameraConfig.transform.target.z
      );
      setTarget(target);
      
      // 更新相机参数
      if (cameraConfig.type === 'perspective' && camera instanceof PerspectiveCamera) {
        camera.fov = cameraConfig.perspective.fov;
        camera.aspect = cameraConfig.perspective.aspect;
        camera.near = cameraConfig.perspective.near;
        camera.far = cameraConfig.perspective.far;
        camera.updateProjectionMatrix();
      } else if (cameraConfig.type === 'orthographic' && camera instanceof OrthographicCamera) {
        // 正交相机参数
        const aspect = size.width / size.height;
        const frustumSize = 10; // 基础视锥大小
        
        // 使用配置的边界值或根据 frustumSize 和 aspect 计算
        camera.left = cameraConfig.orthographic.left !== undefined ? 
          cameraConfig.orthographic.left : -frustumSize * aspect / 2;
        camera.right = cameraConfig.orthographic.right !== undefined ? 
          cameraConfig.orthographic.right : frustumSize * aspect / 2;
        camera.top = cameraConfig.orthographic.top !== undefined ? 
          cameraConfig.orthographic.top : frustumSize / 2;
        camera.bottom = cameraConfig.orthographic.bottom !== undefined ? 
          cameraConfig.orthographic.bottom : -frustumSize / 2;
        camera.near = cameraConfig.orthographic.near;
        camera.far = cameraConfig.orthographic.far;
        camera.zoom = cameraConfig.orthographic.zoom;
        camera.updateProjectionMatrix();
      }
    }
  }, [cameraConfig, camera, setPosition, setTarget, size]);

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