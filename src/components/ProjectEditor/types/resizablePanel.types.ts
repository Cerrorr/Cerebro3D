/**
 * 可调整面板组件类型定义
 * 包含ResizablePanel组件相关的所有类型声明
 * @author Cerror
 * @since 2025-06-24
 */

import React from 'react';

/**
 * 可调整面板组件属性接口
 * 定义可调整大小面板的配置选项和回调函数
 * 
 * @interface ResizablePanelProps
 * @property {React.ReactNode} children - 面板内容
 * @property {number} [initialHeight=120] - 初始高度（像素）
 * @property {number} [minHeight=0] - 最小高度（像素）
 * @property {number} [maxHeight=300] - 最大高度（像素）
 * @property {'top' | 'bottom'} [position='bottom'] - 面板位置
 * @property {(height: number) => void} [onHeightChange] - 高度变更回调函数
 */
export interface ResizablePanelProps {
  /** 面板内容 */
  children: React.ReactNode;
  /** 初始高度（像素，默认120） */
  initialHeight?: number;
  /** 最小高度（像素，默认0） */
  minHeight?: number;
  /** 最大高度（像素，默认300） */
  maxHeight?: number;
  /** 面板位置（默认bottom） */
  position?: 'top' | 'bottom';
  /** 高度变更回调函数 */
  onHeightChange?: (height: number) => void;
}

/**
 * 可调整面板内部状态接口
 * 定义面板组件的内部状态类型
 * 
 * @interface ResizablePanelState
 * @property {number} height - 当前高度
 * @property {boolean} isDragging - 是否正在拖拽
 */
export interface ResizablePanelState {
  /** 当前高度（像素） */
  height: number;
  /** 是否正在拖拽调整大小 */
  isDragging: boolean;
} 