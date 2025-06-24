import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { SidebarMenuItem, MenuClickHandler } from '../../types';
import './styles/SidebarMenu.scss';

/**
 * 侧边栏菜单组件属性接口
 * 定义侧边栏菜单组件所需的所有属性类型
 * 
 * @interface SidebarMenuProps
 * @property {readonly SidebarMenuItem[]} items - 菜单项数组（只读）
 * @property {MenuClickHandler} onItemClick - 菜单项点击事件处理函数
 */
interface SidebarMenuProps {
  /** 菜单项列表 */
  readonly items: readonly SidebarMenuItem[];
  /** 菜单项点击回调函数 */
  readonly onItemClick: MenuClickHandler;
}

/**
 * 侧边栏菜单组件
 * 展示导航菜单列表，使用 Ant Design Menu 组件
 * 
 * @param items - 菜单项列表
 * @param onItemClick - 菜单项点击回调
 * @author Cerror
 * @since 2025-06-23
 */
const SidebarMenu: React.FC<SidebarMenuProps> = ({ items, onItemClick }) => {
  /**
   * 将内部菜单项转换为 Ant Design Menu 项格式
   */
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.id,
    icon: <span className="menu-icon-emoji">{item.icon}</span>,
    label: item.label,
    className: item.active ? 'active-menu-item' : undefined,
  }));

  /**
   * 获取当前选中的菜单项keys
   */
  const selectedKeys = items.filter(item => item.active).map(item => item.id);

  /**
   * 处理菜单项点击事件
   * @param menuInfo - Ant Design 菜单点击信息
   */
  const handleMenuClick: MenuProps['onClick'] = (menuInfo) => {
    const clickedItem = items.find(item => item.id === menuInfo.key);
    if (clickedItem) {
      onItemClick(clickedItem);
    }
  };

  return (
    <nav className="sidebar-menu">
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
        className="sidebar-antd-menu"
      />
    </nav>
  );
};

export default SidebarMenu; 