import React from 'react';
import { ProjectItem } from '../../types';
import './styles/ProjectCard.scss';

/**
 * 项目卡片组件属性接口
 */
interface ProjectCardProps {
  /** 项目数据 */
  project: ProjectItem;
  /** 项目点击事件处理函数 */
  onClick: (project: ProjectItem) => void;
}

/**
 * 获取项目类型对应的渐变背景和图标
 * @param type - 项目类型
 */
const getProjectTypeStyle = (type: string) => {
  const typeStyles = {
    'Web3D': {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🌐',
      color: '#667eea'
    },
    'VR': {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
      icon: '🥽',
      color: '#f093fb'
    },
    'AR': {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '📱',
      color: '#4facfe'
    },
    'Game': {
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: '🎮',
      color: '#43e97b'
    },
    'App': {
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: '📱',
      color: '#fa709a'
    }
  };
  
  return typeStyles[type as keyof typeof typeStyles] || typeStyles['Web3D'];
};

/**
 * 项目卡片组件
 * 展示单个项目的缩略图、信息和操作按钮
 * 
 * @param project - 项目数据对象
 * @param onClick - 项目点击处理函数
 * @author Cerror
 * @since 2025-06-23
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
          {project.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="tag tag-more">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* 卡片底部信息 */}
        <div className="card-footer">
          <div className="update-date">
            <span>📅</span>
            <span>更新于 {formatDate(project.updatedAt)}</span>
          </div>
          
          <div className="card-actions">
            <button 
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                console.log('编辑项目:', project.title);
              }}
              aria-label="编辑项目"
            >
              ✏️
            </button>
            <button 
              className="action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                console.log('删除项目:', project.title);
              }}
              aria-label="删除项目"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
