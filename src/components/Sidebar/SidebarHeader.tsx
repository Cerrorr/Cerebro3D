import React from 'react';
import './styles/SidebarHeader.scss';

/**
 * 侧边栏头部组件属性接口
 * @param appName - 应用名称
 */
interface SidebarHeaderProps {
  appName: string;
}

/**
 * 侧边栏头部组件
 * 展示应用logo和名称
 */
const SidebarHeader: React.FC<SidebarHeaderProps> = ({ appName }) => {
  return (
    <div className="sidebar-header">
      <div className="logo-container">
        <div className="logo-icon">🚀</div>
        <h1 className="logo-text">{appName}</h1>
      </div>
    </div>
  );
};

export default SidebarHeader; 