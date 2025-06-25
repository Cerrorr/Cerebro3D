import React, { useState, useCallback } from 'react';
import { Tooltip } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  SunOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  RocketOutlined,
  FunctionOutlined,
  BuildOutlined,
  ExperimentOutlined,
  RadarChartOutlined,
  FormatPainterOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { RightSidebarProps, RightSidebarTabType, RightSidebarTabItem } from './types/rightSidebar.types';
import './styles/RightSidebar.scss';

/**
 * 右侧栏组件
 * 提供3D编辑器的配置面板和工具栏
 * @param props 组件属性
 * @returns 右侧栏React组件
 */
const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab = 'scene',
  onTabChange,
  visible = true,
  width = 320,
  collapsible = true,
  defaultCollapsed = false
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [currentTab, setCurrentTab] = useState<RightSidebarTabType>(activeTab);

  // 标签配置数据 - 使用更丰富的图标
  const tabItems: RightSidebarTabItem[] = [
    // 配置组 🎛️
    {
      id: 'scene',
      label: '场景配置',
      icon: <RadarChartOutlined />, // 更具科技感的场景配置图标
      enabled: true,
      group: 'config'
    },
    {
      id: 'camera',
      label: '相机配置',
      icon: <VideoCameraOutlined />, // 摄像机图标表示相机配置
      enabled: true,
      group: 'config'
    },
    {
      id: 'lighting',
      label: '灯光配置',
      icon: <SunOutlined />, // 太阳图标更形象地表示灯光
      enabled: true,
      group: 'config'
    },
    {
      id: 'renderer',
      label: '渲染器配置',
      icon: <EyeOutlined />, // 眼睛图标表示视觉渲染
      enabled: true,
      group: 'config'
    },
    {
      id: 'postprocess',
      label: '后期处理',
      icon: <ExperimentOutlined />, // 实验图标表示后期效果处理
      enabled: true,
      group: 'config'
    },
    {
      id: 'weather',
      label: '天气设置',
      icon: <ThunderboltOutlined />, // 闪电图标增加动感
      enabled: true,
      group: 'config'
    },
    {
      id: 'history',
      label: '历史记录',
      icon: <ClockCircleOutlined />, // 时钟图标更直观表示历史
      enabled: true,
      group: 'config'
    },
    // 内容组 🎨
    {
      id: 'object',
      label: '对象',
      icon: <AppstoreOutlined />, // 应用网格图标表示多个对象
      enabled: true,
      group: 'content'
    },
    {
      id: 'geometry',
      label: '几何',
      icon: <BuildOutlined />, // 构建图标表示几何建模
      enabled: true,
      group: 'content'
    },
    {
      id: 'material',
      label: '材质',
      icon: <FormatPainterOutlined />, // 画笔图标表示材质绘制
      enabled: true,
      group: 'content'
    },
    {
      id: 'animation',
      label: '动画',
      icon: <RocketOutlined />, // 火箭图标增加动感
      enabled: true,
      group: 'content'
    },
    {
      id: 'script',
      label: '脚本',
      icon: <FunctionOutlined />, // 函数图标更专业地表示脚本编程
      enabled: true,
      group: 'content'
    }
  ];

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
    const tabMap: Record<RightSidebarTabType, string> = {
      scene: '场景配置',
      camera: '相机配置',
      lighting: '灯光配置',
      renderer: '渲染器配置',
      postprocess: '后期处理',
      weather: '天气设置',
      history: '历史记录',
      object: '对象',
      geometry: '几何',
      material: '材质',
      animation: '动画',
      script: '脚本'
    };
    return tabMap[tabId] || '未知';
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
                {currentTab === 'scene' && '🎬'}
                {currentTab === 'camera' && '📹'}
                {currentTab === 'lighting' && '💡'}
                {currentTab === 'renderer' && '👁️'}
                {currentTab === 'postprocess' && '🔬'}
                {currentTab === 'weather' && '⚡'}
                {currentTab === 'history' && '⏰'}
                {currentTab === 'object' && '📦'}
                {currentTab === 'geometry' && '🔧'}
                {currentTab === 'material' && '🎨'}
                {currentTab === 'animation' && '🚀'}
                {currentTab === 'script' && '⚙️'}
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
      style={{ width: collapsed ? 48 : width }}
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
          const showDivider = index === 5; // 历史记录是第6个项目（索引5）
          
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