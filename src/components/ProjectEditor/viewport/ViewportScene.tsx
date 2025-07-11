import React from 'react';
import type { ViewportSceneProps } from './types';
import { useScene, useObjectRender, useEnvironment } from '@/hooks/three';

/**
 * ViewportScene (重构版)
 * R3F 场景节点，使用专门的R3F Hook，完全分离3D渲染逻辑
 * 业务逻辑通过Redux状态管理，3D逻辑通过R3F Hook管理
 * @author Cerror
 * @since 2025-07-11
 */
const ViewportScene: React.FC<ViewportSceneProps> = ({ settings }) => {
  // 使用场景管理Hook
  const { updateBackgroundColor } = useScene();
  
  // 使用对象渲染Hook
  const { renderableNodes } = useObjectRender({
    enableAnimation: false,
    highlightSelected: true,
  });
  
  // 使用环境效果Hook
  const { lightElements, gridElement, axisElement } = useEnvironment();

  // 当背景色设置变化时更新
  React.useEffect(() => {
    if (settings.backgroundColor) {
      updateBackgroundColor(settings.backgroundColor);
    }
  }, [settings.backgroundColor, updateBackgroundColor]);

  return (
    <>
      {/* 环境灯光 */}
      {lightElements}

      {/* 网格（基于Redux状态控制显示） */}
      {gridElement}

      {/* 坐标轴（基于Redux状态控制显示） */}
      {axisElement}

      {/* 渲染场景中的3D对象（来自Redux状态） */}
      {renderableNodes}
    </>
  );
};

export default ViewportScene; 