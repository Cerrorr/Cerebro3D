import React from 'react';
import { SidebarProps } from '@/components/Sidebar/types/sidebar.types';
import SidebarHeader from '@/components/Sidebar/SidebarHeader';
import SidebarMenu from '@/components/Sidebar/SidebarMenu';
import SidebarFooter from '@/components/Sidebar/SidebarFooter';
import './styles/Sidebar.scss';

/**
 * 侧边栏组件
 * 包含应用logo、导航菜单和应用信息
 * 
 * @param menuItems - 菜单项列表
 * @param appInfo - 应用信息（名称、版本、作者、备案号）
 * @param onMenuClick - 菜单项点击处理函数
 * @author Cerror
 * @since 2025-06-24
 */
const Sidebar: React.FC<SidebarProps> = ({ 
  menuItems, 
  appInfo, 
  onMenuClick 
}) => {
  return (
    <aside className="sidebar">
      <SidebarHeader appName={appInfo.name} />
      <SidebarMenu 
        items={menuItems} 
        onItemClick={onMenuClick}
      />
      <SidebarFooter appInfo={appInfo} />
    </aside>
  );
};

export default Sidebar; 