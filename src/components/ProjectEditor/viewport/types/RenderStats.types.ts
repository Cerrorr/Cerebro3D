/**
 * 实时渲染性能统计组件类型定义
 * @author Cerror
 * @since 2025-07-17
 */

export interface ViewOption {
  value: string;
  label: string;
}

export interface RenderStatsData {
  // 场景物体数量
  objectCount: number;
  // 顶点数量
  vertexCount: number;
  // 三角面数量
  triangleCount: number;
}

export interface RenderStatsProps {
  // 当前视图模式
  currentView: string;
  // 视图选项列表
  viewOptions: ViewOption[];
  // 实时渲染统计数据（可选，如果不提供则显示默认值）
  stats?: RenderStatsData;
  // 自定义CSS类名（可选）
  className?: string;
} 