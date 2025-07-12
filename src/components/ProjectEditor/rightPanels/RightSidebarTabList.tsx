/**
 * RightSidebarTabList组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { Tooltip } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { RightSidebarTabType } from './types';
import { DEFAULT_CONFIG } from './constants/RightSidebar.constants';

/**
 * 标签项接口
 */
interface TabItem {
  // 标签唯一标识
  id: RightSidebarTabType;
  // 标签图标
  icon: React.ReactNode;
  // 标签显示标签
  label: string;
  // 是否启用
  enabled: boolean;
  // 分组标识
  group: string;
}

/**
 * 右侧边栏标签列表组件属性
 */
interface RightSidebarTabListProps {
  // 标签项列表
  tabItems: TabItem[];
  // 是否折叠
  collapsed: boolean;
  // 是否可折叠
  collapsible: boolean;
  // 当前激活标签
  currentTab: RightSidebarTabType;
  // 切换折叠状态回调
  onToggleCollapse: () => void;
  // 标签切换回调
  onTabChange: (tab: RightSidebarTabType) => void;
  // 双击事件回调
  onDoubleClick: () => void;
}

const RightSidebarTabList: React.FC<RightSidebarTabListProps> = ({
  tabItems,
  collapsed,
  collapsible,
  currentTab,
  onToggleCollapse,
  onTabChange,
  onDoubleClick,
}) => {
  return (
    <div
      className="right-sidebar__tab-list"
      onDoubleClick={onDoubleClick}
      title={collapsed ? '双击展开面板' : '双击收起面板'}
    >
      {collapsible && (
        <div className="right-sidebar__collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </div>
      )}

      {tabItems.map((item, index) => {
        const showDivider = index === DEFAULT_CONFIG.HISTORY_TAB_INDEX;
        return (
          <React.Fragment key={item.id}>
            <Tooltip title={item.label} placement="left" mouseEnterDelay={0.5}>
              <button
                className={`right-sidebar__tab-button ${
                  currentTab === item.id ? 'right-sidebar__tab-button--active' : ''
                } ${!item.enabled ? 'right-sidebar__tab-button--disabled' : ''}`}
                data-group={item.group}
                data-tab={item.id}
                onClick={() => item.enabled && onTabChange(item.id)}
                disabled={!item.enabled}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            </Tooltip>
            {showDivider && <div className="right-sidebar__divider" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RightSidebarTabList; 