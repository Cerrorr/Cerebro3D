/**
 * 渲染统计Hook类型定义
 * @author Cerror
 * @since 2025-07-17
 */

import type { Object3D } from 'three';

export interface RenderStatsData {
  // 场景物体数量
  objectCount: number;
  // 总顶点数量
  vertexCount: number;
  // 总三角面数量
  triangleCount: number;
}

export interface ModelStatistics {
  // 模型名称
  name: string;
  // 物体ID
  objectId: string;
  // 顶点数量
  vertices: number;
  // 三角面数量
  triangles: number;
  // 材质数量
  materials: number;
  // 纹理数量
  textures: number;
  // 是否可见
  visible: boolean;
}

export interface UseRenderStatsOptions {
  // 是否启用性能监控
  enabled?: boolean;
  // 更新间隔（毫秒）
  updateInterval?: number;
  // 是否包含详细的模型统计
  includeModelStats?: boolean;
}

export interface UseRenderStatsReturn {
  // 当前渲染统计数据
  stats: RenderStatsData;
  // 模型统计列表
  modelStats: ModelStatistics[];
  // 是否正在监控
  isMonitoring: boolean;
  // 开始监控
  startMonitoring: () => void;
  // 停止监控
  stopMonitoring: () => void;
  // 重置统计数据
  resetStats: () => void;
} 