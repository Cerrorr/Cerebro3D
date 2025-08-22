/**
 * 光照设置组件 - 使用useLightingSystem Hook
 * @author Cerror
 * @since 2025-08-22
 */

import React, { useEffect } from 'react';
import { useLightingSystem } from '@/hooks/three';

export interface SceneLightingProps {
  sceneNodes: any[];
}

const SceneLighting: React.FC<SceneLightingProps> = ({ sceneNodes }) => {
  const {
    addAmbientLight,
    addDirectionalLight,
    ambientLight,
    directionalLight,
  } = useLightingSystem({
    enableAmbientLight: true,
    ambientIntensity: 0.6,
    enableDirectionalLight: true,
    directionalIntensity: 1,
    enableShadows: true,
  });

  useEffect(() => {
    // 添加环境光
    addAmbientLight(0.6, '#ffffff');

    // 添加主光源
    import('three').then(({ Vector3 }) => {
      addDirectionalLight(new Vector3(10, 10, 5), 1);
    });
  }, [addAmbientLight, addDirectionalLight]);

  // 控制光源可见性
  useEffect(() => {
    // 递归查找节点
    const findNodeById = (nodes: any[], id: string): any => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    // 检查节点及其所有父节点的可见性
    const isNodeVisible = (nodeToCheck: any, nodes: any[]): boolean => {
      if (nodeToCheck.visible === false) {
        return false;
      }

      // 查找父节点
      const findParent = (targetId: string, searchNodes: any[]): any => {
        for (const searchNode of searchNodes) {
          if (
            searchNode.children?.some((child: any) => child.id === targetId)
          ) {
            return searchNode;
          }
          if (searchNode.children) {
            const found = findParent(targetId, searchNode.children);
            if (found) return found;
          }
        }
        return null;
      };

      const parent = findParent(nodeToCheck.id, nodes);
      if (parent) {
        return isNodeVisible(parent, nodes);
      }

      return true;
    };

    const ambientLightNode = findNodeById(sceneNodes, 'ambient-light');
    const directionalLightNode = findNodeById(sceneNodes, 'directional-light');

    // 控制环境光可见性
    if (ambientLight && ambientLightNode) {
      const shouldBeVisible = isNodeVisible(ambientLightNode, sceneNodes);
      ambientLight.visible = shouldBeVisible;
      // 设置光照强度，隐藏时强度为0
      ambientLight.intensity = shouldBeVisible ? 0.6 : 0;
    }

    // 控制平行光可见性
    if (directionalLight && directionalLightNode) {
      const shouldBeVisible = isNodeVisible(directionalLightNode, sceneNodes);
      directionalLight.visible = shouldBeVisible;
      // 设置光照强度，隐藏时强度为0
      directionalLight.intensity = shouldBeVisible ? 1 : 0;
    }
  }, [sceneNodes, ambientLight, directionalLight]);

  return null;
};

export default SceneLighting;