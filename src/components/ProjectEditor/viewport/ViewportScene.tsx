import React from 'react';
import { CanvasSettings } from './types/Canvas3D.types';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

interface ViewportSceneProps {
  settings: CanvasSettings;
}

/**
 * ViewportScene
 * R3F 场景节点，负责渲染网格/坐标轴及示例立方体
 * 仅处理 3D 展示逻辑，不包含业务状态
 * @author Cerror
 * @since 2025-06-29
 */
const ViewportScene: React.FC<ViewportSceneProps> = ({ settings }) => {
  const { scene } = useThree();

  // 设置背景色
  useMemo(() => {
    scene.background = new THREE.Color(settings.backgroundColor);
  }, [scene, settings.backgroundColor]);

  return (
    <>
      {/* 灯光 */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={0.5} />

      {/* 坐标轴与网格 */}
      {settings.axisVisible && <axesHelper args={[5]} />}
      {settings.gridVisible && <gridHelper args={[50, 50]} />}

      {/* 示例立方体 */}
      <mesh rotation={[0.4, 0.2, 0]}> 
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#888" wireframe />
      </mesh>
    </>
  );
};

export default ViewportScene; 