import React, { useState, useCallback } from 'react';
import { Select, Space, Typography } from 'antd';
import { 
  FolderOpenOutlined,
  PlayCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { BottomPanelProps, BottomPanelType } from './types';
import './styles/BottomPanel.scss';

const { Option } = Select;
const { Text } = Typography;

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

  // 面板类型选项配置
  const panelOptions = [
    {
      value: 'assets',
      label: '资源中心',
      icon: <FolderOpenOutlined />,
      description: '项目资源管理'
    },
    {
      value: 'animation',
      label: '动画编辑器',
      icon: <PlayCircleOutlined />,
      description: '动画时间轴和关键帧编辑'
    },
    {
      value: 'console',
      label: '日志',
      icon: <FileTextOutlined />,
      description: '系统日志和调试信息'
    }
  ] as const;

  /**
   * 处理面板类型切换
   * @param type 面板类型
   */
  const handleTypeChange = useCallback((type: BottomPanelType) => {
    setActiveType(type);
    onTypeChange?.(type);
  }, [onTypeChange]);

  /**
   * 渲染内容区域
   * @param type 面板类型
   * @returns 对应的内容组件
   */
  const renderContent = (type: BottomPanelType) => {
    switch (type) {
      case 'assets':
        return (
          <div className="assets-content">
            <div className="content-placeholder">
              <FolderOpenOutlined className="placeholder-icon" />
              <Text className="placeholder-text">资源中心</Text>
              <Text type="secondary" className="placeholder-description">
                在这里管理项目的3D模型、材质、贴图等资源文件
              </Text>
            </div>
          </div>
        );
      
      case 'animation':
        return (
          <div className="animation-content">
            <div className="content-placeholder">
              <PlayCircleOutlined className="placeholder-icon" />
              <Text className="placeholder-text">动画编辑器</Text>
              <Text type="secondary" className="placeholder-description">
                时间轴控制、关键帧编辑和动画曲线调整功能
              </Text>
            </div>
          </div>
        );
      
      case 'console':
        return (
          <div className="console-content">
            <div className="content-placeholder">
              <FileTextOutlined className="placeholder-icon" />
              <Text className="placeholder-text">日志控制台</Text>
              <Text type="secondary" className="placeholder-description">
                系统运行日志、错误信息和调试输出
              </Text>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bottom-panel" style={{ height }}>
      {/* 面板头部 */}
      <div className="bottom-panel-header">
        <div className="panel-controls">
          <Space align="center">
            <Text style={{ color: '#d1d9e0' }}>面板:</Text>
            <Select
              value={activeType}
              onChange={handleTypeChange}
              style={{ width: 180 }}
              size="small"
            >
              {panelOptions.map(option => (
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
        
        <div className="panel-info">
          <Text type="secondary" className="panel-description">
            {panelOptions.find(opt => opt.value === activeType)?.description}
          </Text>
        </div>
      </div>

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