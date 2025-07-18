/**
 * SidebarFooter组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { SidebarFooterProps } from './types';
import './styles/SidebarFooter.scss';

// 类型声明已移至 @/components/homePage/sidebar/types/SidebarFooter.types.ts

// 侧边栏底部组件
// 展示版本号、制作人、备案号等信息
const SidebarFooter: React.FC<SidebarFooterProps> = ({ appInfo }) => {
  // 处理备案号点击事件
  // 打开工信部备案管理系统链接
  const handleLicenseClick = (): void => {
    if (appInfo.licenseUrl) {
      window.open(appInfo.licenseUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="sidebar-footer">
      <div className="app-info">
        <div className="version">Version {appInfo.version}</div>
        <div className="author">Made by {appInfo.author}</div>
        {appInfo.licenseUrl ? (
          <div className="license clickable" onClick={handleLicenseClick}>
            {appInfo.license}
          </div>
        ) : (
          <div className="license">{appInfo.license}</div>
        )}
      </div>
    </div>
  );
};

export default SidebarFooter;
