/**
 * 动画面板组件类型定义
 * @author Cerror
 * @since 2025-06-25
 */

import type { AnimationEditorState } from './bottomPanel.types';

/**
 * 动画面板组件属性接口
 */
export interface AnimationPanelProps {
  /** 动画编辑器状态 */
  animationState: AnimationEditorState;
  /** 对象选择回调 */
  onObjectSelect?: (objectId: string) => void;
} 