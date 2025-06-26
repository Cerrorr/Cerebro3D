import React from 'react';
import { Empty } from 'antd';
import { ScissorOutlined } from '@ant-design/icons';
import './styles/AnimationTimeline.scss';

/**
 * 动画时间轴占位符组件
 * @author Cerror
 * @since 2025-06-26
 */
const AnimationTimeline: React.FC = () => {
  return (
    <div className="animation-timeline-placeholder">
      <Empty
        image={<ScissorOutlined style={{ fontSize: 48, color: '#4b5563' }} />}
        description={
          <span>
            动画时间轴编辑器
            <br />
            在此处管理关键帧和动画序列
          </span>
        }
      />
    </div>
  );
};

export default AnimationTimeline; 