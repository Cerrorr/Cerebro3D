import React from 'react';
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
 * 展示导航菜单列表
 */
const SidebarMenu: React.FC<SidebarMenuProps> = ({ items, onItemClick }) => {
  return (
    <nav className="sidebar-menu">
      <ul className="menu-list">
        {items.map((item) => (
          <li 
            key={item.id} 
            className={`menu-item ${item.active ? 'active' : ''}`}
            onClick={() => onItemClick(item)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarMenu; 