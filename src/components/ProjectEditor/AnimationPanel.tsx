import React from 'react';
import type { AnimationEditorState } from './types';

/**
 * 动画面板组件属性接口
 */
interface AnimationPanelProps {
  /** 动画编辑器状态 */
  animationState: AnimationEditorState;
  /** 对象选择回调 */
  onObjectSelect?: (objectId: string) => void;
}

/**
 * 动画面板组件
 * 提供动画时间轴编辑和关键帧管理功能
 * @author Cerror
 * @since 2025-06-25
 */
const AnimationPanel: React.FC<AnimationPanelProps> = ({
  animationState,
  onObjectSelect
}) => {
  return (
    <div className="animation-content">
      {/* 动画编辑器主要内容区域 */}
      <div className="animation-main">
        {!animationState.hasSelectedObject ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="16" y="24" width="32" height="24" rx="2" fill="#4A5568" opacity="0.6"/>
                <circle cx="32" cy="36" r="2" fill="#68D391"/>
                <path d="M30 38c0 1.1.9 2 2 2s2-.9 2-2" stroke="#68D391" strokeWidth="1" fill="none"/>
              </svg>
            </div>
            <div className="empty-title">Empty</div>
            <div className="empty-description">未选择任何对象。</div>
          </div>
        ) : (
          <div className="timeline-container">
            {/* 时间轴内容将在这里显示 */}
            <div className="timeline-placeholder">
              时间轴编辑区域
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimationPanel; 