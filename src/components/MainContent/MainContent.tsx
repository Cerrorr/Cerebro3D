import React from 'react';
import CarouselSection from '@/components/MainContent/CarouselSection';
import ProjectGrid from '@/components/MainContent/ProjectGrid';
import { MainContentProps } from '@/components/MainContent/types';
import './styles/MainContent.scss';

// 类型声明已移至 @/components/MainContent/types/mainContent.types.ts

/**
 * 主内容区组件
 * 包含轮播图和项目网格展示，支持新建项目功能
 * 
 * @param carouselItems - 轮播图数据
 * @param projects - 项目列表数据
 * @param onProjectClick - 项目点击处理函数
 * @param onNewProject - 新建项目处理函数
 * @author Cerror
 * @since 2025-06-24
 */
const MainContent: React.FC<MainContentProps> = ({
  carouselItems,
  projects,
  onProjectClick,
  onNewProject
}) => {
  return (
    <main className="main-content">
      <CarouselSection items={carouselItems} />
      <ProjectGrid 
        projects={projects}
        onProjectClick={onProjectClick}
        onNewProject={onNewProject}
      />
    </main>
  );
};

export default MainContent; 