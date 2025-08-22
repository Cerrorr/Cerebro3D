/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 3D视口场景组件 - 重构版本，使用模块化组件和Hook
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Grid,
  Stats,
  GizmoHelper,
  GizmoViewport,
  TransformControls,
} from '@react-three/drei';
import { useAppSelector } from '@/store';

// 导入子组件
import SceneSetup from './components/SceneSetup';
import SceneLighting from './components/SceneLighting';
import CameraManager from './components/CameraManager';
import ResizeHandler from './components/ResizeHandler';
import NativeOutlineEffect from './NativeOutlineEffect';
import SceneObjects from './SceneObjects';

// 导入Hooks
import { useSceneSelection, useTransformControls } from '@/hooks/three';

// 导入类型
import type {
  ViewportSceneProps,
} from './types/viewportScene.types';

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
  scene3DService,
  cameraControlRef,
  onViewChange,
  onObjectPicked,
  onEmptySpacePicked,
  selectionState = 'all',
}) => {
  // 从Redux获取场景数据和配置
  const { nodes: sceneNodes, sceneConfig } = useAppSelector(state => state.scene);

  // 使用选择管理Hook
  const sceneSelection = useSceneSelection({
    sceneNodes,
    scene3DService,
    selectionState,
  });

  // 使用Transform控制器Hook
  const transformControls = useTransformControls({
    selectedObjects: sceneSelection.selectedObjects,
    helpersEnabled: sceneConfig.helpers.enabled,
  });

  // 处理对象点击事件
  const handleObjectPicked = (pickedObject: any) => {
    sceneSelection.handleObjectPicked(pickedObject);
    onObjectPicked?.(pickedObject);
  };

  // 处理空白处点击事件
  const handleEmptySpacePicked = () => {
    sceneSelection.handleEmptySpacePicked();
    onEmptySpacePicked?.();
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        shadows
        style={{ background: backgroundColor }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          {/* 场景设置组件 */}
          <SceneSetup
            backgroundColor={backgroundColor}
            enableFog={enableFog}
            fogNear={fogNear}
            fogFar={fogFar}
            backgroundConfig={sceneConfig.background}
            environmentConfig={sceneConfig.environment}
          />

          {/* 光照设置组件 */}
          <SceneLighting sceneNodes={sceneNodes} />

          {/* 相机控制组件 */}
          <CameraManager
            cameraControlRef={cameraControlRef}
            onViewChange={onViewChange}
          />

          {/* 窗口大小变化处理组件 */}
          <ResizeHandler />

          {/* 场景对象渲染 */}
          <SceneObjects
            nodes={sceneNodes}
            scene3DService={scene3DService}
            onObjectPicked={handleObjectPicked}
            onEmptySpacePicked={handleEmptySpacePicked}
            selectionState={selectionState}
          />

          {/* 网格和辅助工具 */}
          {enableGrid && (
            <Grid
              args={[50, 50]}
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
            enableDamping={true}
            dampingFactor={0.1}
          />

          {/* Transform控制器 - 用于变换选中对象 */}
          {transformControls.isEnabled && (
            <TransformControls
              object={sceneSelection.selectedObjects[0]}
              mode={transformControls.transformMode}
              space="world"
              size={1}
              showX={true}
              showY={true}
              showZ={true}
              translationSnap={null}
              rotationSnap={null}
              scaleSnap={null}
              onObjectChange={() => {
                // 对象变换时的回调，可以在这里更新节点状态
                // TODO: 可以在这里同步更新 Redux 中的节点位置信息
              }}
            />
          )}

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

          {/* 原生Three.js OutlinePass后期处理效果 */}
          <NativeOutlineEffect
            selectedObjects={sceneSelection.selectedObjects}
            edgeColor={0x00ff00}
            edgeStrength={2.5}
            edgeThickness={1.0}
            pulsePeriod={0}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ViewportScene;
