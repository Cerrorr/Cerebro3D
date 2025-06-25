import React from 'react';
import { ProjectCardProps } from '@/components/MainContent/types';
import { 
  PROJECT_TYPE_STYLES, 
  DEFAULT_PROJECT_TYPE_STYLE, 
  CARD_ACTION_ICONS, 
  MAX_VISIBLE_TAGS 
} from '@/components/MainContent/constants';
import './styles/ProjectCard.scss';

/**
 * 获取项目类型对应的渐变背景和图标
 * @param type - 项目类型
 */
const getProjectTypeStyle = (type: string) => {
  return PROJECT_TYPE_STYLES[type] || DEFAULT_PROJECT_TYPE_STYLE;
};

/**
 * 项目卡片组件
 * 展示单个项目的缩略图、信息和操作按钮
 * 
 * @param project - 项目数据对象
 * @param onClick - 项目点击处理函数
 * @author Cerror
 * @since 2025-06-24
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  /**
   * 处理卡片点击事件
   */
  const handleClick = () => {
    onClick(project);
  };

  /**
   * 格式化日期显示
   * @param dateStr - 日期字符串
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const typeStyle = getProjectTypeStyle(project.type);

  return (
    <article className="project-card" onClick={handleClick}>
      <div className="card-thumbnail">
        {/* 使用渐变背景占位符替代真实图片 */}
        <div 
          className="thumbnail-placeholder"
          style={{ background: typeStyle.gradient }}
        >
          <span className="placeholder-icon">{typeStyle.icon}</span>
          <span className="placeholder-text">{project.type} 项目</span>
        </div>
        
        {/* 项目类型标签 */}
        <span className="type-badge" style={{ color: typeStyle.color }}>
          {project.type}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-description">{project.description}</p>
        
        {/* 标签列表 */}
        <div className="card-tags">
          {project.tags.slice(0, MAX_VISIBLE_TAGS).map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
          {project.tags.length > MAX_VISIBLE_TAGS && (
            <span className="tag tag-more">
              +{project.tags.length - MAX_VISIBLE_TAGS}
            </span>
          )}
        </div>

        {/* 卡片底部信息 */}
        <div className="card-footer">
          <div className="update-date">
            <span>{CARD_ACTION_ICONS.calendar}</span>
            <span>更新于 {formatDate(project.updatedAt)}</span>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: 实现编辑项目功能
              }}
              aria-label="编辑项目"
            >
              {CARD_ACTION_ICONS.edit}
            </button>
            <button 
              className="action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: 实现删除项目功能
              }}
              aria-label="删除项目"
            >
              {CARD_ACTION_ICONS.delete}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
