import React from 'react';
import { CarouselItem, ProjectItem, ProjectClickHandler } from '../../types';
import { ProjectType } from '../../types/common.types';
import CarouselSection from './CarouselSection';
import ProjectGrid from './ProjectGrid';
import './styles/MainContent.scss';

/**
 * 新建项目表单数据接口
 * 
 * @interface NewProjectFormData
 * @property {string} name - 项目名称
 * @property {ProjectType} category - 项目分类
 * @property {string} description - 项目说明
 * @property {string} templateId - 选中的模板ID
 */
interface NewProjectFormData {
  name: string;
  category: ProjectType;
  description: string;
  templateId: string;
}

/**
 * 主内容区组件属性接口
 * 定义主内容区组件所需的所有属性类型
 * 
 * @interface MainContentProps
 * @property {readonly CarouselItem[]} carouselItems - 轮播图数据数组（只读）
 * @property {readonly ProjectItem[]} projects - 项目数据数组（只读）
 * @property {ProjectClickHandler} onProjectClick - 项目点击事件处理函数
 * @property {(formData: NewProjectFormData) => void} onNewProject - 新建项目处理函数
 */
interface MainContentProps {
  /** 轮播图项目列表 */
  readonly carouselItems: readonly CarouselItem[];
  /** 项目列表 */
  readonly projects: readonly ProjectItem[];
  /** 项目点击事件处理函数 */
  readonly onProjectClick: ProjectClickHandler;
  /** 新建项目处理函数 */
  readonly onNewProject: (formData: NewProjectFormData) => void;
}

/**
 * 主内容区组件
 * 包含轮播图和项目网格展示，支持新建项目功能
 * 
 * @param carouselItems - 轮播图数据
 * @param projects - 项目列表数据
 * @param onProjectClick - 项目点击处理函数
 * @param onNewProject - 新建项目处理函数
 * @author Cerror
 * @since 2025-06-23
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