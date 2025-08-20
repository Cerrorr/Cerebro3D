/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 场景对象渲染组件
 */

import { Fragment, useEffect, useState } from 'react';
import { Object3D } from 'three';
import { useClickPicker } from '@/hooks/three';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import type {
  SceneObjectsProps,
  SceneObjectProps,
} from './types/SceneObjects.types';

/**
 * 场景对象集合组件
 */
const SceneObjects = ({
  nodes,
  scene3DService,
  onObjectPicked,
  onEmptySpacePicked,
  selectionState = 'all',
}: SceneObjectsProps) => {
  // 根据选择状态确定拾取粒度
  const pickingGranularity = selectionState === 'all' ? 'object' : 'mesh';

  // 使用点击拾取Hook
  const { createObjectClickHandler } = useClickPicker(nodes, {
    enabled: true,
    granularity: pickingGranularity,
    debug: import.meta.env.DEV,
    onObjectPicked,
    onEmptySpacePicked,
  });

  const renderNode = (node: SceneNode) => {
    return (
      <Fragment key={node.id}>
        <SceneObject
          node={node}
          scene3DService={scene3DService}
          allNodes={nodes}
          onObjectPicked={onObjectPicked}
          createObjectClickHandler={createObjectClickHandler}
        />
        {node.children?.map(renderNode)}
      </Fragment>
    );
  };

  return (
    <group
      name="scene-objects"
      onClick={event => {
        // 如果点击的是group本身（空白区域），清空选择
        if (event.target === event.currentTarget) {
          onEmptySpacePicked?.();
        }
      }}
    >
      {nodes.map(renderNode)}
    </group>
  );
};

/**
 * 单个场景对象组件
 */
const SceneObject = ({
  node,
  scene3DService,
  allNodes,
  createObjectClickHandler,
}: SceneObjectProps) => {
  const [importedObject, setImportedObject] = useState<Object3D | null>(null);

  // 检查节点及其所有父节点的可见性
  const isNodeVisible = (
    nodeToCheck: SceneNode,
    nodes: SceneNode[]
  ): boolean => {
    // 如果当前节点被隐藏，返回false
    if (nodeToCheck.visible === false) {
      return false;
    }

    // 查找父节点
    const findParent = (
      targetId: string,
      searchNodes: SceneNode[]
    ): SceneNode | null => {
      for (const searchNode of searchNodes) {
        if (searchNode.children?.some(child => child.id === targetId)) {
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
      // 递归检查父节点的可见性
      return isNodeVisible(parent, nodes);
    }

    // 没有父节点，当前节点可见
    return true;
  };

  // 从Scene3DService获取导入的对象
  useEffect(() => {
    if (node.objectId && scene3DService) {
      const object = scene3DService.getObject(node.objectId);
      if (object) {
        setImportedObject(object);
        // 为对象添加用户数据，用于后期处理选择
        object.userData = {
          ...object.userData,
          nodeId: node.id,
          objectId: node.objectId,
          nodeName: node.name,
          nodeType: node.type,
        };
        
        // 递归为所有子对象添加用户数据
        object.traverse((child) => {
          child.userData = {
            ...child.userData,
            parentNodeId: node.id,
            parentObjectId: node.objectId,
            parentNodeName: node.name,
          };
        });
      }
    } else {
      setImportedObject(null);
    }
  }, [node.objectId, node.id, node.name, node.type, scene3DService]);

  // 同步节点变换到Scene3DService
  useEffect(() => {
    if (
      node.objectId &&
      scene3DService &&
      (node.position || node.rotation || node.scale)
    ) {
      scene3DService.updateObjectTransform(node.objectId, {
        position: node.position,
        rotation: node.rotation,
        scale: node.scale,
      });
    }
  }, [node.objectId, node.position, node.rotation, node.scale, scene3DService]);

  // 同步可见性状态到Three.js对象
  useEffect(() => {
    if (importedObject && allNodes) {
      const shouldBeVisible = isNodeVisible(node, allNodes);

      // 如果是根节点（有objectId），控制整个对象的可见性
      if (node.objectId) {
        importedObject.visible = shouldBeVisible;

        // 对于子节点，需要单独控制其可见性
        const updateChildVisibility = (
          parent: Object3D,
          childNode: SceneNode
        ) => {
          const findChildByName = (
            obj: Object3D,
            name: string
          ): Object3D | null => {
            if (obj.name === name) return obj;
            for (const child of obj.children) {
              const found = findChildByName(child, name);
              if (found) return found;
            }
            return null;
          };

          const childObject = findChildByName(parent, childNode.name);
          if (childObject) {
            const childShouldBeVisible = isNodeVisible(childNode, allNodes);
            childObject.visible = childShouldBeVisible;
          }

          // 递归处理子节点的子节点
          if (childNode.children) {
            childNode.children.forEach(grandChild => {
              updateChildVisibility(parent, grandChild);
            });
          }
        };

        // 更新所有子节点的可见性
        if (node.children) {
          node.children.forEach(child => {
            updateChildVisibility(importedObject, child);
          });
        }
      }
    }
  }, [importedObject, node, allNodes]);

  // 只有根节点（有objectId）才渲染primitive对象
  if (!node.objectId) {
    return null;
  }

  // 处理内置对象（相机、光源）的可见性
  if (node.type === 'camera' || node.type === 'light') {
    return null;
  }

  // 简单渲染：只渲染原始模型，不添加额外的选择层
  if (importedObject && createObjectClickHandler) {
    return (
      <primitive
        object={importedObject}
        onClick={createObjectClickHandler(node.objectId)}
        onPointerMissed={undefined}
        userData={{ objectId: node.objectId, nodeName: node.name }}
      />
    );
  }

  return null;
};

export default SceneObjects;
