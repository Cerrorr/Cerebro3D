/**
 * 右侧栏组件类型定义
 * 包含RightSidebar组件相关的所有类型声明
 * @author Cerror
 * @since 2025-06-25
 */

import { ReactNode } from 'react';

/**
 * 右侧栏标签页类型
 * 定义右侧栏支持的功能模块
 */
export type RightSidebarTabType = 
  | 'scene'        // 场景配置
  | 'camera'       // 相机配置
  | 'lighting'     // 灯光配置  
  | 'renderer'     // 渲染器配置
  | 'postprocess'  // 后期处理
  | 'weather'      // 天气设置
  | 'history'      // 历史记录
  | 'object'       // 对象
  | 'geometry'     // 几何
  | 'material'     // 材质
  | 'animation'    // 动画
  | 'script';      // 脚本

/**
 * 右侧栏标签项配置接口
 * 定义单个标签的配置信息
 */
export interface RightSidebarTabItem {
  /** 标签唯一标识 */
  id: RightSidebarTabType;
  /** 标签显示名称 */
  label: string;
  /** 标签图标 */
  icon: ReactNode;
  /** 是否启用 */
  enabled?: boolean;
  /** 是否为分割线 */
  isDivider?: boolean;
  /** 标签组别（用于分组显示） */
  group?: 'config' | 'content';
}

/**
 * 右侧栏组件属性接口
 * 定义RightSidebar组件的配置选项
 */
export interface RightSidebarProps {
  /** 当前激活的标签 */
  activeTab?: RightSidebarTabType;
  /** 标签切换回调 */
  onTabChange?: (tab: RightSidebarTabType) => void;
  /** 是否显示右侧栏 */
  visible?: boolean;
  /** 右侧栏宽度 */
  width?: number;
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 默认折叠状态 */
  defaultCollapsed?: boolean;
}

/**
 * 右侧栏内容区域属性接口
 * 定义内容区域的配置
 */
export interface RightSidebarContentProps {
  /** 当前激活的标签 */
  activeTab: RightSidebarTabType;
  /** 内容区域高度 */
  height?: number;
}

/**
 * 右侧栏状态接口
 * 定义组件内部状态
 */
export interface RightSidebarState {
  /** 当前激活的标签 */
  activeTab: RightSidebarTabType;
  /** 是否折叠 */
  collapsed: boolean;
} 