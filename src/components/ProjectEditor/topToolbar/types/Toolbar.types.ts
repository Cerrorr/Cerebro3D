import React from 'react';

/**
 * 工具栏按钮操作接口
 * 定义工具栏中每个按钮的基本属性和行为
 * @author Cerror
 * @since 2025-07-08 */
export interface ToolbarAction {
  /** 按钮唯一标识符 */
  id: string;
  /** 按钮显示文本 */
  label: string;
  /** 按钮图标组件 */
  icon: React.ReactNode;
  /** 快捷键组合（可选） */
  shortcut?: string;
  /** 是否禁用状态 */
  disabled?: boolean;
  /** 点击事件处理函数 */
  onClick: () => void;
}

/**
 * 工具栏组件属性接口
 */
export interface ToolbarProps {
  /** 项目标题 */
  projectTitle: string;
  /** 标题变更回调函数 */
  onTitleChange?: (title: string) => void;
  /** 左侧工具按钮列表 */
  leftActions: ToolbarAction[];
  /** 右侧工具按钮列表 */
  rightActions: ToolbarAction[];
  /** 项目logo图片路径 */
  projectLogo?: string;
  /** logo点击回调函数 */
  onLogoClick?: () => void;
} 