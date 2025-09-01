/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 3D视口场景组件 - 重构版本，使用模块化组件和Hook
 */

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Grid,
  Stats,
  GizmoHelper,
  GizmoViewport,
  TransformControls,
} from '@react-three/drei';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCameraPosition, setCameraTarget } from '@/store/slices/cameraSlice';

// 导入子组件
import SceneSetup from './components/SceneSetup';
import SceneLighting from './components/SceneLighting';
import CameraManager from './components/CameraManager';
import ResizeHandler from './components/ResizeHandler';
import RendererSync from './components/RendererSync';
import GlobalIllumination from './components/GlobalIllumination';
import PostProcessingEffects from './PostProcessingEffects';
import { WeatherEffects } from './WeatherEffects';
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
  const cameraConfig = useAppSelector(state => state.camera.config);
  const postProcessingConfigFromRedux = useAppSelector(state => state.postProcessing.config);
  const dispatch = useAppDispatch();
  const orbitControlsRef = useRef<any>(null);

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

  // 处理相机变化，同步到 Redux
  const handleCameraChange = () => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current;
      const camera = controls.object;
      const target = controls.target;
      
      // 同步相机位置
      dispatch(setCameraPosition({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      }));
      
      // 同步相机目标点
      dispatch(setCameraTarget({
        x: target.x,
        y: target.y,
        z: target.z,
      }));
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [
            cameraConfig.transform.position.x,
            cameraConfig.transform.position.y,
            cameraConfig.transform.position.z
          ],
          fov: cameraConfig.type === 'perspective' ? cameraConfig.perspective.fov : 50,
          near: cameraConfig.type === 'perspective' ? cameraConfig.perspective.near : cameraConfig.orthographic.near,
          far: cameraConfig.type === 'perspective' ? cameraConfig.perspective.far : cameraConfig.orthographic.far,
        }}
        shadows
        style={{ background: backgroundColor }}
        resize={{ scroll: false, debounce: { scroll: 100, resize: 100 } }}
        dpr={[1, 2]}
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* 场景设置组件 */}
          <SceneSetup
            backgroundColor={backgroundColor}
            enableFog={false}  // 禁用 SceneSetup 的雾效果，由 WeatherManager 控制
            fogNear={fogNear}
            fogFar={fogFar}
            backgroundConfig={sceneConfig.background}
            environmentConfig={sceneConfig.environment}
          />

          {/* 光照设置组件 */}
          <SceneLighting />

          {/* 渲染器配置同步组件 */}
          <RendererSync />

          {/* 全局光影组件 */}
          <GlobalIllumination />

          {/* 相机控制组件 */}
          <CameraManager
            cameraControlRef={cameraControlRef}
            onViewChange={onViewChange}
            cameraConfig={cameraConfig}
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
            ref={orbitControlsRef}
            makeDefault
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={100}
            maxPolarAngle={Math.PI}
            enableDamping={true}
            dampingFactor={0.1}
            target={[
              cameraConfig.transform.target.x,
              cameraConfig.transform.target.y,
              cameraConfig.transform.target.z,
            ]}
            onChange={handleCameraChange}
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

          {/* 天气效果组件 */}
          <WeatherEffects />

          {/* 后期处理效果 - 总是渲染 */}
          <PostProcessingEffects
            selectedObjects={sceneSelection.selectedObjects}
            config={postProcessingConfigFromRedux}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ViewportScene;
