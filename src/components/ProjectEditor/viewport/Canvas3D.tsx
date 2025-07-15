/**
 * @author Claude
 * @createTime 2025-07-15
 * @description Canvas3D组件 - 3D视口容器组件
 */

import React from 'react';
import ViewportScene from './ViewportScene';
import type { Canvas3DProps } from './types/Canvas3D.types';

/**
 * Canvas3D组件
 * 提供3D视口的容器和基础配置
 */
const Canvas3D: React.FC<Canvas3DProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  backgroundColor = '#2a2a2a',
  enableGrid = true,
  enableStats = false,
  scene3DService
}) => {
  return (
    <div 
      className={`canvas-3d ${className}`}
      style={{ 
        width, 
        height, 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <ViewportScene
        backgroundColor={backgroundColor}
        enableGrid={enableGrid}
        enableStats={enableStats}
        enableFog={false}
        fogNear={10}
        fogFar={100}
        scene3DService={scene3DService}
      />
    </div>
  );
};

export default Canvas3D;