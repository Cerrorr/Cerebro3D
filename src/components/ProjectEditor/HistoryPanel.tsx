/**
 * 历史记录面板组件
 * @author Cerror
 * @since 2024-01-22
 */

import React, { useState, useMemo, useCallback } from 'react';
import { 
  List, 
  Button, 
  Input, 
  Select, 
  Switch, 
  Tooltip, 
  Popconfirm,
  Badge,
  Space,
  Typography,
  Empty,
  Divider
} from 'antd';
import {
  DeleteOutlined,
  FilterOutlined,
  SettingOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DragOutlined,
  BgColorsOutlined,
  BulbOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  ImportOutlined,
  ExportOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type {
  HistoryPanelProps,
  HistoryRecord,
  HistoryActionType,
  HistoryFilter
} from './types/historyPanel.types';
import './styles/HistoryPanel.scss';

const { Option } = Select;
const { Text } = Typography;

// 操作类型图标映射
const ACTION_ICONS: Record<HistoryActionType, React.ReactNode> = {
  create: <PlusCircleOutlined />,
  delete: <DeleteOutlined />,
  modify: <EditOutlined />,
  transform: <DragOutlined />,
  material: <BgColorsOutlined />,
  lighting: <BulbOutlined />,
  camera: <VideoCameraOutlined />,
  scene: <EnvironmentOutlined />,
  import: <ImportOutlined />,
  export: <ExportOutlined />,
  undo: <EditOutlined />,
  redo: <EditOutlined />,
};

/**
 * 历史记录面板组件
 * 提供操作历史记录的查看和管理功能
 * @author Cerror
 * @since 2024-01-22
 */
const HistoryPanel: React.FC<HistoryPanelProps> = ({
  historyState,
  config,
  onClearHistory,
  onJumpToRecord,
  onFilterChange,
  onConfigChange
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 格式化时间戳
  const formatTimestamp = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // 1分钟内
      return '刚刚';
    } else if (diff < 3600000) { // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 24小时内
      return `${Math.floor(diff / 3600000)}小时前`;
    } else {
      return new Date(timestamp).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }, []);

  // 过滤历史记录
  const filteredRecords = useMemo(() => {
    let records = [...historyState.records];
    const filter = historyState.filter;

    // 按操作类型过滤
    if (filter.actionTypes && filter.actionTypes.length > 0) {
      records = records.filter(record => filter.actionTypes!.includes(record.actionType));
    }

    // 按目标类型过滤
    if (filter.targetTypes && filter.targetTypes.length > 0) {
      records = records.filter(record => filter.targetTypes!.includes(record.targetType));
    }

    // 按时间范围过滤
    if (filter.timeRange) {
      records = records.filter(record => 
        record.timestamp >= filter.timeRange!.start &&
        record.timestamp <= filter.timeRange!.end
      );
    }

    // 按搜索文本过滤
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      records = records.filter(record =>
        record.description.toLowerCase().includes(searchLower) ||
        record.targetName.toLowerCase().includes(searchLower)
      );
    }

    // 限制显示数量并按时间倒序排列
    return records
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, config.maxDisplayRecords);
  }, [historyState.records, historyState.filter, config.maxDisplayRecords]);

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    onFilterChange({
      ...historyState.filter,
      searchText: value
    });
  }, [historyState.filter, onFilterChange]);

  // 处理过滤条件变更
  const handleFilterChange = useCallback((key: keyof HistoryFilter, value: any) => {
    onFilterChange({
      ...historyState.filter,
      [key]: value
    });
  }, [historyState.filter, onFilterChange]);

  // 获取操作类型颜色
  const getActionColor = useCallback((actionType: HistoryActionType): string => {
    const colors: Record<HistoryActionType, string> = {
      create: '#52c41a',
      delete: '#ff4d4f',
      modify: '#1890ff',
      transform: '#fa8c16',
      material: '#722ed1',
      lighting: '#fadb14',
      camera: '#13c2c2',
      scene: '#eb2f96',
      import: '#2f54eb',
      export: '#52c41a',
      undo: '#8c8c8c',
      redo: '#595959',
    };
    return colors[actionType];
  }, []);

  // 渲染历史记录项
  const renderHistoryItem = useCallback((record: HistoryRecord) => {
    const actionColor = getActionColor(record.actionType);
    const isCurrentRecord = historyState.currentIndex >= 0 && 
      historyState.records[historyState.currentIndex]?.id === record.id;

    return (
      <List.Item
        key={record.id}
        className={`history-item ${isCurrentRecord ? 'history-item--current' : ''}`}
        onClick={() => onJumpToRecord(record.id)}
      >
        <div className="history-item__content">
          <div className="history-item__header">
            <div className="history-item__icon" style={{ color: actionColor }}>
              {ACTION_ICONS[record.actionType]}
            </div>
            <div className="history-item__info">
              <div className="history-item__title">
                <Text strong>
                  {record.description}
                </Text>
              </div>
              <div className="history-item__meta">
                <Text type="secondary" className="history-item__target">
                  {record.targetName}
                </Text>
                {config.showTimestamps && (
                  <>
                    <Divider type="vertical" />
                    <Text type="secondary" className="history-item__time">
                      {formatTimestamp(record.timestamp)}
                    </Text>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </List.Item>
    );
  }, [
    historyState.currentIndex,
    historyState.records,
    config.showTimestamps,
    formatTimestamp,
    getActionColor,
    onJumpToRecord
  ]);

  return (
    <div className="history-panel">
      {/* 工具栏 */}
      <div className="history-toolbar">
        <div className="history-toolbar__actions">
          <Space>
            <Tooltip title="清空历史记录">
              <Popconfirm
                title="确定要清空所有历史记录吗？"
                onConfirm={onClearHistory}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  disabled={historyState.records.length === 0}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        </div>

        <div className="history-toolbar__options">
          <Space>
            <Tooltip title="过滤">
              <Button
                type="text"
                size="small"
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'active' : ''}
              />
            </Tooltip>
            <Tooltip title="设置">
              <Button
                type="text"
                size="small"
                icon={<SettingOutlined />}
                onClick={() => setShowSettings(!showSettings)}
                className={showSettings ? 'active' : ''}
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="history-search">
        <Input
          placeholder="搜索历史记录..."
          prefix={<SearchOutlined />}
          allowClear
          size="small"
          onChange={(e) => handleSearch(e.target.value)}
          className="history-search__input"
        />
      </div>

      {/* 过滤器 */}
      {showFilters && (
        <div className="history-filters">
          <div className="filter-group">
            <Text className="filter-label">操作类型:</Text>
            <Select
              mode="multiple"
              size="small"
              placeholder="选择操作类型"
              value={historyState.filter.actionTypes}
              onChange={(value) => handleFilterChange('actionTypes', value)}
              className="filter-select"
            >
              <Option value="create">创建</Option>
              <Option value="delete">删除</Option>
              <Option value="modify">修改</Option>
              <Option value="transform">变换</Option>
              <Option value="material">材质</Option>
              <Option value="lighting">灯光</Option>
              <Option value="camera">相机</Option>
              <Option value="scene">场景</Option>
            </Select>
          </div>
        </div>
      )}

      {/* 设置面板 */}
      {showSettings && (
        <div className="history-settings">
          <div className="setting-group">
            <Text className="setting-label">显示时间戳:</Text>
            <Switch
              size="small"
              checked={config.showTimestamps}
              onChange={(checked) => onConfigChange({ showTimestamps: checked })}
            />
          </div>

          <div className="setting-group">
            <Text className="setting-label">紧凑模式:</Text>
            <Switch
              size="small"
              checked={config.compactMode}
              onChange={(checked) => onConfigChange({ compactMode: checked })}
            />
          </div>

          <div className="setting-group">
            <Text className="setting-label">最大显示数量:</Text>
            <Select
              size="small"
              value={config.maxDisplayRecords}
              onChange={(value) => onConfigChange({ maxDisplayRecords: value })}
              className="setting-select"
            >
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
              <Option value={200}>200</Option>
              <Option value={500}>500</Option>
            </Select>
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="history-stats">
        <Space size="large">
          <div className="stats-item">
            <Text type="secondary">记录</Text>
            <Badge count={filteredRecords.length} color="#1890ff" />
          </div>
        </Space>
      </div>

      {/* 历史记录列表 */}
      <div className="history-list">
        {filteredRecords.length > 0 ? (
          <List
            size="small"
            dataSource={filteredRecords}
            renderItem={renderHistoryItem}
            className="history-list__content"
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无历史记录"
            className="history-empty"
          />
        )}
      </div>
    </div>
  );
};

export default HistoryPanel; 