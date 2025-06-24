import React from 'react';
import { NewProjectCardProps } from '@/components/MainContent/types';
import './styles/NewProjectCard.scss';

// 类型声明已移至 @/components/MainContent/types/mainContent.types.ts

/**
 * 新建项目卡片组件
 * 显示在项目列表第一位，用于创建新项目
 * 
 * @param onClick - 点击处理函数
 * @author Cerror
 * @since 2025-06-24
 */
const NewProjectCard: React.FC<NewProjectCardProps> = ({ onClick }) => {
  return (
    <article className="new-project-card" onClick={onClick}>
      <div className="new-card-content">
        {/* 新建图标 */}
        <div className="new-icon-container">
          <div className="new-icon">
            <span className="plus-icon">+</span>
          </div>
        </div>
        
        {/* 新建文本 */}
        <div className="new-text">
          <h3 className="new-title">新建项目</h3>
          <p className="new-description">创建一个全新的3D项目</p>
        </div>
        
        {/* 装饰性元素 */}
        <div className="decoration-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      
      {/* 悬浮效果背景 */}
      <div className="hover-overlay"></div>
    </article>
  );
};

export default NewProjectCard; 