/**
 * 侧边栏菜单组件类型定义
 * 仅供 SidebarMenu 组件使用
 * @author Cerror
 * @since 2025-06-29
 */

export interface SidebarMenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly path: string;
  readonly active?: boolean;
}

export type MenuClickHandler = (menuItem: SidebarMenuItem) => void;

export interface SidebarMenuProps {
  readonly items: readonly SidebarMenuItem[];
  readonly onItemClick: MenuClickHandler;
} 