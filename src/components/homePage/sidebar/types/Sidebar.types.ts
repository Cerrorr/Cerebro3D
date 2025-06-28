/**
 * 侧边栏组件类型定义
 * 包含侧边栏相关的组件Props和事件处理器类型
 * @author Cerror
 * @since 2025-06-24
 */

import { SidebarMenuItem, AppInfo, MenuClickHandler } from '@/types/Common.types';

/**
 * 侧边栏组件属性接口
 * 定义侧边栏组件所需的所有属性类型
 * 
 * @interface SidebarProps
 * @property {readonly SidebarMenuItem[]} menuItems - 菜单项数组（只读）
 * @property {AppInfo} appInfo - 应用程序信息对象
 * @property {MenuClickHandler} onMenuClick - 菜单项点击事件处理函数
 */
export interface SidebarProps {
  /** 菜单项列表 */
  readonly menuItems: readonly SidebarMenuItem[];
  /** 应用信息 */
  readonly appInfo: AppInfo;
  /** 菜单点击事件处理函数 */
  readonly onMenuClick: MenuClickHandler;
}

/**
 * 侧边栏头部组件属性接口
 * 
 * @interface SidebarHeaderProps
 * @property {string} appName - 应用程序名称
 */
export interface SidebarHeaderProps {
  /** 应用程序名称 */
  readonly appName: string;
}

/**
 * 侧边栏菜单组件属性接口
 * 定义侧边栏菜单组件所需的所有属性类型
 * 
 * @interface SidebarMenuProps
 * @property {readonly SidebarMenuItem[]} items - 菜单项数组（只读）
 * @property {MenuClickHandler} onItemClick - 菜单项点击事件处理函数
 */
export interface SidebarMenuProps {
  /** 菜单项列表 */
  readonly items: readonly SidebarMenuItem[];
  /** 菜单项点击回调函数 */
  readonly onItemClick: MenuClickHandler;
}

/**
 * 侧边栏底部组件属性接口
 * 
 * @interface SidebarFooterProps
 * @property {AppInfo} appInfo - 应用程序信息对象
 */
export interface SidebarFooterProps {
  /** 应用信息 */
  readonly appInfo: AppInfo;
} 