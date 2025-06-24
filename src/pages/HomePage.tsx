import React, { useState } from 'react';
import {
  SidebarMenuItem,
  AppInfo,
  CarouselItem,
  ProjectItem,
  ProjectType,
  MenuClickHandler,
  ProjectClickHandler,
  NewProjectFormData
} from '@/types/common.types';
import Sidebar from '@/components/Sidebar/Sidebar';
import MainContent from '@/components/MainContent/MainContent';
import { BaiduAnalytics, usePageTracking } from '@/utils/analytics';

import './styles/HomePage.scss';

// NewProjectFormData类型已在 @/types/common.types 中定义

/**
 * 首页组件
 * 整合侧边栏和主内容区，展示3D编辑器主界面
 * @author Cerror
 * @since 2025-06-24
 */
const HomePage: React.FC = () => {
  // 页面访问追踪
  usePageTracking('/', '3D编辑器首页');

  // 应用信息
  const appInfo: AppInfo = {
    name: '3D Editor',
    version: '1.0.0',
    author: 'Cerror',
    license: '京ICP备2025130821号',
    licenseUrl: 'https://beian.miit.gov.cn/'
  };

  // 侧边栏菜单配置
  const menuItems: SidebarMenuItem[] = [
    {
      id: 'projects',
      label: '项目中心',
      icon: '📁',
      path: '/projects',
      active: true
    },
    {
      id: 'resources',
      label: '资源中心',
      icon: '🎨',
      path: '/resources'
    },
    {
      id: 'settings',
      label: '设置中心',
      icon: '⚙️',
      path: '/settings'
    },
    {
      id: 'about',
      label: '关于',
      icon: 'ℹ️',
      path: '/about'
    }
  ];

  // 轮播图数据
  const carouselItems: CarouselItem[] = [
    {
      id: '1',
      title: '欢迎使用 3D Editor',
      description: '强大的Web3D编辑器，让创作更简单',
      image: '' // 使用渐变背景
    },
    {
      id: '2',
      title: '创建精美的3D场景',
      description: '拖拽式操作，所见即所得',
      image: '' // 使用渐变背景
    },
    {
      id: '3',
      title: '实时预览与发布',
      description: '一键发布到Web，随时随地访问',
      image: '' // 使用渐变背景
    }
  ];

  // 项目数据 - 更丰富的示例
  const [projects] = useState<ProjectItem[]>([
    {
      id: '1',
      title: '星空堡垒',
      description: '一个充满科幻感的3D太空城市场景，包含动态光效和粒子系统',
      thumbnail: '', // 使用渐变背景占位符
      type: 'Web3D',
      tags: ['科幻', '城市', '建筑', '光效'],
      createdAt: '2025-06-15',
      updatedAt: '2025-06-20'
    },
    {
      id: '2',
      title: '虚拟城市漫游',
      description: 'VR虚拟现实城市漫游体验，支持手势交互和空间定位',
      thumbnail: '', // 使用渐变背景占位符
      type: 'VR',
      tags: ['VR', '城市', '漫游', '交互'],
      createdAt: '2025-06-10',
      updatedAt: '2025-06-18'
    },
    {
      id: '3',
      title: 'AR家具预览',
      description: 'AR增强现实家具展示应用，实时渲染家具在真实环境中的效果',
      thumbnail: '', // 使用渐变背景占位符
      type: 'AR',
      tags: ['AR', '家具', '预览', '移动端'],
      createdAt: '2025-06-05',
      updatedAt: '2025-06-15'
    },
    {
      id: '4',
      title: '梦幻森林探险',
      description: '沉浸式3D冒险游戏，探索神秘的魔法森林世界',
      thumbnail: '', // 使用渐变背景占位符
      type: 'Game',
      tags: ['游戏', '冒险', '魔法', '森林'],
      createdAt: '2025-06-08',
      updatedAt: '2025-06-22'
    },
    {
      id: '5',
      title: '产品展示中心',
      description: '企业级产品3D展示平台，支持多角度查看和交互操作',
      thumbnail: '', // 使用渐变背景占位符
      type: 'Web3D',
      tags: ['企业', '产品', '展示', '交互'],
      createdAt: '2025-06-12',
      updatedAt: '2025-06-19'
    },
    {
      id: '6',
      title: '虚拟展厅',
      description: 'VR虚拟展览厅，为艺术作品和展品提供沉浸式展示体验',
      thumbnail: '', // 使用渐变背景占位符
      type: 'VR',
      tags: ['展览', '艺术', '虚拟', '沉浸'],
      createdAt: '2025-06-03',
      updatedAt: '2025-06-16'
    },
    {
      id: '7',
      title: '手机应用原型',
      description: '移动端3D应用原型设计，包含用户界面和交互流程演示',
      thumbnail: '', // 使用渐变背景占位符
      type: 'App',
      tags: ['移动端', '原型', '设计', 'UI'],
      createdAt: '2025-06-07',
      updatedAt: '2025-06-21'
    },
    {
      id: '8',
      title: '建筑可视化',
      description: '现代建筑设计可视化项目，真实还原建筑外观和内部结构',
      thumbnail: '', // 使用渐变背景占位符
      type: 'Web3D',
      tags: ['建筑', '可视化', '设计', '现代'],
      createdAt: '2025-06-04',
      updatedAt: '2025-06-17'
    },
    {
      id: '9',
      title: '医疗培训VR',
      description: '医疗手术培训虚拟现实平台，提供安全的手术练习环境',
      thumbnail: '',
      type: 'VR',
      tags: ['医疗', '培训', '手术', '虚拟现实'],
      createdAt: '2025-06-02',
      updatedAt: '2025-06-18'
    },
    {
      id: '10',
      title: '智能工厂巡检',
      description: 'AR增强现实工厂设备巡检系统，实时显示设备状态和维护信息',
      thumbnail: '',
      type: 'AR',
      tags: ['工厂', '巡检', 'AR', '智能制造'],
      createdAt: '2025-06-09',
      updatedAt: '2025-06-23'
    },
    {
      id: '11',
      title: '太空模拟器',
      description: '太空探索模拟游戏，体验真实的宇宙物理和太空任务',
      thumbnail: '',
      type: 'Game',
      tags: ['太空', '模拟', '物理', '探索'],
      createdAt: '2024-01-11',
      updatedAt: '2024-01-24'
    },
    {
      id: '12',
      title: '在线教育平台',
      description: '3D交互式在线教育应用，让学习更加生动有趣',
      thumbnail: '',
      type: 'App',
      tags: ['教育', '在线学习', '交互', '3D'],
      createdAt: '2024-01-06',
      updatedAt: '2024-01-25'
    },
    {
      id: '13',
      title: '数字孪生城市',
      description: '城市数字孪生平台，实时监控和分析城市运行状态',
      thumbnail: '',
      type: 'Web3D',
      tags: ['数字孪生', '城市', '监控', '大数据'],
      createdAt: '2024-01-13',
      updatedAt: '2024-01-26'
    },
    {
      id: '14',
      title: '虚拟购物中心',
      description: 'VR虚拟购物体验，在家中享受逛街购物的乐趣',
      thumbnail: '',
      type: 'VR',
      tags: ['购物', '电商', 'VR', '体验'],
      createdAt: '2024-01-14',
      updatedAt: '2024-01-27'
    },
    {
      id: '15',
      title: '文物保护AR',
      description: 'AR文物数字化保护和展示应用，让历史文物重获新生',
      thumbnail: '',
      type: 'AR',
      tags: ['文物', '保护', '数字化', '历史'],
      createdAt: '2024-01-16',
      updatedAt: '2024-01-28'
    }
  ]);

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
    
    // TODO: 打开项目编辑器
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
    
    // TODO: 创建新项目并添加到项目列表
    // 这里可以调用API创建项目，然后更新状态
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