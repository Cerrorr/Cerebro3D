import React from 'react';
import CarouselSection from './CarouselSection';
import ProjectGrid from './ProjectGrid';
import { MainContentProps } from './types';
import './styles/MainContent.scss';

// 类型声明已移至 @/components/homePage/mainContent/types/MainContent.types.ts

/**
 * 主内容区组件
 * @param carouselItems 轮播图数据
 * @param projects 项目列表数据
 * @param onProjectClick 项目点击处理函数
 * @param onNewProject 新建项目处理函数
 */
const MainContent: React.FC<MainContentProps> = ({
  carouselItems,
  projects,
  onProjectClick,
  onNewProject,
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
