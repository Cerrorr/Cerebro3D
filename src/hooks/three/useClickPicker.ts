/**
 * useClickPicker Hook
 * 提供3D场景中模型点击拾取功能
 * @author Cerror
 * @since 2025-07-11
 */

import { useState, useCallback } from 'react';
import type {
  UseClickPickerOptions,
  UseClickPickerResult,
  PickedObject
} from './types/useClickPicker.types';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import { devLog } from '@/utils/devLog';

/**
 * 点击拾取Hook实现
 * 使用React Three Fiber的原生事件系统
 */
export const useClickPicker = (
  sceneNodes: SceneNode[],
  options: UseClickPickerOptions = {}
): UseClickPickerResult => {
  const {
    enabled = true,
    granularity = 'both', // 默认同时提供模型和mesh信息
    onObjectPicked,
    onEmptySpacePicked,
    debug = false
  } = options;

  const [pickedObject, setPickedObject] = useState<PickedObject | null>(null);

  /**
   * 查找场景节点
   * 根据对象ID查找对应的场景节点
   */
  const findSceneNode = useCallback((objectId: string): SceneNode | null => {
    const searchNodes = (nodes: SceneNode[]): SceneNode | null => {
      for (const node of nodes) {
        if (node.objectId === objectId || node.id === objectId) {
          return node;
        }
        if (node.children) {
          const found = searchNodes(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return searchNodes(sceneNodes);
  }, [sceneNodes]);

  /**
   * 创建对象点击处理器
   * 返回可以直接绑定到R3F对象上的点击事件处理器
   */
  const createObjectClickHandler = useCallback((objectId: string) => {
    return (event: any) => {
      if (!enabled) return;
      
      // 阻止事件冒泡，避免触发空白区域点击
      event.stopPropagation();
      
      debug && devLog.log('🖱️ R3F对象点击:', objectId, event);
      
      const sceneNode = findSceneNode(objectId);
      if (!sceneNode) {
        debug && devLog.log('⚠️ 未找到对应的场景节点:', objectId);
        return;
      }

      // 获取具体被点击的mesh和根对象
      const hitMesh = event.object; // 具体被点击的mesh
      const rootObject = event.eventObject; // 绑定事件的根对象
      const intersectionPoint = event.point; // 3D交点
      const faceIndex = event.faceIndex; // 三角面索引
      const instanceId = event.instanceId; // 实例ID（如果是InstancedMesh）

      // 根据拾取粒度决定主要拾取对象
      let primaryObject: any;
      let objectName: string;
      let objectDescription: string;

      if (granularity === 'object') {
        // 全选模式：拾取整个模型
        primaryObject = rootObject || hitMesh;
        objectName = sceneNode.name || objectId;
        objectDescription = `模型: ${objectName}`;
      } else if (granularity === 'mesh') {
        // 部分选择模式：拾取具体的mesh
        primaryObject = hitMesh;
        objectName = hitMesh?.name || `${sceneNode.name || objectId}_mesh`;
        objectDescription = `Mesh: ${hitMesh?.name || 'unnamed'} (来自模型: ${sceneNode.name || objectId})`;
      } else {
        // both模式：同时提供两者信息，默认为整个对象
        primaryObject = rootObject || hitMesh;
        objectName = sceneNode.name || objectId;
        objectDescription = `模型: ${objectName} (点击了Mesh: ${hitMesh?.name || 'unnamed'})`;
      }

      const pickedObj: PickedObject = {
        id: objectId,
        object3D: primaryObject,
        node: sceneNode,
        pickedAt: Date.now(),
        hitMesh: hitMesh, // 始终保留具体被点击的mesh信息
        hitPoint: intersectionPoint ? { x: intersectionPoint.x, y: intersectionPoint.y } : { x: 0, y: 0 },
        intersection: {
          ...event,
          // 添加更多调试信息
          meshName: hitMesh?.name || 'unnamed',
          meshType: hitMesh?.type || 'unknown',
          materialName: hitMesh?.material?.name || 'unnamed material',
          faceIndex,
          instanceId,
          distance: event.distance,
          granularity,
          objectDescription
        }
      };
      
      setPickedObject(pickedObj);
      onObjectPicked?.(pickedObj);
      
      debug && devLog.log('✅ 拾取详情:', {
        objectId,
        nodeName: sceneNode.name,
        hitMeshName: hitMesh?.name,
        hitMeshType: hitMesh?.type,
        rootObjectName: rootObject?.name,
        intersectionPoint,
        faceIndex,
        instanceId,
        distance: event.distance,
        material: hitMesh?.material?.name || 'unknown'
      });
    };
  }, [enabled, findSceneNode, onObjectPicked, debug, granularity]);

  /**
   * 处理空白区域点击
   * 用于绑定到Canvas或背景对象上
   */
  const handleEmptySpaceClick = useCallback((event: any) => {
    if (!enabled) return;
    
    debug && devLog.log('🔘 点击空白区域');
    
    setPickedObject(null);
    onEmptySpacePicked?.();
  }, [enabled, onEmptySpacePicked, debug]);

  /**
   * 清空拾取
   * 清除当前拾取的对象
   */
  const clearPicked = useCallback(() => {
    setPickedObject(null);
    debug && devLog.log('🔄 清空拾取');
  }, [debug]);

  /**
   * 检查对象是否被拾取
   * 判断指定ID的对象是否为当前拾取的对象
   */
  const isPicked = useCallback((objectId: string): boolean => {
    return pickedObject?.id === objectId;
  }, [pickedObject]);

  return {
    pickedObject,
    handleClick: handleEmptySpaceClick, // 兼容旧接口
    createObjectClickHandler,
    handleEmptySpaceClick,
    clearPicked,
    isPicked
  };
}; 