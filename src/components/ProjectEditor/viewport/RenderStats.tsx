import React from 'react';
import { Tooltip } from 'antd';
import type { RenderStatsProps } from './types/RenderStats.types';
import './styles/RenderStats.scss';

/**
 * 实时渲染性能统计组件
 * 显示物体数量、顶点数、三角面数和当前视图模式
 * @author Cerror
 * @since 2025-07-17
 */
const RenderStats: React.FC<RenderStatsProps> = ({
  currentView,
  viewOptions,
  stats,
  className = ''
}) => {
  // 查找当前视图的显示名称
  const currentViewLabel = viewOptions.find(v => v.value === currentView)?.label || currentView;

  // 使用默认值如果没有提供统计数据
  const displayStats = stats || {
    objectCount: 0,
    vertexCount: 0,
    triangleCount: 0
  };

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className={`render-info ${className}`}>
      <Tooltip title="实时渲染性能统计" placement="left">
        <div className="render-stats">
          <span>物体: {displayStats.objectCount}</span>
          <span>顶点: {formatNumber(displayStats.vertexCount)}</span>
          <span>三角面: {formatNumber(displayStats.triangleCount)}</span>
          <span>视图: {currentViewLabel}</span>
        </div>
      </Tooltip>
    </div>
  );
};

export default RenderStats;
