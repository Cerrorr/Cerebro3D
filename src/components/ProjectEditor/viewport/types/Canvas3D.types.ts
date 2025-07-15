/**
 * 3D画布组件类型定义
 * 包含Canvas3D组件相关的所有类型声明
 * @author Cerror
 * @since 2025-06-25
 */

/**
 * 3D视图类型枚举
 * 定义3D画布支持的视角类型
 */
export type ViewType = 'perspective' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

/**
 * 3D画布设置接口
 * 定义3D渲染环境的配置选项
 */
export interface CanvasSettings {
  // 是否显示网格
  gridVisible: boolean;
  // 是否显示坐标轴
  axisVisible: boolean;
  // 背景颜色（十六进制格式）
  backgroundColor: string;
  // 相机初始位置坐标 [x, y, z]
  cameraPosition?: [number, number, number];
}

/**
 * 3D画布组件属性接口
 */
export interface Canvas3DProps {
  // 画布宽度（可选）
  width?: number | string;
  // 画布高度（可选）
  height?: number | string;
  // CSS类名
  className?: string;
  // 对象选择回调函数
  onObjectSelect?: (objectId: string) => void;
  
  // 新增属性 - 场景配置
  backgroundColor?: string;
  enableGrid?: boolean;
  enableStats?: boolean;
  
  // 3D场景服务实例
  scene3DService?: import('@/hooks/three/services').Scene3DService;
}

/**
 * 3D场景性能统计接口
 */
export interface SceneStats {
  // 帧率
  fps: number;
  // 渲染时间（毫秒）
  renderTime: number;
  // 三角形数量
  triangles: number;
  // 顶点数量
  vertices: number;
}

/**
 * 3D画布内部状态接口
 * 定义Canvas3D组件的内部状态类型
 */
export interface Canvas3DState {
  // 是否正在加载
  isLoading: boolean;
  // 当前视图类型
  currentView: ViewType;
} 