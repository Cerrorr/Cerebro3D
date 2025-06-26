import React from 'react';
import { Select, Space, Typography, Input, Button } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { 
  BottomPanelType,
  BottomPanelOption,
  AnimationEditorState
} from './types';
import { PANEL_OPTIONS } from './constants';

const { Option } = Select;
const { Text } = Typography;

/**
 * 底部面板头部组件属性接口
 */
interface BottomPanelHeaderProps {
  /** 当前激活的面板类型 */
  activeType: BottomPanelType;
  /** 面板类型变化回调 */
  onTypeChange: (type: BottomPanelType) => void;
  /** 动画编辑器状态 */
  animationState?: AnimationEditorState;
  /** 动画播放/暂停回调 */
  onAnimationPlayPause?: () => void;
  /** 上一帧回调 */
  onPreviousFrame?: () => void;
  /** 下一帧回调 */
  onNextFrame?: () => void;
  /** 时间格式化函数 */
  formatTime?: (seconds: number) => string;
}

/**
 * 底部面板头部组件
 * 提供面板类型选择和对应面板的控制元素
 * @author Cerror
 * @since 2025-06-25
 */
const BottomPanelHeader: React.FC<BottomPanelHeaderProps> = ({
  activeType,
  onTypeChange,
  animationState,
  onAnimationPlayPause,
  onPreviousFrame,
  onNextFrame,
  formatTime
}) => {
  return (
    <div className="bottom-panel-header">
      <div className="panel-controls">
        <Space align="center">
          <Text style={{ color: '#d1d9e0' }}>面板:</Text>
          <Select
            value={activeType}
            onChange={onTypeChange}
            style={{ width: 180 }}
            size="small"
          >
            {PANEL_OPTIONS.map((option: BottomPanelOption) => (
              <Option key={option.value} value={option.value}>
                <Space>
                  {option.icon}
                  {option.label}
                </Space>
              </Option>
            ))}
          </Select>
        </Space>
      </div>
      
      {/* 中间区域 - 根据面板类型显示不同内容 */}
      {activeType === 'assets' ? (
        <div className="panel-search">
          <Input 
            placeholder="搜索资源..." 
            size="small"
            style={{ width: 220 }}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ) : activeType === 'animation' ? (
        <div className="panel-center">
          <div className="animation-controls-center">
            <Button 
              type="text" 
              icon={<StepBackwardOutlined />}
              onClick={onPreviousFrame}
              className="control-btn"
              size="small"
            />
            <Button 
              type="text" 
              icon={animationState?.playState === 'playing' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={onAnimationPlayPause}
              className="control-btn play-btn"
              size="small"
            />
            <Button 
              type="text" 
              icon={<StepForwardOutlined />}
              onClick={onNextFrame}
              className="control-btn"
              size="small"
            />
          </div>
        </div>
      ) : activeType === 'console' ? (
        <div className="panel-center">
          <div className="console-level-filter">
            <Space align="center">
              <Text style={{ color: '#d1d9e0' }}>级别:</Text>
              <Select
                defaultValue="all"
                size="small"
                style={{ width: 80 }}
                options={[
                  { value: 'all', label: '全部' },
                  { value: 'info', label: 'Info' },
                  { value: 'warn', label: 'Warn' },
                  { value: 'error', label: 'Error' }
                ]}
              />
            </Space>
          </div>
        </div>
      ) : null}
      
      <div className="panel-info">
        {activeType === 'console' ? (
          <button className="console-clear-btn">清空</button>
        ) : activeType === 'assets' ? (
          <Button size="small">内置资源</Button>
        ) : activeType === 'animation' && animationState && formatTime ? (
          <div className="animation-time-header">
            <span className="time-display">
              {formatTime(animationState.currentTime)} / {formatTime(animationState.duration)}
            </span>
          </div>
        ) : (
          <Text type="secondary" className="panel-description">
            {PANEL_OPTIONS.find((opt: BottomPanelOption) => opt.value === activeType)?.description}
          </Text>
        )}
      </div>
    </div>
  );
};

export default BottomPanelHeader; 