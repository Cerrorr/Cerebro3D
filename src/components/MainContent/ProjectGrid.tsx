import React, { useState } from 'react';
import { ProjectItem, ProjectClickHandler } from '@/types';
import { ProjectType } from '@/types/common.types';
import ProjectCard from '@/components/MainContent/ProjectCard';
import NewProjectCard from '@/components/MainContent/NewProjectCard';
import NewProjectModal from '@/components/MainContent/NewProjectModal';
import './styles/NewProjectCard.scss';

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
 * 项目网格组件属性接口
 * 定义项目网格组件所需的所有属性类型
 * 
 * @interface ProjectGridProps
 * @property {readonly ProjectItem[]} projects - 项目数据数组（只读）
 * @property {ProjectClickHandler} onProjectClick - 项目点击事件处理函数
 * @property {(formData: NewProjectFormData) => void} onNewProject - 新建项目处理函数
 */
interface ProjectGridProps {
  /** 项目列表 */
  readonly projects: readonly ProjectItem[];
  /** 项目点击回调函数 */
  readonly onProjectClick: ProjectClickHandler;
  /** 新建项目处理函数 */
  readonly onNewProject: (formData: NewProjectFormData) => void;
}

/**
 * 项目网格组件
 * 响应式展示项目卡片，每行1-4个项目，包含新建项目功能
 * @author Cerror
 * @since 2025-06-24
 */
const ProjectGrid: React.FC<ProjectGridProps> = ({ 
  projects, 
  onProjectClick,
  onNewProject
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 处理新建项目弹窗打开
   */
  const handleNewProjectClick = () => {
    setIsModalOpen(true);
  };

  /**
   * 处理新建项目弹窗关闭
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  /**
   * 处理新建项目确认
   * @param formData - 新建项目表单数据
   */
  const handleNewProjectConfirm = (formData: NewProjectFormData) => {
    onNewProject(formData);
    setIsModalOpen(false);
  };

  return (
    <section className="project-grid">
      {/* 固定标题区域 */}
      <div className="grid-header">
        <h2 className="grid-title">我的项目</h2>
        <div className="project-count">{projects.length} 个项目</div>
      </div>
      
      {/* 可滚动的卡片区域 */}
      <div className="grid-container">
        <div className="grid-layout">
          {/* 新建项目卡片 - 始终在第一位 */}
          <NewProjectCard onClick={handleNewProjectClick} />
          
          {/* 现有项目卡片 */}
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectClick(project)}
            />
          ))}
          
          {/* 空状态提示（仅在没有项目时显示） */}
          {projects.length === 0 && (
            <div className="empty-state-inline">
              <p className="empty-text">还没有其他项目，点击左侧新建开始创作吧！</p>
            </div>
          )}
        </div>
      </div>

      {/* 新建项目弹窗 */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleNewProjectConfirm}
      />
    </section>
  );
};

export default ProjectGrid; 