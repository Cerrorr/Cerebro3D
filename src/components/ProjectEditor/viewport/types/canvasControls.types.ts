import type { ViewType, CanvasSettings } from './Canvas3D.types';

/**
 * CanvasControls组件属性接口
 * @author Cerror
 * @since 2025-07-08
 */
export interface CanvasControlsProps {
  /** 当前视图类型 */
  currentView: ViewType;
  /** 3D场景设置 */
  settings: CanvasSettings;
  /** 视图重置回调 */
  onViewReset: () => void;
  /** 缩放至全屏回调 */
  onZoomExtents: () => void;
  /** 切换网格显示回调 */
  onToggleGrid: () => void;
  /** 视图切换回调 */
  onViewChange: (view: ViewType) => void;
}