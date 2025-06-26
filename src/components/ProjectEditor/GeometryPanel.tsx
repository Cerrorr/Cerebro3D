import React from 'react';
import {
  Select,
  Input,
  Button,
  Collapse,
  Space,
  Typography,
  Divider,
  Checkbox,
  Tooltip
} from 'antd';
import {
  ReloadOutlined,
  EyeOutlined,
  CalculatorOutlined,
  AimOutlined,
  BoxPlotOutlined,
  BarChartOutlined,
  BranchesOutlined,
  CompressOutlined
} from '@ant-design/icons';
import type {
  GeometryPanelProps
} from './types/geometryPanel.types';
import { GEOMETRY_TYPE_OPTIONS } from './types/geometryPanel.types';
import './styles/GeometryPanel.scss';

const { Panel } = Collapse;
const { Text } = Typography;
const { Option } = Select;

/**
 * 几何面板组件
 * 提供几何体信息编辑和显示功能
 * @author Cerror
 * @since 2024-01-22
 */
const GeometryPanel: React.FC<GeometryPanelProps> = ({
  geometryState,
  onInfoChange,
  onMorphSettingsChange,
  onShowVertexNormals,
  onComputeVertexNormals,
  onCenter,
  onRefreshBounds,
}) => {
  const handleTypeChange = (type: string) => {
    onInfoChange?.({ type: type as any });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInfoChange?.({ name: e.target.value });
  };

  const handleMorphAttributeChange = (key: string, checked: boolean) => {
    const newMorphAttributes = {
      ...geometryState?.morphSettings.morphAttributes,
      [key]: checked
    };
    onMorphSettingsChange?.({
      morphAttributes: newMorphAttributes
    });
  };

  const handleMorphRelativeChange = (checked: boolean) => {
    onMorphSettingsChange?.({
      morphRelative: checked
    });
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  if (!geometryState) {
    return <div className="geometry-panel">暂无几何体数据</div>;
  }

  const { info, attributes, morphSettings, bounds, stats } = geometryState;

  return (
    <div className="geometry-panel">
      <Collapse
        defaultActiveKey={['basic', 'attributes', 'morph', 'bounds']}
        ghost
        size="small"
      >
        {/* 基本信息 */}
        <Panel 
          header={
            <div className="panel-header">
              <BoxPlotOutlined className="panel-icon" />
              <span>基本信息</span>
            </div>
          } 
          key="basic"
        >
          <div className="geometry-basic-info">
            <div className="info-row">
              <Text className="info-label">类型</Text>
              <Select
                value={info.type}
                onChange={handleTypeChange}
                className="info-select"
                size="small"
              >
                {GEOMETRY_TYPE_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="info-row">
              <Text className="info-label">识别码</Text>
              <div className="id-display">
                <Text className="id-text">{info.id}</Text>
                <Tooltip title="刷新边界">
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    size="small"
                    className="refresh-btn"
                    onClick={onRefreshBounds}
                  />
                </Tooltip>
              </div>
            </div>

            <div className="info-row">
              <Text className="info-label">名称</Text>
              <Input
                value={info.name}
                onChange={handleNameChange}
                placeholder="请输入名称"
                size="small"
                className="name-input"
              />
            </div>
          </div>

          <Divider className="panel-divider" />

          {/* 操作按钮 */}
          <div className="geometry-operations">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={onShowVertexNormals}
                className="operation-btn"
                block
              >
                显示顶点法线
              </Button>
              <Button
                type="default"
                icon={<CalculatorOutlined />}
                onClick={onComputeVertexNormals}
                className="operation-btn"
                block
              >
                计算顶点法线
              </Button>
              <Button
                type="default"
                icon={<AimOutlined />}
                onClick={onCenter}
                className="operation-btn"
                block
              >
                居中
              </Button>
            </Space>
          </div>
        </Panel>

        {/* 属性 */}
        <Panel 
          header={
            <div className="panel-header">
              <BarChartOutlined className="panel-icon" />
              <span>属性</span>
            </div>
          } 
          key="attributes"
        >
          <div className="geometry-attributes">
            <div className="attributes-list">
              <div className="attribute-row">
                <Text className="attr-label">索引</Text>
                <Text className="attr-value">
                  {formatNumber(attributes.index?.count || 0)}
                </Text>
              </div>
              
              <div className="attribute-row">
                <Text className="attr-label">position</Text>
                <Text className="attr-value">
                  {formatNumber(attributes.position.count)}({attributes.position.itemSize})
                </Text>
              </div>
              
              <div className="attribute-row">
                <Text className="attr-label">normal</Text>
                <Text className="attr-value">
                  {formatNumber(attributes.normal.count)}({attributes.normal.itemSize})
                </Text>
              </div>
              
              <div className="attribute-row">
                <Text className="attr-label">UV</Text>
                <Text className="attr-value">
                  {formatNumber(attributes.uv.count)}({attributes.uv.itemSize})
                </Text>
              </div>
            </div>
          </div>
        </Panel>

        {/* Morph Attributes */}
        <Panel 
          header={
            <div className="panel-header">
              <BranchesOutlined className="panel-icon" />
              <span>Morph Attributes</span>
            </div>
          } 
          key="morph"
        >
          <div className="morph-attributes">
            <div className="morph-list">
              {Object.entries(morphSettings.morphAttributes).map(([key, value]) => (
                <div key={key} className="morph-row">
                  <Text className="morph-label">{key}</Text>
                  <Checkbox
                    checked={value}
                    onChange={(e) => handleMorphAttributeChange(key, e.target.checked)}
                  />
                </div>
              ))}
            </div>
            
            <Divider className="morph-divider" />
            
            <div className="morph-relative">
              <Checkbox
                checked={morphSettings.morphRelative}
                onChange={(e) => handleMorphRelativeChange(e.target.checked)}
              >
                Morph Relative
              </Checkbox>
            </div>
          </div>
        </Panel>

        {/* 界限 */}
        <Panel 
          header={
            <div className="panel-header">
              <CompressOutlined className="panel-icon" />
              <span>界限</span>
            </div>
          } 
          key="bounds"
        >
          <div className="geometry-bounds">
            <div className="bounds-values">
              <div className="bounds-row">
                <Text className="bounds-value">{formatNumber(bounds.min.x)}</Text>
              </div>
              <div className="bounds-row">
                <Text className="bounds-value">{formatNumber(bounds.max.x)}</Text>
              </div>
              <div className="bounds-row">
                <Text className="bounds-value">{formatNumber(bounds.size.x)}</Text>
              </div>
            </div>
            
            <Divider className="bounds-divider" />
            
            {/* 统计信息 */}
            <div className="geometry-stats">
              <div className="stats-row">
                <Text className="stats-label">顶点数</Text>
                <Text className="stats-value">{formatNumber(stats.vertices)}</Text>
              </div>
              <div className="stats-row">
                <Text className="stats-label">面数</Text>
                <Text className="stats-value">{formatNumber(stats.faces)}</Text>
              </div>
              <div className="stats-row">
                <Text className="stats-label">三角形</Text>
                <Text className="stats-value">{formatNumber(stats.triangles)}</Text>
              </div>
              <div className="stats-row">
                <Text className="stats-label">组数</Text>
                <Text className="stats-value">{formatNumber(stats.groups)}</Text>
              </div>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default GeometryPanel; 