/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description 3D视口场景组件 - 使用自定义三维Hook实现场景渲染
 */

import React, {
  Suspense,
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Object3D } from 'three';
import {
  OrbitControls,
  Grid,
  Stats,
  GizmoHelper,
  GizmoViewport,
} from '@react-three/drei';
// import {
//   EffectComposer,
//   Outline,
// } from '@react-three/postprocessing';
import { useAppSelector, useAppDispatch } from '@/store';
import { selectNode } from '@/store/slices/sceneSlice';
import {
  useThreeScene,
  useLightingSystem,
  useCameraControl,
} from '@/hooks/three';
import NativeOutlineEffect from './NativeOutlineEffect';
import SceneObjects from './SceneObjects';
import type {
  ViewportSceneProps,
  CameraControlRef,
} from './types/viewportScene.types';
import type { ViewType } from './types/Canvas3D.types';

/**
 * 场景设置组件 - 使用useThreeScene Hook
 */
const SceneSetup: React.FC<{
  backgroundColor: string;
  enableFog: boolean;
  fogNear: number;
  fogFar: number;
  backgroundConfig?: {
    type: 'color' | 'texture' | 'skybox';
    color?: string;
    texture?: string;
    skybox?: string;
  };
}> = ({ backgroundColor, enableFog, fogNear, fogFar, backgroundConfig }) => {
  const {
    setBackgroundColor,
    setBackground,
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
    // 应用背景配置
    if (backgroundConfig) {
      switch (backgroundConfig.type) {
        case 'color':
          if (backgroundConfig.color) {
            setBackground('color', backgroundConfig.color);
          } else {
            setBackgroundColor(backgroundColor);
          }
          break;
        case 'texture':
          if (backgroundConfig.texture) {
            setBackground('texture', backgroundConfig.texture);
          } else {
            setBackgroundColor(backgroundColor);
          }
          break;
        case 'skybox':
          if (backgroundConfig.skybox) {
            setBackground('skybox', backgroundConfig.skybox);
          } else {
            setBackgroundColor(backgroundColor);
          }
          break;
        default:
          setBackgroundColor(backgroundColor);
      }
    } else {
      setBackgroundColor(backgroundColor);
    }
    
    enableShadows();

    if (enableFog) {
      setFog('#cccccc', fogNear, fogFar);
    } else {
      disableFog();
    }
  }, [
    backgroundColor,
    backgroundConfig,
    enableFog,
    fogNear,
    fogFar,
    setBackgroundColor,
    setBackground,
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
const CameraManager: React.FC<{
  cameraControlRef?: React.MutableRefObject<CameraControlRef | null>;
  onViewChange?: React.Dispatch<React.SetStateAction<ViewType>>;
}> = ({ cameraControlRef, onViewChange }) => {
  const { resetCamera, setView, zoomToFitAll, getCurrentView } =
    useCameraControl({
      autoRotate: false,
      enableZoom: true,
      enablePan: true,
      animationDuration: 800,
    });

  // 暴露相机控制方法给父组件
  useImperativeHandle(
    cameraControlRef,
    () => ({
      resetCamera,
      setView,
      zoomToFitAll,
    }),
    [resetCamera, setView, zoomToFitAll]
  );

  // 监听视图变化，通知父组件
  useEffect(() => {
    const currentView = getCurrentView();
    if (onViewChange && currentView) {
      onViewChange(currentView);
    }
  }, [getCurrentView, onViewChange]);

  // 相机相关的键盘快捷键
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 阻止在输入框中触发快捷键
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'h':
        case 'home':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            resetCamera();
          }
          break;
        case 'f':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            zoomToFitAll();
          }
          break;
        case '1':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('front');
          }
          break;
        case '3':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('right');
          }
          break;
        case '7':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('top');
          }
          break;
        case '0':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setView('perspective');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resetCamera, zoomToFitAll, setView]);

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
  // 从Redux获取场景数据和选中节点ID以及场景配置
  const { nodes: sceneNodes, selectedNodeId, sceneConfig } = useAppSelector(state => state.scene);
  const dispatch = useAppDispatch();

  // 选中对象状态管理  
  const [selectedObjects, setSelectedObjects] = useState<Object3D[]>([]);

  // 同步SceneTree选择到3D场景高亮
  useEffect(() => {
    if (selectedNodeId && scene3DService) {
      // 查找选中节点对应的3D对象
      const findObjectByNodeId = (nodeId: string): Object3D | null => {
        const findNode = (nodes: any[], searchNodeId: string): any => {
          for (const n of nodes) {
            if (n.id === searchNodeId) return n;
            if (n.children) {
              const found = findNode(n.children, searchNodeId);
              if (found) return found;
            }
          }
          return null;
        };
        
        // 在所有根节点中查找选中的节点
        let selectedNode = null;
        for (const rootNode of sceneNodes) {
          selectedNode = findNode([rootNode], nodeId);
          if (selectedNode) break;
        }
        
        if (!selectedNode) return null;
        
        // 情况1: 如果选中的是顶级节点（有objectId），返回整个对象
        if (selectedNode.objectId) {
          const obj = scene3DService.getObject(selectedNode.objectId);
          return obj || null;
        }
        
        // 情况2: 如果选中的是有子节点的中间节点（包括mesh类型的中间节点）
        if (selectedNode.children && selectedNode.children.length > 0) {
          const parentNode = findParentWithObjectId(selectedNode.id);
          if (parentNode && parentNode.objectId) {
            const parentObject = scene3DService.getObject(parentNode.objectId);
            if (parentObject) {
              // 在父对象中查找名称匹配的对象
              let foundObject: Object3D | null = null;
              parentObject.traverse((child: Object3D) => {
                if (child.name === selectedNode.name && !foundObject) {
                  foundObject = child;
                }
              });
              return foundObject;
            }
          }
        }
        
        // 情况3: 如果选中的是叶子mesh节点，找到对应的具体mesh
        if (selectedNode.type === 'mesh') {
          const parentNode = findParentWithObjectId(selectedNode.id);
          if (parentNode && parentNode.objectId) {
            const parentObject = scene3DService.getObject(parentNode.objectId);
            if (parentObject) {
              // 在父对象中查找名称匹配的mesh
              let foundMesh: Object3D | null = null;
              parentObject.traverse((child: Object3D) => {
                if (child.name === selectedNode.name && child.type === 'Mesh') {
                  foundMesh = child;
                }
              });
              return foundMesh;
            }
          }
        }
        
        return null;
      };
      
      // 查找包含指定节点的顶级父节点（有objectId的节点）
      const findParentWithObjectId = (targetNodeId: string): any => {
        const searchInNode = (node: any): any => {
          // 如果当前节点有objectId，检查是否包含目标节点
          if (node.objectId) {
            const containsTarget = (n: any): boolean => {
              if (n.id === targetNodeId) return true;
              if (n.children) {
                return n.children.some((child: any) => containsTarget(child));
              }
              return false;
            };
            
            if (containsTarget(node)) return node;
          }
          
          // 递归搜索子节点
          if (node.children) {
            for (const child of node.children) {
              const found = searchInNode(child);
              if (found) return found;
            }
          }
          return null;
        };
        
        for (const rootNode of sceneNodes) {
          const found = searchInNode(rootNode);
          if (found) return found;
        }
        return null;
      };
      
      const selectedObject = findObjectByNodeId(selectedNodeId);
      if (selectedObject) {
        setSelectedObjects([selectedObject]);
      } else {
        setSelectedObjects([]);
      }
    } else {
      setSelectedObjects([]);
    }
  }, [selectedNodeId, sceneNodes, scene3DService]);


  // 根据3D对象ID查找对应的节点ID（反向查找）
  const findNodeIdByObjectId = (nodes: any[], objectId: string): string | null => {
    const searchNodes = (nodeList: any[]): string | null => {
      for (const node of nodeList) {
        if (node.objectId === objectId) {
          return node.id;
        }
        if (node.children) {
          const found = searchNodes(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return searchNodes(nodes);
  };

  // 根据mesh对象查找对应的mesh节点ID
  const findMeshNodeId = (nodes: any[], meshObject: any): string | null => {
    const searchInNodes = (nodeList: any[]): string | null => {
      for (const node of nodeList) {
        // 如果是mesh节点且名称匹配
        if (node.type === 'mesh' && node.name === meshObject.name) {
          return node.id;
        }
        // 递归搜索子节点
        if (node.children) {
          const found = searchInNodes(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return searchInNodes(nodes);
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
        {/* Suspense包装异步加载的组件 */}
        <Suspense fallback={null}>
            {/* 场景设置组件 */}
            <SceneSetup
              backgroundColor={backgroundColor}
              enableFog={enableFog}
              fogNear={fogNear}
              fogFar={fogFar}
              backgroundConfig={sceneConfig.background}
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
              onObjectPicked={pickedObject => {
                // 反向同步：点击3D对象时选中对应的树节点
                let nodeId: string | null = null;
                
                if (selectionState === 'partial' && pickedObject.hitMesh) {
                  // 部分选中模式：尝试找到具体mesh对应的节点
                  nodeId = findMeshNodeId(sceneNodes, pickedObject.hitMesh);
                }
                
                // 如果没找到mesh节点或者是全选模式，查找顶级节点
                if (!nodeId) {
                  nodeId = findNodeIdByObjectId(sceneNodes, pickedObject.id);
                }
                
                if (nodeId) {
                  dispatch(selectNode(nodeId));
                }

                // 将完整的 PickedObject 传给上层
                onObjectPicked?.(pickedObject);
              }}
              onEmptySpacePicked={() => {
                // 清空树节点选择
                dispatch(selectNode(null));
                
                // 清空3D对象选择
                setSelectedObjects([]);
                onEmptySpacePicked?.();
              }}
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
              selectedObjects={selectedObjects}
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
