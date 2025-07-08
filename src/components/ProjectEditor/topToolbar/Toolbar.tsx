import React from 'react';
import { Input, Tooltip } from 'antd';
import type { ToolbarProps } from './types';
import { TOOLBAR_SHORTCUTS, TOOLBAR_TOOLTIPS } from './constants/Toolbar.constants';
import './styles/Toolbar.scss';

/**
 * 项目编辑器工具栏组件
 * 提供项目标题编辑、左右两侧工具按钮区域
 * @param props 工具栏属性
 * @returns 工具栏React组件
 * @author Cerror
 * @since 2025-07-08 */
const Toolbar: React.FC<ToolbarProps> = ({
  projectTitle,
  onTitleChange,
  leftActions,
  rightActions,
  projectLogo,
  onLogoClick
}) => {
  /**
   * 获取按钮的提示标题（包含快捷键信息）
   * @param label 按钮标签
   * @param actionId 按钮ID
   * @returns 包含快捷键的完整提示文本
   */
  const getTooltipTitle = (label: string, actionId: string): string => {
    const shortcut = TOOLBAR_SHORTCUTS[actionId];
    return shortcut ? `${label} (${shortcut})` : label;
  };

  return (
    <div className="project-toolbar">
      {/* 左侧工具区 */}
      <div className="toolbar-section toolbar-left">
        {projectLogo && (
          <Tooltip title="返回首页" placement="bottom">
            <div 
              className="project-logo clickable" 
              onClick={onLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onLogoClick?.();
                }
              }}
            >
              <img src={projectLogo} alt="Project Logo" />
            </div>
          </Tooltip>
        )}
        <div className="toolbar-actions">
          {leftActions.map((action) => (
            <Tooltip
              key={action.id}
              title={getTooltipTitle(action.label, action.id)}
              placement="bottom"
            >
              <button
                className={`toolbar-btn ${action.disabled ? 'disabled' : ''}`}
                onClick={action.onClick}
                disabled={action.disabled}
                aria-label={action.label}
              >
                {action.icon}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* 中间标题区 */}
      <div className="toolbar-section toolbar-center">
        <div className="project-title">
          <Tooltip title={TOOLBAR_TOOLTIPS.EDIT_TITLE} placement="bottom">
            <Input
              type="text"
              value={projectTitle}
              onChange={(e) => onTitleChange?.(e.target.value)}
              className="title-input"
              placeholder={TOOLBAR_TOOLTIPS.PROJECT_TITLE_PLACEHOLDER}
              variant="borderless"
              aria-label="项目标题"
            />
          </Tooltip>
        </div>
      </div>

      {/* 右侧工具区 */}
      <div className="toolbar-section toolbar-right">
        <div className="toolbar-actions">
          {rightActions.map((action) => (
            <Tooltip
              key={action.id}
              title={getTooltipTitle(action.label, action.id)}
              placement="bottom"
            >
              <button
                className={`toolbar-btn ${action.disabled ? 'disabled' : ''}`}
                onClick={action.onClick}
                disabled={action.disabled}
                aria-label={action.label}
              >
                {action.icon}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar; 