/**
 * 底部面板头部组件类型定义
 * @author Cerror
 * @since 2025-06-25
 */

import type { 
  BottomPanelType,
  AnimationEditorState
} from './BottomPanel.types';

/**
 * 底部面板头部组件属性接口
 */
export interface BottomPanelHeaderProps {
  // 当前激活的面板类型
  activeType: BottomPanelType;
  // 面板类型变化回调
  onTypeChange: (type: BottomPanelType) => void;
  // 动画编辑器状态
  animationState?: AnimationEditorState;
  // 动画播放/暂停回调
  onAnimationPlayPause?: () => void;
  // 上一帧回调
  onPreviousFrame?: () => void;
  // 下一帧回调
  onNextFrame?: () => void;
  // 时间格式化函数
  formatTime?: (seconds: number) => string;
} 