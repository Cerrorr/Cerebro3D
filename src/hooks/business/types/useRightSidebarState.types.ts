import { RightSidebarTabType } from '../../../components/projectEditor/rightPanels/types';

/**
 * 右侧边栏状态管理Hook选项
 * @author Cerror
 * @since 2025-07-08 */
export interface UseRightSidebarStateOptions {
  // 默认标签页
  defaultTab: RightSidebarTabType;
  // 是否默认折叠，默认为 false
  defaultCollapsed?: boolean;
}

/**
 * 右侧边栏状态管理Hook返回值
 */
export interface UseRightSidebarStateResult {
  // 是否折叠
  collapsed: boolean;
  // 当前激活的标签页
  currentTab: RightSidebarTabType;
  // 切换折叠状态
  toggleCollapsed: () => void;
  // 处理标签页切换
  handleTabChange: (tab: RightSidebarTabType) => void;
}