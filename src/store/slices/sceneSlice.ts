/**
 * 场景状态管理
 * 管理3D场景的节点、设置和状态，供业务逻辑和3D渲染共享
 * @author Cerror
 * @since 2025-07-11
 */

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';
import type { CanvasSettings } from '@/components/projectEditor/viewport/types';

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
  /** 场景是否加载中 */
  isLoading: boolean;
}

/**
 * 默认画布设置
 */
const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  gridVisible: true,
  axisVisible: true,
  backgroundColor: '#f0f0f0',
  cameraPosition: [6, 4, 6],
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
      children: [],
    },
  ],
  selectedNodeId: null,
  canvasSettings: DEFAULT_CANVAS_SETTINGS,
  currentView: 'perspective',
  cameraPosition: [6, 4, 6],
  cameraTarget: [0, 0, 0],
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
      
      const toggleVisibility = (nodes: SceneNode[]): void => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            node.visible = !(node.visible !== false);
            return;
          }
          if (node.children) {
            toggleVisibility(node.children);
          }
        }
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
     * 更新相机位置
     */
    updateCameraPosition: (state, action: PayloadAction<[number, number, number]>) => {
      state.cameraPosition = action.payload;
      state.canvasSettings.cameraPosition = action.payload;
    },

    /**
     * 更新相机目标点
     */
    updateCameraTarget: (state, action: PayloadAction<[number, number, number]>) => {
      state.cameraTarget = action.payload;
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
      state.isLoading = false;
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
  updateCameraPosition,
  updateCameraTarget,
  setLoading,
  resetScene,
} = sceneSlice.actions;

export default sceneSlice.reducer;