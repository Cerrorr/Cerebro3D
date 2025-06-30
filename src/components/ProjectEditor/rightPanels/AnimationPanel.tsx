/**
 * 动画面板组件
 * @author Cerror
 * @since 2025-06-25
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Button, List, Slider, Empty, Tooltip, Typography } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import './styles/AnimationPanel.scss';
import type {
  AnimationPanelProps,
  AnimationItem,
  AnimationStatus
} from './types';
import {
  ANIMATION_TYPE_ICONS,
  ANIMATION_TYPE_COLORS
} from './types';
import { useRecord } from '@/hooks/common/useRecord';

const { Text } = Typography;

/**
 * 动画面板组件
 */
const AnimationPanel: React.FC<AnimationPanelProps> = ({
  animationState,
  onAnimationSelect,
  onAnimationPlay,
  onAnimationPause,
  onAnimationStop,
  onProgressChange,
  onSpeedChange
}) => {
  // 安全地获取播放速度，提供默认值
  const initialSpeed = animationState?.playbackConfig?.playbackSpeed ?? 1.0;
  const [localSpeedValue, setLocalSpeedValue] = useState(initialSpeed);

  // 记录器
  const record = useRecord('动画');

  // 如果 animationState 不存在，显示空状态或加载中
  if (!animationState) {
    return (
      <div className="animation-panel">
        <div className="animation-empty">
          <Empty description="动画数据加载中..." />
        </div>
      </div>
    );
  }

  // 格式化速度显示
  const formatSpeed = useCallback((speed: number): string => {
    return `${speed.toFixed(1)}x`;
  }, []);

  // 过滤和搜索动画
  const filteredAnimations = useMemo(() => {
    // 如果 animationState 不存在，返回空数组
    if (!animationState) {
      return [];
    }

    let filtered = animationState.animations;

    // 搜索过滤
    if (animationState.searchKeyword) {
      const keyword = animationState.searchKeyword.toLowerCase();
      filtered = filtered.filter(
        animation =>
          animation.name.toLowerCase().includes(keyword) ||
          animation.targetName.toLowerCase().includes(keyword) ||
          animation.type.toLowerCase().includes(keyword)
      );
    }

    // 类型过滤
    if (animationState.filterType !== 'all') {
      filtered = filtered.filter(
        animation => animation.type === animationState.filterType
      );
    }

    // 状态过滤
    if (animationState.filterStatus !== 'all') {
      filtered = filtered.filter(
        animation => animation.status === animationState.filterStatus
      );
    }

    return filtered;
  }, [animationState]);

  // 处理动画项点击
  const handleAnimationClick = useCallback(
    (animationId: string) => {
      record(`选择动画 ${animationId}`);
      onAnimationSelect?.(animationId);
    },
    [onAnimationSelect]
  );

  // 处理播放按钮点击
  const handlePlayClick = useCallback(
    (animationId: string, status: AnimationStatus, event: React.MouseEvent) => {
      event.stopPropagation();
      record(`${status === 'playing' ? '暂停' : '播放'}动画 ${animationId}`);
      if (status === 'playing') {
        onAnimationPause?.(animationId);
      } else {
        onAnimationPlay?.(animationId);
      }
    },
    [onAnimationPlay, onAnimationPause]
  );

  // 处理停止按钮点击
  const handleStopClick = useCallback(
    (animationId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      record(`停止动画 ${animationId}`);
      onAnimationStop?.(animationId);
    },
    [onAnimationStop]
  );

  // 处理进度条变化
  const handleProgressChange = useCallback(
    (animationId: string, progress: number) => {
      record(`调整动画 ${animationId} 进度 = ${progress}`);
      onProgressChange?.(animationId, progress);
    },
    [onProgressChange]
  );

  // 处理速度变化
  const handleSpeedChange = useCallback(
    (speed: number) => {
      setLocalSpeedValue(speed);
      record(`修改播放速度 = ${speed}`);
      onSpeedChange?.(speed);
    },
    [onSpeedChange]
  );

  // 渲染简化的动画项
  const renderAnimationItem = useCallback(
    (animation: AnimationItem) => {
      const isSelected = animation.id === animationState.selectedAnimationId;
      const typeColor = ANIMATION_TYPE_COLORS[animation.type];

      return (
        <List.Item
          key={animation.id}
          className={`animation-item ${
            isSelected ? 'animation-item--selected' : ''
          }`}
          onClick={() => handleAnimationClick(animation.id)}
        >
          <div className="animation-item__content">
            <div className="item-info">
              <div className="item-icon" style={{ color: typeColor }}>
                {ANIMATION_TYPE_ICONS[animation.type]}
              </div>
              <div className="item-details">
                <Text className="item-name">{animation.name}</Text>
                <Text className="item-target">目标: {animation.targetName}</Text>
              </div>
            </div>

            <div className="item-controls">
              <Tooltip
                title={animation.status === 'playing' ? '暂停' : '播放'}
              >
                <Button
                  type="text"
                  size="small"
                  icon={
                    animation.status === 'playing' ? (
                      <PauseCircleOutlined />
                    ) : (
                      <PlayCircleOutlined />
                    )
                  }
                  onClick={e =>
                    handlePlayClick(animation.id, animation.status, e)
                  }
                  className={
                    animation.status === 'playing'
                      ? 'playing'
                      : animation.status === 'paused'
                      ? 'paused'
                      : ''
                  }
                />
              </Tooltip>

              <Tooltip title="停止">
                <Button
                  type="text"
                  size="small"
                  icon={<StopOutlined />}
                  onClick={e => handleStopClick(animation.id, e)}
                  disabled={animation.status === 'stopped'}
                />
              </Tooltip>
            </div>
          </div>
        </List.Item>
      );
    },
    [
      animationState.selectedAnimationId,
      handleAnimationClick,
      handlePlayClick,
      handleStopClick
    ]
  );

  return (
    <div className="animation-panel">
      {/* 动画列表 */}
      <div className="animation-list">
        {filteredAnimations.length > 0 ? (
          <List
            size="small"
            dataSource={filteredAnimations}
            renderItem={renderAnimationItem}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无动画"
            className="animation-empty"
          />
        )}
      </div>

      {/* 底部控制面板 */}
      <div className="animation-controls">
        {/* 播放速度控制 */}
        <div className="control-row">
          <Text className="control-label">播放速度:</Text>
          <div className="control-slider">
            <Slider
              min={0.1}
              max={5.0}
              step={0.1}
              value={localSpeedValue}
              onChange={handleSpeedChange}
              tooltip={{ formatter: value => formatSpeed(value || 0) }}
            />
            <Text className="control-value">{formatSpeed(localSpeedValue)}</Text>
          </div>
        </div>

        {/* 播放百分比控制 */}
        <div className="control-row">
          <Text className="control-label">播放进度:</Text>
          <div className="control-slider">
            <Slider
              min={0}
              max={100}
              step={0.1}
              value={
                filteredAnimations.find(
                  a => a.id === animationState.selectedAnimationId
                )?.progress ?? 0
              }
              onChange={value =>
                handleProgressChange(
                  animationState.selectedAnimationId ?? '',
                  value
                )
              }
              disabled={!animationState.selectedAnimationId}
              tooltip={{ formatter: value => `${(value || 0).toFixed(1)}%` }}
            />
            <Text className="control-value">
              {animationState.selectedAnimationId
                ? `${(
                    filteredAnimations.find(
                      a => a.id === animationState.selectedAnimationId
                    )?.progress || 0
                  ).toFixed(1)}%`
                : '0.0%'}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationPanel; 