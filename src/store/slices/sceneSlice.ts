/**
 * 场景状态管理
 * 管理3D场景的节点、设置和状态，供业务逻辑和3D渲染共享
 * @author Cerror
 * @since 2025-07-11
 */

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import type { CanvasSettings } from '@/components/projectEditor/viewport/types';
import type { CameraConfiguration } from '@/components/projectEditor/rightPanels/types';

/**
 * 场景状态接口
 */
export interface SceneState {
  /** 场景节点树 */
  nodes: SceneNode[];
  /** 当前选中的节点ID */
  selectedNodeId: string | null;
  /** 3D画布设置 */
  canvasSettings: CanvasSettings;
  /** 当前视图类型 */
  currentView: 'perspective' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  /** 相机位置 */
  cameraPosition: [number, number, number];
  /** 相机目标点 */
  cameraTarget: [number, number, number];
  /** 相机配置 */
  cameraConfig: CameraConfiguration;
  /** 场景是否加载中 */
  isLoading: boolean;
}

/**
 * 默认画布设置
 */
const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  gridVisible: true,
  axisVisible: true,
  backgroundColor: '#000000',
  cameraPosition: [6, 4, 6],
};

/**
 * 默认相机配置
 */
const DEFAULT_CAMERA_CONFIG: CameraConfiguration = {
  type: 'perspective',
  perspective: { 
    fov: 75, 
    aspect: 16 / 9, 
    near: 0.1, 
    far: 10000  // 增加远截面距离，确保远处网格可见
  },
  orthographic: {
    left: -10,
    right: 10,
    top: 10,
    bottom: -10,
    near: 0.1,
    far: 10000,  // 同样增加正交相机的远截面
    zoom: 1,
  },
  transform: {
    position: { x: 6, y: 4, z: 6 },
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
  },
};

/**
 * 初始状态
 */
const initialState: SceneState = {
  nodes: [
    {
      id: 'scene',
      name: 'Scene',
      type: 'scene',
      visible: true,
      expanded: true,
      children: [
        {
          id: 'ambient-light',
          name: '环境光',
          type: 'light',
          visible: true,
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
        {
          id: 'directional-light',
          name: '平行光',
          type: 'light',
          visible: true,
          position: { x: 5, y: 10, z: 7 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        },
      ],
    },
  ],
  selectedNodeId: null,
  canvasSettings: DEFAULT_CANVAS_SETTINGS,
  currentView: 'perspective',
  cameraPosition: [6, 4, 6],
  cameraTarget: [0, 0, 0],
  cameraConfig: DEFAULT_CAMERA_CONFIG,
  isLoading: false,
};

/**
 * 场景切片
 */
const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    /**
     * 设置场景节点
     */
    setSceneNodes: (state, action: PayloadAction<SceneNode[]>) => {
      state.nodes = action.payload;
    },

    /**
     * 添加场景节点
     */
    addSceneNode: (state, action: PayloadAction<{ parentId?: string; node: Omit<SceneNode, 'id'> }>) => {
      const { parentId, node } = action.payload;
      const newNode: SceneNode = {
        ...node,
        id: nanoid(),
      };

      if (parentId) {
        // 递归查找父节点并添加子节点
        const addToParent = (nodes: SceneNode[]): boolean => {
          for (const n of nodes) {
            if (n.id === parentId) {
              n.children = n.children || [];
              n.children.push(newNode);
              return true;
            }
            if (n.children && addToParent(n.children)) {
              return true;
            }
          }
          return false;
        };
        addToParent(state.nodes);
      } else {
        // 添加到根级别
        state.nodes.push(newNode);
      }
    },

    /**
     * 删除场景节点
     */
    removeSceneNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      
      const removeFromNodes = (nodes: SceneNode[]): SceneNode[] => {
        return nodes.filter(node => {
          if (node.id === nodeId) {
            return false;
          }
          if (node.children) {
            node.children = removeFromNodes(node.children);
          }
          return true;
        });
      };

      state.nodes = removeFromNodes(state.nodes);
      
      // 如果删除的是选中节点，清除选择
      if (state.selectedNodeId === nodeId) {
        state.selectedNodeId = null;
      }
    },

    /**
     * 更新场景节点
     */
    updateSceneNode: (state, action: PayloadAction<{ nodeId: string; updates: Partial<SceneNode> }>) => {
      const { nodeId, updates } = action.payload;
      
      const updateNode = (nodes: SceneNode[]): void => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            Object.assign(node, updates);
            return;
          }
          if (node.children) {
            updateNode(node.children);
          }
        }
      };

      updateNode(state.nodes);
    },

    /**
     * 切换节点可见性
     */
    toggleNodeVisibility: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      
      const toggleVisibility = (nodes: SceneNode[]): boolean => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            const newVisibility = !(node.visible !== false);
            node.visible = newVisibility;
            
            // 递归设置所有子节点的可见性
            const setChildrenVisibility = (children: SceneNode[], visible: boolean): void => {
              children.forEach(child => {
                child.visible = visible;
                if (child.children) {
                  setChildrenVisibility(child.children, visible);
                }
              });
            };
            
            if (node.children) {
              setChildrenVisibility(node.children, newVisibility);
            }
            
            return true;
          }
          if (node.children && toggleVisibility(node.children)) {
            return true;
          }
        }
        return false;
      };

      toggleVisibility(state.nodes);
    },

    /**
     * 选择节点
     */
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },

    /**
     * 更新画布设置
     */
    updateCanvasSettings: (state, action: PayloadAction<Partial<CanvasSettings>>) => {
      state.canvasSettings = { ...state.canvasSettings, ...action.payload };
    },

    /**
     * 设置当前视图
     */
    setCurrentView: (state, action: PayloadAction<SceneState['currentView']>) => {
      state.currentView = action.payload;
    },

    /**
     * 更新相机配置
     */
    updateCameraConfig: (state, action: PayloadAction<Partial<CameraConfiguration>>) => {
      state.cameraConfig = { ...state.cameraConfig, ...action.payload };
      
      // 同步更新位置相关状态
      if (action.payload.transform?.position) {
        const { x, y, z } = action.payload.transform.position;
        state.cameraPosition = [x, y, z];
        state.canvasSettings.cameraPosition = [x, y, z];
      }
      
      if (action.payload.transform?.target) {
        const { x, y, z } = action.payload.transform.target;
        state.cameraTarget = [x, y, z];
      }
    },

    /**
     * 更新相机位置
     */
    updateCameraPosition: (state, action: PayloadAction<[number, number, number]>) => {
      state.cameraPosition = action.payload;
      state.canvasSettings.cameraPosition = action.payload;
      
      // 同步更新相机配置
      state.cameraConfig.transform.position = {
        x: action.payload[0],
        y: action.payload[1],
        z: action.payload[2],
      };
    },

    /**
     * 更新相机目标点
     */
    updateCameraTarget: (state, action: PayloadAction<[number, number, number]>) => {
      state.cameraTarget = action.payload;
      
      // 同步更新相机配置
      state.cameraConfig.transform.target = {
        x: action.payload[0],
        y: action.payload[1],
        z: action.payload[2],
      };
    },

    /**
     * 设置加载状态
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * 重置场景
     */
    resetScene: (state) => {
      state.nodes = initialState.nodes;
      state.selectedNodeId = null;
      state.canvasSettings = DEFAULT_CANVAS_SETTINGS;
      state.currentView = 'perspective';
      state.cameraPosition = [6, 4, 6];
      state.cameraTarget = [0, 0, 0];
      state.cameraConfig = DEFAULT_CAMERA_CONFIG;
      state.isLoading = false;
    },

    /**
     * 清空场景对象但保留初始光照
     * 恢复到场景初始状态，只保留环境光和平行光
     */
    clearSceneObjectsOnly: (state) => {
      // 直接恢复到初始状态的节点结构，只保留scene根节点和其初始子节点
      const sceneRootNode = {
        id: 'scene',
        name: 'Scene',
        type: 'scene' as const,
        visible: true,
        expanded: true,
        children: [
          {
            id: 'ambient-light',
            name: '环境光',
            type: 'light' as const,
            visible: true,
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          {
            id: 'directional-light',
            name: '平行光',
            type: 'light' as const,
            visible: true,
            position: { x: 5, y: 10, z: 7 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
        ],
      };

      // 重置为初始节点结构
      state.nodes = [sceneRootNode];
      
      // 清除选择（因为用户对象都被移除了）
      state.selectedNodeId = null;
    },
  },
});

export const {
  setSceneNodes,
  addSceneNode,
  removeSceneNode,
  updateSceneNode,
  toggleNodeVisibility,
  selectNode,
  updateCanvasSettings,
  setCurrentView,
  updateCameraConfig,
  updateCameraPosition,
  updateCameraTarget,
  setLoading,
  resetScene,
  clearSceneObjectsOnly,
} = sceneSlice.actions;

export default sceneSlice.reducer;
