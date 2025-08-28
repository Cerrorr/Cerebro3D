/**
 * 窗口大小变化处理组件
 * 监听窗口大小变化，自动更新相机宽高比和渲染器尺寸
 * 优化版本：防止面板拖拽时的闪烁，平滑处理尺寸变化
 * @author Cerror
 * @since 2025-08-22
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { useAppDispatch } from '@/store';
import { setPerspectiveConfig } from '@/store/slices/cameraSlice';

const ResizeHandler: React.FC = () => {
  const { camera, gl } = useThree();
  const dispatch = useAppDispatch();
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 优化的尺寸更新函数，减少不必要的操作
  const updateSceneSize = useCallback((width: number, height: number, skipReduxUpdate = false) => {
    // 检查尺寸是否真的发生了变化（提高阈值以减少微小变化的影响）
    const lastSize = lastSizeRef.current;
    const widthDiff = Math.abs(width - lastSize.width);
    const heightDiff = Math.abs(height - lastSize.height);
    
    if (widthDiff < 2 && heightDiff < 2) {
      return; // 尺寸变化太小，忽略
    }

    // 更新记录的尺寸
    lastSizeRef.current = { width, height };

    // 批量更新，避免多次渲染
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      // 更新渲染器尺寸（避免更新CSS样式以减少重排）
      gl.setSize(width, height, false);

      // 更新相机配置
      if (camera.type === 'PerspectiveCamera') {
        const perspectiveCamera = camera as any;
        const newAspect = width / height;
        
        // 只有宽高比变化超过一定阈值才更新
        if (Math.abs(perspectiveCamera.aspect - newAspect) > 0.01) {
          perspectiveCamera.aspect = newAspect;
          perspectiveCamera.updateProjectionMatrix();
          
          // 在拖拽过程中跳过Redux更新以减少状态变化
          if (!skipReduxUpdate && !isDraggingRef.current) {
            dispatch(setPerspectiveConfig({ aspect: newAspect }));
          }
        }
      }

      if (camera.type === 'OrthographicCamera') {
        const orthographicCamera = camera as any;
        const aspect = width / height;
        const currentAspect = (orthographicCamera.right - orthographicCamera.left) / 
                             (orthographicCamera.top - orthographicCamera.bottom);
        
        // 只有宽高比变化超过阈值才更新
        if (Math.abs(currentAspect - aspect) > 0.01) {
          orthographicCamera.left = -10 * aspect;
          orthographicCamera.right = 10 * aspect;
          orthographicCamera.top = 10;
          orthographicCamera.bottom = -10;
          orthographicCamera.updateProjectionMatrix();
        }
      }

      rafIdRef.current = null;
    });
  }, [camera, gl, dispatch]);

  // 防抖处理函数，区分拖拽和普通resize
  const debouncedResize = useCallback((width: number, height: number) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // 检测是否为快速连续变化（可能是拖拽）
    const lastSize = lastSizeRef.current;
    const totalChange = Math.abs(width - lastSize.width) + Math.abs(height - lastSize.height);
    
    if (totalChange > 30) {
      // 大幅度变化，可能是面板拖拽
      isDraggingRef.current = true;
      
      // 清除之前的拖拽结束定时器
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      
      // 在拖拽时使用较长的防抖延迟，减少更新频率
      resizeTimeoutRef.current = setTimeout(() => {
        updateSceneSize(width, height, true); // 拖拽时跳过Redux更新
      }, 50); // 增加延迟以减少拖拽时的更新频率
      
      // 设置拖拽结束检测
      dragTimeoutRef.current = setTimeout(() => {
        isDraggingRef.current = false;
        // 拖拽结束后更新一次Redux状态
        const canvas = gl.domElement;
        const container = canvas.parentElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          updateSceneSize(rect.width, rect.height, false);
        }
      }, 200); // 200ms内没有新的拖拽事件则认为拖拽结束
      
    } else {
      // 小幅度变化，正常处理
      resizeTimeoutRef.current = setTimeout(() => {
        updateSceneSize(width, height, false);
      }, 16);
    }
  }, [updateSceneSize, gl]);

  useEffect(() => {
    // 监听容器大小变化（使用ResizeObserver）
    const canvas = gl.domElement;
    const container = canvas.parentElement;
    let resizeObserver: ResizeObserver | null = null;

    if (container && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          // 直接使用优化的防抖处理
          debouncedResize(width, height);
        }
      });

      resizeObserver.observe(container);
    }

    // 窗口resize的备用监听
    const handleWindowResize = () => {
      if (container) {
        const rect = container.getBoundingClientRect();
        debouncedResize(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleWindowResize);

    // 初始化时执行一次
    setTimeout(() => {
      if (container) {
        const rect = container.getBoundingClientRect();
        updateSceneSize(rect.width, rect.height, false);
      }
    }, 100);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [camera, gl, dispatch, updateSceneSize, debouncedResize]);

  return null;
};

export default ResizeHandler;