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

interface TabItem {
  id: RightSidebarTabType;
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  group: string;
}

interface RightSidebarTabListProps {
  tabItems: TabItem[];
  collapsed: boolean;
  collapsible: boolean;
  currentTab: RightSidebarTabType;
  onToggleCollapse: () => void;
  onTabChange: (tab: RightSidebarTabType) => void;
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