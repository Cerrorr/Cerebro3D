import React from 'react';
import { SidebarHeaderProps } from './types';
import './styles/SidebarHeader.scss';

// 类型声明已移至 @/components/homePage/sidebar/types/SidebarHeader.types.ts

// 侧边栏头部组件
// 展示应用logo和名称
const SidebarHeader: React.FC<SidebarHeaderProps> = ({ appName }) => {
  return (
    <div className="sidebar-header">
      <div className="logo-container">
        <img
          src="/images/logo.png"
          alt="Cerebro3D Logo"
          className="logo-icon"
        />
        <h1 className="logo-text">{appName}</h1>
      </div>
    </div>
  );
};

export default SidebarHeader;
