/**
 * 3D场景服务类型定义
 * @author Cerror
 * @since 2025-07-11
 */

import type { Object3D, Vector3 } from 'three';

/**
 * 3D场景初始化配置
 */
export interface Scene3DConfig {
  /** 画布容器元素 */
  container: HTMLElement;
  /** 初始相机位置 */
  cameraPosition?: [number, number, number];
  /** 初始相机目标点 */
  cameraTarget?: [number, number, number];
  /** 背景颜色 */
  backgroundColor?: string;
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 是否显示坐标轴 */
  showAxis?: boolean;
  /** 是否启用轨道控制器 */
  enableOrbitControls?: boolean;
  /** 场景更新回调 */
  onSceneUpdate?: (scene: Object3D) => void;
  /** 错误回调 */
  onError?: (error: Error) => void;
}

/**
 * 3D场景状态
 */
export interface Scene3DState {
  /** 场景是否已初始化 */
  initialized: boolean;
  /** 渲染器是否准备就绪 */
  rendererReady: boolean;
  /** 当前加载的对象数量 */
  loadedObjectsCount: number;
  /** 性能统计 */
  stats?: {
    fps: number;
    triangles: number;
    vertices: number;
  };
}

/**
 * 3D对象变换参数
 */
export interface Transform3D {
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
}

/**
 * 3D场景操作结果
 */
export interface Scene3DOperationResult {
  success: boolean;
  message?: string;
  data?: any;
}