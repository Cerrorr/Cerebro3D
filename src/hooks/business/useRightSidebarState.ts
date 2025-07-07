import { useState, useCallback } from 'react';
import type {
  UseRightSidebarStateOptions,
  UseRightSidebarStateResult
} from './types/useRightSidebarState.types';
import type { RightSidebarTabType } from '@/components/projectEditor/rightPanels/types';

// 右侧边栏状态管理Hook
// 封装 RightSidebar 的折叠/标签页状态及基本回调
/**
 * useRightSidebarState
 * @param options 配置选项
 * @returns Hook返回值，包含状态和操作方法
 */
export const useRightSidebarState = (
  options: UseRightSidebarStateOptions
): UseRightSidebarStateResult => {
  const { defaultTab, defaultCollapsed = false } = options;
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [currentTab, setCurrentTab] = useState<RightSidebarTabType>(defaultTab);

  // 切换折叠状态
  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  /**
   * 处理标签页切换
   * @param tab - 要切换到的标签页类型
   */
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