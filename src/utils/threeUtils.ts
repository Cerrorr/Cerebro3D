/**
 * Three.js 相关工具函数
 * 提供3D模型处理、场景树解析等功能
 * @author Cerror
 * @since 2025-07-08
 */

import { Object3D } from 'three';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';

/**
 * 提取3D模型的内部结构树
 * 递归解析Three.js Object3D对象，生成场景树节点
 * @param object Three.js对象
 * @param baseName 基础名称
 * @returns 场景节点数组
 */
export const extractModelStructure = (object: Object3D, baseName: string): SceneNode[] => {
  const children: SceneNode[] = [];
  
  // 遍历模型的子对象
  if (object.children && object.children.length > 0) {
    object.children.forEach((child: any, index: number) => {
      let nodeType: SceneNode['type'] = 'mesh';
      let nodeName = child.name || `${baseName}_${index}`;
      
      // 根据Three.js对象类型确定节点类型
      if (child.isMesh) {
        nodeType = 'mesh';
        const meshChildren: SceneNode[] = [];
        
        // 添加几何体信息
        if (child.geometry) {
          meshChildren.push({
            id: `${child.uuid}_geometry`,
            name: `几何体 (${child.geometry.type})`,
            type: 'geometry',
            visible: true,
          });
        }
        
        // 添加材质信息
        if (child.material) {
          const materialName = child.material.name || '材质';
          meshChildren.push({
            id: `${child.uuid}_material`,
            name: materialName,
            type: 'material',
            visible: true,
          });
        }
        
        // 如果有几何体或材质，添加到子节点
        if (meshChildren.length > 0) {
          children.push(...meshChildren);
        }
      } else if (child.isGroup) {
        nodeType = 'folder';
        nodeName = child.name || `组_${index}`;
      } else if (child.isLight) {
        nodeType = 'light';
      } else if (child.isCamera) {
        nodeType = 'camera';
      }

      const childNode: SceneNode = {
        id: child.uuid || `${baseName}_child_${index}`,
        name: nodeName,
        type: nodeType,
        visible: true,
        children: child.children && child.children.length > 0 
          ? extractModelStructure(child, nodeName)
          : undefined
      };

      children.push(childNode);
    });
  }
  
  return children;
};

/**
 * 获取3D对象的基本信息
 * @param object Three.js对象
 * @returns 对象信息
 */
export const getObjectInfo = (object: Object3D) => {
  return {
    name: object.name,
    uuid: object.uuid,
    type: object.type,
    visible: object.visible,
    position: object.position.toArray(),
    rotation: object.rotation.toArray(),
    scale: object.scale.toArray(),
    childrenCount: object.children.length,
  };
};

/**
 * 递归计算3D对象的统计信息
 * @param object Three.js对象
 * @returns 统计信息
 */
export const calculateObjectStats = (object: Object3D) => {
  let meshCount = 0;
  let geometryCount = 0;
  let materialCount = 0;
  let lightCount = 0;
  let cameraCount = 0;

  const traverse = (obj: any) => {
    if (obj.isMesh) {
      meshCount++;
      if (obj.geometry) geometryCount++;
      if (obj.material) materialCount++;
    } else if (obj.isLight) {
      lightCount++;
    } else if (obj.isCamera) {
      cameraCount++;
    }

    if (obj.children) {
      obj.children.forEach(traverse);
    }
  };

  traverse(object);

  return {
    meshCount,
    geometryCount,
    materialCount,
    lightCount,
    cameraCount,
    totalObjects: meshCount + lightCount + cameraCount,
  };
};