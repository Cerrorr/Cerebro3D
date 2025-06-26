import React, { useState, useCallback } from 'react';
import type { 
  BottomPanelProps, 
  BottomPanelType,
  AnimationEditorState,
} from './types/bottomPanel.types';
import BottomPanelHeader from './BottomPanelHeader';
import AssetsPanel from './AssetsPanel';
import AnimationTimeline from './AnimationTimeline';
import ConsolePanel from './ConsolePanel';
import './styles/BottomPanel.scss';

/**
 * 底部面板组件
 * 提供资源中心、动画编辑器和日志三个功能模块的切换和显示
 * @author Cerror
 * @since 2025-06-25
 */
const BottomPanel: React.FC<BottomPanelProps> = ({
  defaultActiveType = 'assets',
  onTypeChange,
  height = 300
}) => {
  // 当高度为0时，面板处于收起状态
  const isCollapsed = height <= 40;
  const [activeType, setActiveType] = useState<BottomPanelType>(defaultActiveType);

  // 动画编辑器状态（仅用于头部控制）
  const [animationEditorState, setAnimationEditorState] = useState<AnimationEditorState>({
    playState: 'stopped',
    currentTime: 0,
    duration: 0,
    currentFrame: 0,
    totalFrames: 0,
    frameRate: 30,
    hasSelectedObject: false
  });

  /**
   * 处理面板类型切换
   * @param type 面板类型
   */
  const handleTypeChange = useCallback((type: BottomPanelType) => {
    setActiveType(type);
    onTypeChange?.(type);
  }, [onTypeChange]);

  /**
   * 处理动画播放/暂停
   */
  const handleAnimationPlayPause = useCallback(() => {
    setAnimationEditorState(prev => ({
      ...prev,
      playState: prev.playState === 'playing' ? 'paused' : 'playing'
    }));
  }, []);

  /**
   * 处理上一帧
   */
  const handlePreviousFrame = useCallback(() => {
    setAnimationEditorState(prev => ({
      ...prev,
      currentFrame: Math.max(0, prev.currentFrame - 1),
      currentTime: Math.max(0, (prev.currentFrame - 1) / prev.frameRate)
    }));
  }, []);

  /**
   * 处理下一帧
   */
  const handleNextFrame = useCallback(() => {
    setAnimationEditorState(prev => ({
      ...prev,
      currentFrame: Math.min(prev.totalFrames, prev.currentFrame + 1),
      currentTime: Math.min(prev.duration, (prev.currentFrame + 1) / prev.frameRate)
    }));
  }, []);

  /**
   * 格式化时间显示
   * @param seconds 秒数
   * @returns 格式化的时间字符串 (HH:MM:SS)
   */
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * 渲染内容区域
   * @param type 面板类型
   * @returns 对应的内容组件
   */
  const renderContent = (type: BottomPanelType) => {
    switch (type) {
      case 'assets':
        return <AssetsPanel />;
      
      case 'animation':
        return <AnimationTimeline />;
      
      case 'console':
        return <ConsolePanel />;
      
      default:
        return null;
    }
  };

  return (
    <div className="bottom-panel" style={{ height }}>
      {/* 面板头部 */}
      <BottomPanelHeader
        activeType={activeType}
        onTypeChange={handleTypeChange}
        animationState={animationEditorState}
        onAnimationPlayPause={handleAnimationPlayPause}
        onPreviousFrame={handlePreviousFrame}
        onNextFrame={handleNextFrame}
        formatTime={formatTime}
      />

      {/* 面板内容 - 收起状态时隐藏 */}
      {!isCollapsed && (
        <div className="bottom-panel-content">
          {renderContent(activeType)}
        </div>
      )}
    </div>
  );
};

export default BottomPanel; 