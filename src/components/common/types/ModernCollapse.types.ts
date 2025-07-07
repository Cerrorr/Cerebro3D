/**
 * ModernCollapse 组件类型定义
 * @author Cerror
 * @since 2025-07-07
 */

import React from 'react';

/** Panel 组件的 Props 接口 */
export interface PanelProps {
  /** Panel 头部内容 */
  header: React.ReactNode;
  /** Panel 子内容 */
  children: React.ReactNode;
  /** Panel 唯一标识 */
  key?: string;
}

/** ModernCollapse 组件的 Props 接口 */
export interface ModernCollapseProps {
  /** Panel 子组件 */
  children: React.ReactNode;
  /** 其他 Collapse 属性 */
  [key: string]: any;
}