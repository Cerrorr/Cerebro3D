import { useState, useCallback } from 'react';
import { RightSidebarTabType } from '@/components/projectEditor/rightPanels/types';

interface UseRightSidebarStateOptions {
  defaultTab: RightSidebarTabType;
  defaultCollapsed?: boolean;
}

interface UseRightSidebarStateResult {
  collapsed: boolean;
  currentTab: RightSidebarTabType;
  toggleCollapsed: () => void;
  handleTabChange: (tab: RightSidebarTabType) => void;
}

/**
 * useRightSidebarState
 * 封装 RightSidebar 的折叠/标签页状态及基本回调
 * 详细的面板内部 state 将在后续迭代拆分
 */
export const useRightSidebarState = (
  options: UseRightSidebarStateOptions
): UseRightSidebarStateResult => {
  const { defaultTab, defaultCollapsed = false } = options;
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [currentTab, setCurrentTab] = useState<RightSidebarTabType>(defaultTab);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tab: RightSidebarTabType) => {
    setCurrentTab(tab);
  }, []);

  return {
    collapsed,
    currentTab,
    toggleCollapsed,
    handleTabChange,
  };
}; 