import React from 'react';
import { Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  ExpandOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  BoxPlotOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UpOutlined,
  DownOutlined,
  CheckSquareOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons';
import type { CanvasControlsProps, ViewType } from './types';

/**
 * CanvasControls
 * 负责渲染左上角的视图/网格/选择控制按钮
 * @author Cerror
 * @since 2025-07-08
 */
const CanvasControls: React.FC<CanvasControlsProps> = ({
  currentView,
  settings,
  selectionState,
  onViewReset,
  onZoomExtents,
  onToggleGrid,
  onViewChange,
  onSelectionToggle
}) => {
  // 六视图选项
  const viewOptions = [
    { value: 'perspective', label: '透视视图', icon: <BoxPlotOutlined /> },
    { value: 'front', label: '前视图', icon: <ArrowUpOutlined /> },
    { value: 'back', label: '后视图', icon: <ArrowDownOutlined /> },
    { value: 'left', label: '左视图', icon: <ArrowLeftOutlined /> },
    { value: 'right', label: '右视图', icon: <ArrowRightOutlined /> },
    { value: 'top', label: '顶视图', icon: <UpOutlined /> },
    { value: 'bottom', label: '底视图', icon: <DownOutlined /> }
  ];

  const getCurrentViewOption = () =>
    viewOptions.find(opt => opt.value === currentView) || viewOptions[0];

  const menuItems: MenuProps['items'] = viewOptions.map(option => ({
    key: option.value,
    label: (
      <div className="view-menu-item">
        {option.icon}
        <span>{option.label}</span>
      </div>
    ),
    onClick: () => onViewChange(option.value as ViewType)
  }));

  // 获取选择状态图标
  const getSelectionIcon = () => {
    return selectionState === 'all' ? <CheckSquareOutlined /> : <MinusSquareOutlined />;
  };

  // 获取选择状态提示
  const getSelectionTooltip = () => {
    return selectionState === 'all' ? '切换为部分选择' : '切换为全选';
  };

  return (
    <div className="canvas-controls">
      <div className="view-controls">
        <div className="control-buttons">
          {/* 视图切换下拉菜单 */}
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomLeft">
            <Tooltip title={`当前: ${getCurrentViewOption().label}，点击选择视图`} placement="bottom">
              <button className="control-btn view-cycle-btn">
                {getCurrentViewOption().icon}
              </button>
            </Tooltip>
          </Dropdown>

          {/* 重置视角按钮 */}
          <Tooltip title="重置视角 (Home)" placement="bottom">
            <button className="control-btn" onClick={onViewReset}>
              <HomeOutlined />
            </button>
          </Tooltip>

          {/* 缩放到全部按钮 */}
          <Tooltip title="缩放到全部 (F)" placement="bottom">
            <button className="control-btn" onClick={onZoomExtents}>
              <ExpandOutlined />
            </button>
          </Tooltip>

          {/* 选择功能按钮组 */}
          <Tooltip title={getSelectionTooltip()} placement="bottom">
            <button
              className={`control-btn ${selectionState === 'all' ? 'active' : ''}`}
              onClick={onSelectionToggle}
            >
              {getSelectionIcon()}
            </button>
          </Tooltip>

          {/* 网格显示切换按钮 */}
          <Tooltip title={settings.gridVisible ? '隐藏网格 (G)' : '显示网格 (G)'} placement="bottom">
            <button
              className={`control-btn ${settings.gridVisible ? 'active' : ''}`}
              onClick={onToggleGrid}
            >
              {settings.gridVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CanvasControls; 