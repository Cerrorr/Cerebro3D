/**
 * React Three Fiber 对象渲染 Hook
 * 封装对象渲染功能，遵循cursor rules规范
 * @author Cerror
 * @since 2025-07-11
 */

import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef, useCallback, useMemo } from 'react';
import { Object3D, Vector3 } from 'three';
import { useAppSelector } from '@/store';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import type { UseObjectRenderOptions, UseObjectRenderResult } from './types';

/**
 * 基于React Three Fiber的对象渲染Hook
 * 专门处理对象的渲染和变换
 */
export const useObjectRender = (
  options: UseObjectRenderOptions = {}
): UseObjectRenderResult => {
  const { enableAnimation = false, animationSpeed = 1, highlightSelected = true } = options;
  const objectRef = useRef<Object3D>(null);
  
  const { nodes: sceneNodes, selectedNodeId } = useAppSelector(state => state.scene);

  // 动画帧更新
  useFrame((_, delta) => {
    if (enableAnimation && objectRef.current) {
      objectRef.current.rotation.y += delta * animationSpeed;
    }
  });

  // 更新对象变换
  const updateObjectTransform = useCallback((nodeId: string, transform: { position?: Vector3; rotation?: Vector3; scale?: Vector3 }) => {
    // 这里通过ref或其他方式更新对象变换
    // 在实际应用中，可能需要通过Redux action来更新
    console.log('更新对象变换:', nodeId, transform);
  }, []);

  // 递归渲染场景节点
  const renderableNodes = useMemo(() => {
    const results: JSX.Element[] = [];
    
    const processNode = (node: SceneNode): JSX.Element | null => {
      // 只渲染mesh类型且有importedObject的节点
      if (node.type === 'mesh' && node.importedObject && node.visible !== false) {
        const isSelected = selectedNodeId === node.id;
        
        return React.createElement('primitive', {
          key: node.id,
          ref: isSelected ? objectRef : undefined,
          object: node.importedObject.clone(),
          position: node.position ? [node.position.x, node.position.y, node.position.z] : [0, 0, 0],
          rotation: node.rotation ? [node.rotation.x, node.rotation.y, node.rotation.z] : [0, 0, 0],
          scale: node.scale ? [node.scale.x, node.scale.y, node.scale.z] : [1, 1, 1],
          onClick: (event: any) => {
            event.stopPropagation();
            console.log('选中对象:', node.id);
          }
        });
      }
      
      return null;
    };

    // 递归处理所有节点
    const traverseNodes = (nodes: SceneNode[]) => {
      nodes.forEach(node => {
        const element = processNode(node);
        if (element) {
          results.push(element);
        }
        
        // 递归处理子节点
        if (node.children && node.children.length > 0) {
          traverseNodes(node.children);
        }
      });
    };

    traverseNodes(sceneNodes);
    return results;
  }, [sceneNodes, selectedNodeId, highlightSelected]);

  return {
    objectRef,
    renderableNodes,
    updateObjectTransform,
  };
};