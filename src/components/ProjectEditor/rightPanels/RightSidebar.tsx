/**
 * @author Cerror
 * @since 2025-06-29
 */
import React from 'react';
import { RightSidebarProps } from './types';
import './styles/RightSidebar.scss';
import { getTabItems, DEFAULT_CONFIG } from './constants/RightSidebar.constants';
import RightSidebarTabList from './RightSidebarTabList';
import RightSidebarContent from './RightSidebarContent';
import { useRightSidebarState } from '@/hooks/business/useRightSidebarState';
import { useRightSidebarPanelsState } from '@/hooks/business/useRightSidebarPanelsState';

/**
 * 重构后的 RightSidebar
 * 仅负责布局与组合，业务数据与交互逻辑拆分到自定义 Hook
 */
const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab = 'scene',
  visible = true,
  width = DEFAULT_CONFIG.DEFAULT_WIDTH,
  collapsible = true,
  defaultCollapsed = false,
}) => {
  /* 折叠 & 当前标签页状态 */
  const { collapsed, currentTab, toggleCollapsed, handleTabChange } = useRightSidebarState({
    defaultTab: activeTab,
    defaultCollapsed,
  });

  /* 各面板数据 + 回调 */
  const { panelsProps } = useRightSidebarPanelsState();

  const tabItems = getTabItems();

  if (!visible) return null;

  return (
    <div
      className={`right-sidebar ${collapsed ? 'right-sidebar--collapsed' : 'right-sidebar--expanded'}`}
      style={{ width: collapsed ? DEFAULT_CONFIG.COLLAPSED_WIDTH : width }}
      data-collapsed={collapsed}
    >
      <RightSidebarTabList
        tabItems={tabItems as any}
        collapsed={collapsed}
        collapsible={collapsible}
        currentTab={currentTab}
        onToggleCollapse={toggleCollapsed}
        onTabChange={handleTabChange}
        onDoubleClick={toggleCollapsed}
      />

      {!collapsed && <RightSidebarContent currentTab={currentTab} panelsProps={panelsProps} />}
    </div>
  );
};

export default RightSidebar;