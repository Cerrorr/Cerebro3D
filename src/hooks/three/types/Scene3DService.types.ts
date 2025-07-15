/**
 * 3D场景服务类型定义
 * @author Cerror
 * @since 2025-07-11
 */

import type { Object3D } from 'three';

/**
 * 3D场景初始化配置
 */
export interface Scene3DConfig {
  // 画布容器元素 (可选，在页面级别可能暂时为null)
  container: HTMLElement | null;
  // 初始相机位置
  cameraPosition?: [number, number, number];
  // 初始相机目标点
  cameraTarget?: [number, number, number];
  // 背景颜色
  backgroundColor?: string;
  // 是否显示网格
  showGrid?: boolean;
  // 是否显示坐标轴
  showAxis?: boolean;
  // 是否启用轨道控制器
  enableOrbitControls?: boolean;
  // 场景更新回调
  onSceneUpdate?: (scene: Object3D) => void;
  // 错误回调
  onError?: (error: Error) => void;
}

/**
 * 3D场景状态
 */
export interface Scene3DState {
  // 场景是否已初始化
  initialized: boolean;
  // 渲染器是否准备就绪
  rendererReady: boolean;
  // 当前加载的对象数量
  loadedObjectsCount: number;
  // 性能统计
  stats?: {
    // 帧率
    fps: number;
    // 三角形数量
    triangles: number;
    // 顶点数量
    vertices: number;
  };
}

/**
 * 3D对象变换参数
 */
export interface Transform3D {
  // 位置
  position?: { x: number; y: number; z: number };
  // 旋转
  rotation?: { x: number; y: number; z: number };
  // 缩放
  scale?: { x: number; y: number; z: number };
}

/**
 * 3D场景操作结果
 */
export interface Scene3DOperationResult {
  // 操作是否成功
  success: boolean;
  // 结果消息
  message?: string;
  // 附加数据
  data?: any;
}