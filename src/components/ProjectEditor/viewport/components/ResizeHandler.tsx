/**
 * 窗口大小变化处理组件
 * 监听窗口大小变化，自动更新相机宽高比和渲染器尺寸
 * 优化版本：实时同步面板动画，减少闪烁，同步Redux状态
 * @author Cerror
 * @since 2025-08-22
 */

import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useAppDispatch } from '@/store';
import { setPerspectiveConfig } from '@/store/slices/cameraSlice';

const ResizeHandler: React.FC = () => {
  const { camera, gl } = useThree();
  const dispatch = useAppDispatch();
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const updateSceneSize = (width: number, height: number) => {
      // 检查尺寸是否真的发生了变化
      const lastSize = lastSizeRef.current;
      if (
        Math.abs(width - lastSize.width) < 1 &&
        Math.abs(height - lastSize.height) < 1
      ) {
        return; // 尺寸变化太小，忽略
      }

      // 更新记录的尺寸
      lastSizeRef.current = { width, height };

      // 批量更新，避免多次渲染
      requestAnimationFrame(() => {
        // 更新渲染器尺寸
        gl.setSize(width, height, false); // false参数避免更新CSS样式

        // 更新相机宽高比
        if (camera.type === 'PerspectiveCamera') {
          const perspectiveCamera = camera as any;
          const newAspect = width / height;
          perspectiveCamera.aspect = newAspect;
          perspectiveCamera.updateProjectionMatrix();
          
          // 同步更新Redux中的相机配置
          dispatch(setPerspectiveConfig({ aspect: newAspect }));
        }

        if (camera.type === 'OrthographicCamera') {
          const orthographicCamera = camera as any;
          const aspect = width / height;
          orthographicCamera.left = -10 * aspect;
          orthographicCamera.right = 10 * aspect;
          orthographicCamera.top = 10;
          orthographicCamera.bottom = -10;
          orthographicCamera.updateProjectionMatrix();
        }

        console.log(
          `[ResizeHandler] 场景尺寸更新: ${width.toFixed(0)}x${height.toFixed(0)}, 宽高比: ${(width / height).toFixed(2)}`
        );
      });
    };

    const startContinuousUpdate = () => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      const continuousUpdate = () => {
        if (!isAnimatingRef.current) return;

        const canvas = gl.domElement;
        const container = canvas.parentElement;

        if (container) {
          const rect = container.getBoundingClientRect();
          const { width, height } = rect;

          // 检查尺寸是否还在变化
          const lastSize = lastSizeRef.current;
          const sizeChange =
            Math.abs(width - lastSize.width) +
            Math.abs(height - lastSize.height);

          if (sizeChange > 1) {
            // 尺寸还在变化，继续更新
            updateSceneSize(width, height);
            animationFrameRef.current = requestAnimationFrame(continuousUpdate);
          } else {
            // 尺寸稳定，停止连续更新
            isAnimatingRef.current = false;
            console.log('[ResizeHandler] 面板动画完成，停止连续更新');
          }
        }
      };

      console.log('[ResizeHandler] 检测到面板动画，开始连续更新');
      animationFrameRef.current = requestAnimationFrame(continuousUpdate);
    };

    const debouncedResize = (
      width: number,
      height: number,
      immediate = false
    ) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      if (immediate) {
        // 立即更新，并启动连续更新模式
        updateSceneSize(width, height);
        startContinuousUpdate();
      } else {
        // 防抖更新，用于一般情况
        resizeTimeoutRef.current = setTimeout(() => {
          updateSceneSize(width, height);
        }, 16);
      }
    };

    // 监听容器大小变化（使用ResizeObserver）
    const canvas = gl.domElement;
    const container = canvas.parentElement;
    let resizeObserver: ResizeObserver | null = null;

    if (container && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;

          // 检测是否是快速连续的尺寸变化（可能是面板动画）
          const lastSize = lastSizeRef.current;
          const sizeChange =
            Math.abs(width - lastSize.width) +
            Math.abs(height - lastSize.height);
          const isLargeChange = sizeChange > 50; // 大于50像素的变化认为是面板操作

          if (isLargeChange) {
            // 面板动画期间使用立即更新，实现实时同步
            debouncedResize(width, height, true);
          } else {
            // 小幅度变化使用防抖更新
            debouncedResize(width, height, false);
          }
        }
      });

      resizeObserver.observe(container);
    }

    // 窗口resize的备用监听（防抖处理）
    const handleWindowResize = () => {
      if (container) {
        const rect = container.getBoundingClientRect();
        debouncedResize(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleWindowResize);

    // 初始化时执行一次（延迟执行，确保DOM已渲染）
    setTimeout(() => {
      if (container) {
        const rect = container.getBoundingClientRect();
        updateSceneSize(rect.width, rect.height);
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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, [camera, gl, dispatch]);

  return null;
};

export default ResizeHandler;