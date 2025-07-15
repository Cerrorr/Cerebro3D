/**
 * @author Claude
 * @createTime 2025-07-15
 * @description 场景对象渲染组件
 */

import { Fragment, useEffect, useState } from 'react';
import { Object3D } from 'three';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import type { SceneObjectsProps, SceneObjectProps } from './types/SceneObjects.types';

/**
 * 场景对象集合组件
 */
const SceneObjects = ({ nodes, scene3DService }: SceneObjectsProps) => {
  const renderNode = (node: SceneNode) => {
    if (!node.visible) return null;

    return (
      <Fragment key={node.id}>
        <SceneObject node={node} scene3DService={scene3DService} />
        {node.children?.map(renderNode)}
      </Fragment>
    );
  };

  return (
    <group name="scene-objects">
      {nodes.map(renderNode)}
    </group>
  );
};

/**
 * 单个场景对象组件
 */
const SceneObject = ({ node, scene3DService }: SceneObjectProps) => {
  const [importedObject, setImportedObject] = useState<Object3D | null>(null);

  // 从Scene3DService获取导入的对象
  useEffect(() => {
    if (node.objectId && scene3DService) {
      const object = scene3DService.getObject(node.objectId);
      if (object) {
        setImportedObject(object);
      }
    } else {
      // 如果没有scene3DService或objectId，清空importedObject
      setImportedObject(null);
    }
  }, [node.objectId, scene3DService]);

  // 同步节点变换到Scene3DService
  useEffect(() => {
    if (node.objectId && scene3DService && (node.position || node.rotation || node.scale)) {
      scene3DService.updateObjectTransform(node.objectId, {
        position: node.position,
        rotation: node.rotation,
        scale: node.scale
      });
    }
  }, [node.objectId, node.position, node.rotation, node.scale, scene3DService]);

  // 如果有导入的对象，直接使用原始对象而不是克隆
  if (importedObject) {
    return (
      <primitive 
        object={importedObject}
      />
    );
  }

  // 只渲染导入的模型，不显示默认几何体
  // 如果没有导入对象，则不渲染任何内容
  return null;
};

export default SceneObjects;