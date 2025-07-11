/**
 * React Three Fiber 场景 Hook
 * 封装R3F场景管理功能，遵循cursor rules规范
 * @author Cerror
 * @since 2025-07-11
 */

import { useThree } from '@react-three/fiber';
import { useCallback, useMemo } from 'react';
import { Color } from 'three';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateCanvasSettings } from '@/store/slices/sceneSlice';
import type { UseSceneResult } from './types';

/**
 * 基于React Three Fiber的场景管理Hook
 * 专门处理R3F场景对象的管理和配置
 */
export const useScene = (): UseSceneResult => {
  const { scene } = useThree();
  const dispatch = useAppDispatch();
  const { canvasSettings } = useAppSelector(state => state.scene);

  // 更新背景颜色
  const updateBackgroundColor = useCallback((color: string) => {
    scene.background = new Color(color);
    dispatch(updateCanvasSettings({ backgroundColor: color }));
  }, [scene, dispatch]);

  // 重置场景
  const resetScene = useCallback(() => {
    // 清除所有子对象（保留默认的灯光等）
    while (scene.children.length > 0) {
      const child = scene.children[0];
      scene.remove(child);
    }
  }, [scene]);

  // 计算场景信息
  const sceneInfo = useMemo(() => {
    let objectCount = 0;
    let triangleCount = 0;

    scene.traverse((object) => {
      objectCount++;
      if (object.type === 'Mesh') {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) {
          const geometry = mesh.geometry;
          if (geometry.index) {
            triangleCount += geometry.index.count / 3;
          } else if (geometry.attributes.position) {
            triangleCount += geometry.attributes.position.count / 3;
          }
        }
      }
    });

    return { objectCount, triangleCount };
  }, [scene]);

  // 应用背景颜色设置
  useMemo(() => {
    if (canvasSettings.backgroundColor) {
      scene.background = new Color(canvasSettings.backgroundColor);
    }
  }, [scene, canvasSettings.backgroundColor]);

  return {
    scene,
    updateBackgroundColor,
    resetScene,
    sceneInfo,
  };
};