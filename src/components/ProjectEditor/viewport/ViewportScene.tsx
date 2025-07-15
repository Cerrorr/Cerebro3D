/**
 * @author Claude
 * @createTime 2025-07-15
 * @description 3D视口场景组件 - 使用自定义三维Hook实现场景渲染
 */

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stats, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useAppSelector } from '@/store';
import { 
  useThreeScene, 
  useLightingSystem, 
  useCameraControl 
} from '@/hooks/three';
import SceneObjects from './SceneObjects';
import type { ViewportSceneProps } from './types/viewportScene.types';

/**
 * 3D场景组件
 * 使用React Three Fiber和自定义Hook管理场景
 */
const ViewportScene: React.FC<ViewportSceneProps> = ({
  backgroundColor = '#2a2a2a',
  enableGrid = true,
  enableStats = false,
  enableFog = false,
  fogNear = 10,
  fogFar = 100,
  scene3DService
}) => {
  // 从Redux获取场景数据
  const { nodes: sceneNodes } = useAppSelector(state => state.scene);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ 
          position: [10, 10, 10], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
        style={{ background: backgroundColor }}
      >
        {/* Suspense包装异步加载的组件 */}
        <Suspense fallback={null}>
          {/* 场景设置组件 */}
          <SceneSetup 
            backgroundColor={backgroundColor}
            enableFog={enableFog}
            fogNear={fogNear}
            fogFar={fogFar}
          />

          {/* 光照设置组件 */}
          <SceneLighting />

          {/* 相机控制组件 */}
          <CameraManager />

          {/* 场景对象渲染 */}
          <SceneObjects 
            nodes={sceneNodes} 
            scene3DService={scene3DService}
          />

          {/* 网格和辅助工具 */}
          {enableGrid && (
            <Grid 
              args={[20, 20]} 
              cellColor="#444444" 
              sectionColor="#666666"
              position={[0, -0.01, 0]}
            />
          )}

          {/* 轨道控制器 */}
          <OrbitControls 
            makeDefault
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={100}
            maxPolarAngle={Math.PI}
          />

          {/* Gizmo 坐标轴指示器 - 右上角 */}
          <GizmoHelper
            alignment="top-right"
            margin={[55, 55]}
            renderPriority={1}
          >
            <GizmoViewport 
              axisColors={['#ff4757', '#2ed573', '#3742fa']} 
              labelColor="white"
              hideNegativeAxes={true}
            />
          </GizmoHelper>

          {/* 性能统计 */}
          {enableStats && <Stats />}
        </Suspense>
      </Canvas>
    </div>
  );
};

/**
 * 场景设置组件 - 使用useThreeScene Hook
 */
const SceneSetup: React.FC<{
  backgroundColor: string;
  enableFog: boolean;
  fogNear: number;
  fogFar: number;
}> = ({ backgroundColor, enableFog, fogNear, fogFar }) => {
  const { setBackgroundColor, enableFog: setFog, disableFog, enableShadows } = useThreeScene({
    backgroundColor,
    enableShadows: true,
    fog: enableFog ? {
      color: '#cccccc',
      near: fogNear,
      far: fogFar
    } : undefined
  });

  useEffect(() => {
    setBackgroundColor(backgroundColor);
    enableShadows();
    
    if (enableFog) {
      setFog('#cccccc', fogNear, fogFar);
    } else {
      disableFog();
    }
  }, [backgroundColor, enableFog, fogNear, fogFar, setBackgroundColor, setFog, disableFog, enableShadows]);

  return null;
};

/**
 * 光照设置组件 - 使用useLightingSystem Hook
 */
const SceneLighting: React.FC = () => {
  const { 
    addAmbientLight, 
    addDirectionalLight 
  } = useLightingSystem({
    enableAmbientLight: true,
    ambientIntensity: 0.6,
    enableDirectionalLight: true,
    directionalIntensity: 1,
    enableShadows: true
  });

  useEffect(() => {
    // 添加环境光
    addAmbientLight(0.6, '#ffffff');
    
    // 添加主光源
    import('three').then(({ Vector3 }) => {
      addDirectionalLight(new Vector3(10, 10, 5), 1);
    });
  }, [addAmbientLight, addDirectionalLight]);

  return null;
};

/**
 * 相机管理组件 - 使用useCameraControl Hook
 */
const CameraManager: React.FC = () => {
  const { resetCamera } = useCameraControl({
    autoRotate: false,
    enableZoom: true,
    enablePan: true
  });

  // 可以在这里添加相机相关的键盘快捷键或其他控制逻辑
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' && event.ctrlKey) {
        resetCamera();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resetCamera]);

  return null;
};

export default ViewportScene;