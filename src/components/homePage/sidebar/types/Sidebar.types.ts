/**
 * 侧边栏主组件 Sidebar 类型定义，仅包含 SidebarProps
 * 依赖子组件独立类型文件
 * @author Cerror
 * @since 2025-06-29
 */

import type { SidebarMenuItem, MenuClickHandler } from './SidebarMenu.types';
import type { AppInfo } from './SidebarFooter.types';

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
