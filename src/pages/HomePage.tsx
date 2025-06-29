import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarMenuItem,
  ProjectItem,
  MenuClickHandler,
  ProjectClickHandler,
  NewProjectFormData
} from '@/components/homePage/types';
import { 
  APP_INFO, 
  SIDEBAR_MENU_ITEMS, 
  HOME_CAROUSEL_ITEMS, 
  HOME_PROJECT_ITEMS 
} from './constants';
import { Sidebar, MainContent } from '@/components/homePage';
import { BaiduAnalytics, usePageTracking } from '@/utils/analytics';

import './styles/HomePage.scss';

// NewProjectFormData类型已在 @/types/Common.types 中定义

/**
 * 首页组件
 * 整合侧边栏和主内容区，展示3D编辑器主界面
 * @author Cerror
 * @since 2025-06-25
 */
const HomePage: React.FC = () => {
  // 页面访问追踪
  usePageTracking('/', 'Cerebro3D首页');
  
  // 路由导航hook
  const navigate = useNavigate();

  // 从常量文件导入配置数据
  const appInfo = APP_INFO;
  const menuItems = SIDEBAR_MENU_ITEMS;
  const carouselItems = HOME_CAROUSEL_ITEMS;
  const [projects] = useState<ProjectItem[]>([...HOME_PROJECT_ITEMS]);

  /**
   * 处理菜单点击事件
   * 当用户点击侧边栏菜单项时触发，用于导航到对应页面
   * @param item - 被点击的菜单项对象
   * @returns void
   */
  const handleMenuClick: MenuClickHandler = (item: SidebarMenuItem): void => {
    // 追踪菜单点击事件
    BaiduAnalytics.trackMenu.click(item.id, item.label);
    
    // TODO: 实现路由跳转
  };

  /**
   * 处理项目点击事件
   * 当用户点击项目卡片时触发，用于打开项目编辑器
   * @param project - 被点击的项目对象
   * @returns void
   */
  const handleProjectClick: ProjectClickHandler = (project: ProjectItem): void => {
    // 追踪项目打开事件
    BaiduAnalytics.trackProject.open(project.id, project.type);
    
    // 跳转到项目编辑页面
    navigate(`/project/${project.id}`, { 
      state: { 
        projectTitle: project.title,
        projectType: project.type 
      } 
    });
  };

  /**
   * 处理新建项目
   * 当用户确认创建新项目时触发
   * @param formData - 新建项目表单数据
   * @returns void
   */
  const handleNewProject = (formData: NewProjectFormData): void => {
    // 追踪项目创建事件
    BaiduAnalytics.trackProject.create(formData.category);
    
    // 生成新项目ID
    const newProjectId = `project_${Date.now()}`;
    
    // 跳转到新项目编辑页面
    navigate(`/project/${newProjectId}`, { 
      state: { 
        projectTitle: formData.name,
        projectType: formData.category,
        isNewProject: true 
      } 
    });
  };

  return (
    <div className="home-page">
      <Sidebar 
        menuItems={menuItems}
        appInfo={appInfo}
        onMenuClick={handleMenuClick}
      />
      <MainContent 
        carouselItems={carouselItems}
        projects={projects}
        onProjectClick={handleProjectClick}
        onNewProject={handleNewProject}
      />
    </div>
  );
};

export default HomePage; 