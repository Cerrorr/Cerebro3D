import React, { useState, useCallback } from 'react';
import { Tooltip } from 'antd';
import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { RightSidebarProps, RightSidebarTabType, RightSidebarTabItem } from './types/rightSidebar.types';
import { TAB_TITLE_MAP, EMPTY_STATE_ICONS, getTabItems, DEFAULT_CONFIG } from './constants';
import './styles/RightSidebar.scss';

/**
 * 右侧栏组件
 * 提供3D编辑器的配置面板和工具栏
 * @param props 组件属性
 * @returns 右侧栏React组件
 */
const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab = DEFAULT_CONFIG.DEFAULT_ACTIVE_TAB,
  onTabChange,
  visible = true,
  width = DEFAULT_CONFIG.DEFAULT_WIDTH,
  collapsible = true,
  defaultCollapsed = DEFAULT_CONFIG.DEFAULT_COLLAPSED
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [currentTab, setCurrentTab] = useState<RightSidebarTabType>(activeTab);

  // 获取标签配置数据
  const tabItems = getTabItems();

  // 处理标签切换
  const handleTabChange = useCallback((tab: RightSidebarTabType) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setCurrentTab(tab);
    onTabChange?.(tab);
  }, [collapsed, onTabChange]);

  // 处理折叠切换
  const handleToggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  // 处理图标区域双击事件
  const handleTabListDoubleClick = useCallback(() => {
    if (collapsible) {
      setCollapsed(prev => !prev);
    }
  }, [collapsible]);

  // 获取标签标题
  const getTabTitle = (tabId: RightSidebarTabType): string => {
    return TAB_TITLE_MAP[tabId] || '未知';
  };



  // 渲染内容区域
  const renderContent = () => {
    return (
      <div className="right-sidebar__content">
        <div className="right-sidebar__content-inner">
          <div className="right-sidebar__content-header">
            <h3>{getTabTitle(currentTab)}</h3>
          </div>
          <div className="right-sidebar__content-body">
            <div className="right-sidebar__empty-state">
              <div className="empty-icon">
                {EMPTY_STATE_ICONS[currentTab]}
              </div>
              <div className="empty-text">
                {getTabTitle(currentTab)}面板开发中...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染分割线
  const renderDivider = (index: number) => (
    <div key={`divider-${index}`} className="right-sidebar__divider" />
  );

  if (!visible) {
    return null;
  }

  if (import.meta.env.DEV) {
    console.log('RightSidebar render:', { collapsed, width, currentTab });
  }

  return (
    <div 
      className={`right-sidebar ${collapsed ? 'right-sidebar--collapsed' : 'right-sidebar--expanded'}`}
      style={{ width: collapsed ? DEFAULT_CONFIG.COLLAPSED_WIDTH : width }}
      data-collapsed={collapsed}
    >
      {/* 左侧图标按钮列表 */}
      <div 
        className="right-sidebar__tab-list"
        onDoubleClick={handleTabListDoubleClick}
        title={collapsed ? "双击展开面板" : "双击收起面板"}
      >
        {/* 折叠切换按钮 - 移到顶部 */}
        {collapsible && (
          <div className="right-sidebar__collapse-btn" onClick={handleToggleCollapse}>
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </div>
        )}
        
        {tabItems.map((item, index) => {
          // 在历史记录后添加分割线
          const showDivider = index === DEFAULT_CONFIG.HISTORY_TAB_INDEX;
          
          return (
            <React.Fragment key={item.id}>
              <Tooltip 
                title={item.label} 
                placement="left"
                mouseEnterDelay={0.5}
              >
                <button
                  className={`right-sidebar__tab-button ${
                    currentTab === item.id ? 'right-sidebar__tab-button--active' : ''
                  } ${
                    !item.enabled ? 'right-sidebar__tab-button--disabled' : ''
                  }`}
                  data-group={item.group}
                  data-tab={item.id}
                  onClick={() => item.enabled && handleTabChange(item.id)}
                  disabled={!item.enabled}
                  aria-label={item.label}
                >
                  {item.icon}
                </button>
              </Tooltip>
              {showDivider && renderDivider(index)}
            </React.Fragment>
          );
        })}
      </div>

      {/* 右侧内容区域 - 只在非收起状态下渲染 */}
      {!collapsed && renderContent()}
    </div>
  );
};

export default RightSidebar; 