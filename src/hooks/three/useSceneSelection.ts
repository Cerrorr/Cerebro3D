/**
 * 场景选择管理Hook
 * 处理3D场景中的对象选择、高亮和相关的交互逻辑
 * @author Cerror
 * @since 2025-08-22
 */

import { useState, useEffect, useCallback } from 'react';
import { Object3D } from 'three';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectNode } from '@/store/slices/sceneSlice';

import type {
  UseSceneSelectionProps,
  UseSceneSelectionReturn
} from './types/useSceneSelection.types';

export const useSceneSelection = ({
  sceneNodes,
  scene3DService,
  selectionState = 'all'
}: UseSceneSelectionProps): UseSceneSelectionReturn => {
  const { selectedNodeId } = useAppSelector(state => state.scene);
  const dispatch = useAppDispatch();
  const [selectedObjects, setSelectedObjects] = useState<Object3D[]>([]);

  // 同步SceneTree选择到3D场景高亮
  useEffect(() => {
    if (selectedNodeId && scene3DService) {
      // 查找选中节点对应的3D对象
      const findObjectByNodeId = (nodeId: string): Object3D | null => {
        const findNode = (nodes: any[], searchNodeId: string): any => {
          for (const n of nodes) {
            if (n.id === searchNodeId) return n;
            if (n.children) {
              const found = findNode(n.children, searchNodeId);
              if (found) return found;
            }
          }
          return null;
        };
        
        // 在所有根节点中查找选中的节点
        let selectedNode = null;
        for (const rootNode of sceneNodes) {
          selectedNode = findNode([rootNode], nodeId);
          if (selectedNode) break;
        }
        
        if (!selectedNode) return null;
        
        // 情况1: 如果选中的是顶级节点（有objectId），返回整个对象
        if (selectedNode.objectId) {
          const obj = scene3DService.getObject(selectedNode.objectId);
          return obj || null;
        }
        
        // 情况2: 如果选中的是有子节点的中间节点（包括mesh类型的中间节点）
        if (selectedNode.children && selectedNode.children.length > 0) {
          const parentNode = findParentWithObjectId(selectedNode.id);
          if (parentNode && parentNode.objectId) {
            const parentObject = scene3DService.getObject(parentNode.objectId);
            if (parentObject) {
              // 在父对象中查找名称匹配的对象
              let foundObject: Object3D | null = null;
              parentObject.traverse((child: Object3D) => {
                if (child.name === selectedNode.name && !foundObject) {
                  foundObject = child;
                }
              });
              return foundObject;
            }
          }
        }
        
        // 情况3: 如果选中的是叶子mesh节点，找到对应的具体mesh
        if (selectedNode.type === 'mesh') {
          const parentNode = findParentWithObjectId(selectedNode.id);
          if (parentNode && parentNode.objectId) {
            const parentObject = scene3DService.getObject(parentNode.objectId);
            if (parentObject) {
              // 在父对象中查找名称匹配的mesh
              let foundMesh: Object3D | null = null;
              parentObject.traverse((child: Object3D) => {
                if (child.name === selectedNode.name && child.type === 'Mesh') {
                  foundMesh = child;
                }
              });
              return foundMesh;
            }
          }
        }
        
        return null;
      };
      
      // 查找包含指定节点的顶级父节点（有objectId的节点）
      const findParentWithObjectId = (targetNodeId: string): any => {
        const searchInNode = (node: any): any => {
          // 如果当前节点有objectId，检查是否包含目标节点
          if (node.objectId) {
            const containsTarget = (n: any): boolean => {
              if (n.id === targetNodeId) return true;
              if (n.children) {
                return n.children.some((child: any) => containsTarget(child));
              }
              return false;
            };
            
            if (containsTarget(node)) return node;
          }
          
          // 递归搜索子节点
          if (node.children) {
            for (const child of node.children) {
              const found = searchInNode(child);
              if (found) return found;
            }
          }
          return null;
        };
        
        for (const rootNode of sceneNodes) {
          const found = searchInNode(rootNode);
          if (found) return found;
        }
        return null;
      };
      
      const selectedObject = findObjectByNodeId(selectedNodeId);
      if (selectedObject) {
        setSelectedObjects([selectedObject]);
      } else {
        setSelectedObjects([]);
      }
    } else {
      // 如果没有选中节点，清空高亮
      setSelectedObjects([]);
    }
  }, [selectedNodeId, sceneNodes, scene3DService]);

  // 根据3D对象ID查找对应的节点ID（反向查找）
  const findNodeIdByObjectId = useCallback((nodes: any[], objectId: string): string | null => {
    const searchNodes = (nodeList: any[]): string | null => {
      for (const node of nodeList) {
        if (node.objectId === objectId) {
          return node.id;
        }
        if (node.children) {
          const found = searchNodes(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return searchNodes(nodes);
  }, []);

  // 根据mesh对象查找对应的mesh节点ID
  const findMeshNodeId = useCallback((nodes: any[], meshObject: any): string | null => {
    const searchInNodes = (nodeList: any[]): string | null => {
      for (const node of nodeList) {
        // 如果是mesh节点且名称匹配
        if (node.type === 'mesh' && node.name === meshObject.name) {
          return node.id;
        }
        // 递归搜索子节点
        if (node.children) {
          const found = searchInNodes(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return searchInNodes(nodes);
  }, []);

  // 处理对象被点击
  const handleObjectPicked = useCallback((pickedObject: any) => {
    // 反向同步：点击3D对象时选中对应的树节点
    let nodeId: string | null = null;
    
    if (selectionState === 'partial' && pickedObject.hitMesh) {
      // 部分选中模式：尝试找到具体mesh对应的节点
      nodeId = findMeshNodeId(sceneNodes, pickedObject.hitMesh);
    }
    
    // 如果没找到mesh节点或者是全选模式，查找顶级节点
    if (!nodeId) {
      nodeId = findNodeIdByObjectId(sceneNodes, pickedObject.id);
    }
    
    if (nodeId) {
      // 如果点击的是已经选中的节点，则取消选择
      if (selectedNodeId === nodeId) {
        dispatch(selectNode(null));
      } else {
        dispatch(selectNode(nodeId));
      }
    }
  }, [selectedNodeId, sceneNodes, selectionState, findMeshNodeId, findNodeIdByObjectId, dispatch]);

  // 处理空白处被点击
  const handleEmptySpacePicked = useCallback(() => {
    // 清空树节点选择
    dispatch(selectNode(null));
    
    // 清空3D对象选择
    setSelectedObjects([]);
  }, [dispatch]);

  return {
    selectedObjects,
    handleObjectPicked,
    handleEmptySpacePicked,
    findNodeIdByObjectId,
    findMeshNodeId,
  };
};