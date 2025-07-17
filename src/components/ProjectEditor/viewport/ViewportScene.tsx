/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 3D视口场景组件 - 使用自定义三维Hook实现场景渲染
 */

import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Grid,
  Stats,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei';
import { useAppSelector } from '@/store';
import {
  useThreeScene,
  useLightingSystem,
  useCameraControl,
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
  scene3DService,
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
          far: 1000,
        }}
        shadows
        style={{ background: backgroundColor }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 50 } }}
        dpr={[1, 2]}
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
          <SceneLighting sceneNodes={sceneNodes} />

          {/* 相机控制组件 */}
          <CameraManager />

          {/* 窗口大小变化处理组件 */}
          <ResizeHandler />

          {/* 场景对象渲染 */}
          <SceneObjects nodes={sceneNodes} scene3DService={scene3DService} />

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
  const {
    setBackgroundColor,
    enableFog: setFog,
    disableFog,
    enableShadows,
  } = useThreeScene({
    backgroundColor,
    enableShadows: true,
    fog: enableFog
      ? {
          color: '#cccccc',
          near: fogNear,
          far: fogFar,
        }
      : undefined,
  });

  useEffect(() => {
    setBackgroundColor(backgroundColor);
    enableShadows();

    if (enableFog) {
      setFog('#cccccc', fogNear, fogFar);
    } else {
      disableFog();
    }
  }, [
    backgroundColor,
    enableFog,
    fogNear,
    fogFar,
    setBackgroundColor,
    setFog,
    disableFog,
    enableShadows,
  ]);

  return null;
};

/**
 * 光照设置组件 - 使用useLightingSystem Hook
 */
const SceneLighting: React.FC<{ sceneNodes: any[] }> = ({ sceneNodes }) => {
  const {
    addAmbientLight,
    addDirectionalLight,
    ambientLight,
    directionalLight,
  } = useLightingSystem({
    enableAmbientLight: true,
    ambientIntensity: 0.6,
    enableDirectionalLight: true,
    directionalIntensity: 1,
    enableShadows: true,
  });

  useEffect(() => {
    // 添加环境光
    addAmbientLight(0.6, '#ffffff');

    // 添加主光源
    import('three').then(({ Vector3 }) => {
      addDirectionalLight(new Vector3(10, 10, 5), 1);
    });
  }, [addAmbientLight, addDirectionalLight]);

  // 控制光源可见性
  useEffect(() => {
    // 递归查找节点
    const findNodeById = (nodes: any[], id: string): any => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    // 检查节点及其所有父节点的可见性
    const isNodeVisible = (nodeToCheck: any, nodes: any[]): boolean => {
      if (nodeToCheck.visible === false) {
        return false;
      }

      // 查找父节点
      const findParent = (targetId: string, searchNodes: any[]): any => {
        for (const searchNode of searchNodes) {
          if (
            searchNode.children?.some((child: any) => child.id === targetId)
          ) {
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
        return isNodeVisible(parent, nodes);
      }

      return true;
    };

    const ambientLightNode = findNodeById(sceneNodes, 'ambient-light');
    const directionalLightNode = findNodeById(sceneNodes, 'directional-light');

    // 控制环境光可见性
    if (ambientLight && ambientLightNode) {
      const shouldBeVisible = isNodeVisible(ambientLightNode, sceneNodes);
      ambientLight.visible = shouldBeVisible;
      // 设置光照强度，隐藏时强度为0
      ambientLight.intensity = shouldBeVisible ? 0.6 : 0;
    }

    // 控制平行光可见性
    if (directionalLight && directionalLightNode) {
      const shouldBeVisible = isNodeVisible(directionalLightNode, sceneNodes);
      directionalLight.visible = shouldBeVisible;
      // 设置光照强度，隐藏时强度为0
      directionalLight.intensity = shouldBeVisible ? 1 : 0;
    }
  }, [sceneNodes, ambientLight, directionalLight]);

  return null;
};

/**
 * 相机管理组件 - 使用useCameraControl Hook
 */
const CameraManager: React.FC = () => {
  const { resetCamera } = useCameraControl({
    autoRotate: false,
    enableZoom: true,
    enablePan: true,
  });

  // 相机相关的键盘快捷键
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

/**
 * 窗口大小变化处理组件
 * 监听窗口大小变化，自动更新相机宽高比和渲染器尺寸
 * 优化版本：实时同步面板动画，减少闪烁
 */
const ResizeHandler: React.FC = () => {
  const { camera, gl } = useThree();
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const updateSceneSize = (width: number, height: number) => {
      // 检查尺寸是否真的发生了变化
      const lastSize = lastSizeRef.current;
      if (
        Math.abs(width - lastSize.width) < 1 &&
        Math.abs(height - lastSize.height) < 1
      ) {
        return; // 尺寸变化太小，忽略
      }

      // 更新记录的尺寸
      lastSizeRef.current = { width, height };

      // 批量更新，避免多次渲染
      requestAnimationFrame(() => {
        // 更新渲染器尺寸
        gl.setSize(width, height, false); // false参数避免更新CSS样式

        // 更新相机宽高比
        if (camera.type === 'PerspectiveCamera') {
          const perspectiveCamera = camera as any;
          perspectiveCamera.aspect = width / height;
          perspectiveCamera.updateProjectionMatrix();
        }

        if (camera.type === 'OrthographicCamera') {
          const orthographicCamera = camera as any;
          const aspect = width / height;
          orthographicCamera.left = -10 * aspect;
          orthographicCamera.right = 10 * aspect;
          orthographicCamera.top = 10;
          orthographicCamera.bottom = -10;
          orthographicCamera.updateProjectionMatrix();
        }

        console.log(
          `[ResizeHandler] 场景尺寸更新: ${width.toFixed(0)}x${height.toFixed(0)}, 宽高比: ${(width / height).toFixed(2)}`
        );
      });
    };

    const startContinuousUpdate = () => {
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      const continuousUpdate = () => {
        if (!isAnimatingRef.current) return;

        const canvas = gl.domElement;
        const container = canvas.parentElement;

        if (container) {
          const rect = container.getBoundingClientRect();
          const { width, height } = rect;

          // 检查尺寸是否还在变化
          const lastSize = lastSizeRef.current;
          const sizeChange =
            Math.abs(width - lastSize.width) +
            Math.abs(height - lastSize.height);

          if (sizeChange > 1) {
            // 尺寸还在变化，继续更新
            updateSceneSize(width, height);
            animationFrameRef.current = requestAnimationFrame(continuousUpdate);
          } else {
            // 尺寸稳定，停止连续更新
            isAnimatingRef.current = false;
            console.log('[ResizeHandler] 面板动画完成，停止连续更新');
          }
        }
      };

      console.log('[ResizeHandler] 检测到面板动画，开始连续更新');
      animationFrameRef.current = requestAnimationFrame(continuousUpdate);
    };

    const debouncedResize = (
      width: number,
      height: number,
      immediate = false
    ) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      if (immediate) {
        // 立即更新，并启动连续更新模式
        updateSceneSize(width, height);
        startContinuousUpdate();
      } else {
        // 防抖更新，用于一般情况
        resizeTimeoutRef.current = setTimeout(() => {
          updateSceneSize(width, height);
        }, 16);
      }
    };

    // 监听容器大小变化（使用ResizeObserver）
    const canvas = gl.domElement;
    const container = canvas.parentElement;
    let resizeObserver: ResizeObserver | null = null;

    if (container && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;

          // 检测是否是快速连续的尺寸变化（可能是面板动画）
          const lastSize = lastSizeRef.current;
          const sizeChange =
            Math.abs(width - lastSize.width) +
            Math.abs(height - lastSize.height);
          const isLargeChange = sizeChange > 50; // 大于50像素的变化认为是面板操作

          if (isLargeChange) {
            // 面板动画期间使用立即更新，实现实时同步
            debouncedResize(width, height, true);
          } else {
            // 小幅度变化使用防抖更新
            debouncedResize(width, height, false);
          }
        }
      });

      resizeObserver.observe(container);
    }

    // 窗口resize的备用监听（防抖处理）
    const handleWindowResize = () => {
      if (container) {
        const rect = container.getBoundingClientRect();
        debouncedResize(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleWindowResize);

    // 初始化时执行一次（延迟执行，确保DOM已渲染）
    setTimeout(() => {
      if (container) {
        const rect = container.getBoundingClientRect();
        updateSceneSize(rect.width, rect.height);
      }
    }, 100);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isAnimatingRef.current = false;
    };
  }, [camera, gl]);

  return null;
};

export default ViewportScene;
