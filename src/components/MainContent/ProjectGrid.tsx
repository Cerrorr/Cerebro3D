import React, { useState } from 'react';
import { ProjectItem, ProjectClickHandler, NewProjectFormData } from '@/types';
import { ProjectType } from '@/types/common.types';
import ProjectCard from '@/components/MainContent/ProjectCard';
import NewProjectCard from '@/components/MainContent/NewProjectCard';
import NewProjectModal from '@/components/MainContent/NewProjectModal';
import { ProjectGridProps } from '@/components/MainContent/types';
import './styles/NewProjectCard.scss';

// 类型声明已移至 @/components/MainContent/types/mainContent.types.ts

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