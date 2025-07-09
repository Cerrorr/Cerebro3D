import React from 'react';
import type { ViewportSceneProps } from './types';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Color } from 'three';

/**
 * ViewportScene
 * R3F 场景节点，负责渲染3D场景内容
 * 仅处理 3D 展示逻辑，不包含业务状态
 * @author Cerror
 * @since 2025-06-29
 */
const ViewportScene: React.FC<ViewportSceneProps> = ({ settings, sceneNodes = [] }) => {
  const { scene } = useThree();

  // 设置背景色
  useMemo(() => {
    scene.background = new Color(settings.backgroundColor);
  }, [scene, settings.backgroundColor]);

  /**
   * 递归渲染场景节点
   */
  const renderSceneNodes = (nodes: typeof sceneNodes): JSX.Element[] => {
    const results: JSX.Element[] = [];
    
    const processNode = (node: any) => {
      // 只渲染mesh类型且有importedObject的节点
      if (node.type === 'mesh' && node.importedObject && node.visible !== false) {
        if (!node.importedObject) {
          return null;
        }

        results.push(
          <primitive
            key={node.id}
            object={node.importedObject.clone()}
            position={node.position ? [node.position.x, node.position.y, node.position.z] : [0, 0, 0]}
            rotation={node.rotation ? [node.rotation.x, node.rotation.y, node.rotation.z] : [0, 0, 0]}
            scale={node.scale ? [node.scale.x, node.scale.y, node.scale.z] : [1, 1, 1]}
          />
        );
      }
      
      // 递归处理子节点
      if (node.children && node.children.length > 0) {
        node.children.forEach(processNode);
      }
    };

    nodes.forEach(processNode);
    return results.filter(Boolean);
  };

  return (
    <>
      {/* 灯光 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={0.5} />

      {/* 网格（可选显示） */}
      {settings.gridVisible && <gridHelper args={[50, 50]} />}

      {/* 渲染导入的3D模型 */}
      {renderSceneNodes(sceneNodes)}
    </>
  );
};

export default ViewportScene; 