import React, { useCallback } from 'react';
import { Collapse, Switch, Slider, Radio, Input } from 'antd';
import { 
  CloudOutlined,
  CloudDownloadOutlined,
  StarOutlined 
} from '@ant-design/icons';
import type { WeatherConfigPanelProps, WeatherConfig, FogConfig, RainConfig, SnowConfig } from './types';
import './styles/WeatherConfigPanel.scss';

/**
 * 天气配置面板组件
 * 提供雾、雨、雪三种天气效果的详细配置选项
 * @author Cerror
 * @since 2024-01-22
 */
const WeatherConfigPanel: React.FC<WeatherConfigPanelProps> = ({
  config,
  onChange
}) => {
  // 雾配置更新处理函数
  const handleFogConfigChange = useCallback((updates: Partial<FogConfig>) => {
    const newConfig: WeatherConfig = {
      ...config,
      fog: { ...config.fog, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 雨配置更新处理函数
  const handleRainConfigChange = useCallback((updates: Partial<RainConfig>) => {
    const newConfig: WeatherConfig = {
      ...config,
      rain: { ...config.rain, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 雪配置更新处理函数
  const handleSnowConfigChange = useCallback((updates: Partial<SnowConfig>) => {
    const newConfig: WeatherConfig = {
      ...config,
      snow: { ...config.snow, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 折叠面板配置
  const collapseItems = [
    {
      key: 'fog',
      label: (
        <div className="collapse-header">
          <CloudOutlined />
          <span>雾</span>
        </div>
      ),
      children: (
        <div className="config-section">
          {/* 启用开关 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                size="small"
                checked={config.fog.enabled}
                onChange={(enabled) => handleFogConfigChange({ enabled })}
                className="config-switch"
              />
            </div>
          </div>

          {/* 雾类型选择 */}
          <div className="config-item">
            <span className="config-label">类型</span>
            <Radio.Group
              value={config.fog.type}
              onChange={(e) => handleFogConfigChange({ type: e.target.value })}
              className="config-radio-group"
            >
              <Radio value="Linear">Linear</Radio>
              <Radio value="Exponential">Exponential</Radio>
            </Radio.Group>
          </div>

          {/* 雾颜色 */}
          <div className="config-item">
            <span className="config-label">颜色</span>
            <Input
              type="color"
              value={config.fog.color}
              onChange={(e) => handleFogConfigChange({ color: e.target.value })}
              className="config-color-input"
            />
          </div>

          {/* 近点距离 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">近点</span>
              <span className="config-value">{config.fog.near}</span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={config.fog.near}
              onChange={(value) => handleFogConfigChange({ near: value })}
              className="config-slider"
            />
          </div>

          {/* 远点距离 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">远点</span>
              <span className="config-value">{config.fog.far}</span>
            </div>
            <Slider
              min={1}
              max={100}
              step={1}
              value={config.fog.far}
              onChange={(value) => handleFogConfigChange({ far: value })}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'rain',
      label: (
        <div className="collapse-header">
          <CloudDownloadOutlined />
          <span>雨</span>
        </div>
      ),
      children: (
        <div className="config-section">
          {/* 启用开关 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                size="small"
                checked={config.rain.enabled}
                onChange={(enabled) => handleRainConfigChange({ enabled })}
                className="config-switch"
              />
            </div>
          </div>

          {/* 速度 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">速度</span>
              <span className="config-value">{config.rain.speed}</span>
            </div>
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={config.rain.speed}
              onChange={(value) => handleRainConfigChange({ speed: value })}
              className="config-slider"
            />
          </div>

          {/* 颜色 */}
          <div className="config-item">
            <span className="config-label">颜色</span>
            <Input
              type="color"
              value={config.rain.color}
              onChange={(e) => handleRainConfigChange({ color: e.target.value })}
              className="config-color-input"
            />
          </div>

          {/* 大小 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">大小</span>
              <span className="config-value">{config.rain.size}</span>
            </div>
            <Slider
              min={0.1}
              max={2}
              step={0.1}
              value={config.rain.size}
              onChange={(value) => handleRainConfigChange({ size: value })}
              className="config-slider"
            />
          </div>

          {/* 弧度 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">弧度</span>
              <span className="config-value">{config.rain.arc}</span>
            </div>
            <Slider
              min={0}
              max={180}
              step={1}
              value={config.rain.arc}
              onChange={(value) => handleRainConfigChange({ arc: value })}
              className="config-slider"
            />
          </div>

          {/* 透明度 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">透明度</span>
              <span className="config-value">{config.rain.opacity}</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={config.rain.opacity}
              onChange={(value) => handleRainConfigChange({ opacity: value })}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'snow',
      label: (
        <div className="collapse-header">
          <StarOutlined />
          <span>雪</span>
        </div>
      ),
      children: (
        <div className="config-section">
          {/* 启用开关 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                size="small"
                checked={config.snow.enabled}
                onChange={(enabled) => handleSnowConfigChange({ enabled })}
                className="config-switch"
              />
            </div>
          </div>

          {/* 速度 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">速度</span>
              <span className="config-value">{config.snow.speed}</span>
            </div>
            <Slider
              min={0.1}
              max={3}
              step={0.1}
              value={config.snow.speed}
              onChange={(value) => handleSnowConfigChange({ speed: value })}
              className="config-slider"
            />
          </div>

          {/* 密度 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">密度</span>
              <span className="config-value">{config.snow.density}</span>
            </div>
            <Slider
              min={0.1}
              max={5}
              step={0.1}
              value={config.snow.density}
              onChange={(value) => handleSnowConfigChange({ density: value })}
              className="config-slider"
            />
          </div>

          {/* 大小 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">大小</span>
              <span className="config-value">{config.snow.size}</span>
            </div>
            <Slider
              min={0.1}
              max={2}
              step={0.1}
              value={config.snow.size}
              onChange={(value) => handleSnowConfigChange({ size: value })}
              className="config-slider"
            />
          </div>

          {/* 透明度 */}
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">透明度</span>
              <span className="config-value">{config.snow.opacity}</span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={config.snow.opacity}
              onChange={(value) => handleSnowConfigChange({ opacity: value })}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="weather-config-panel">
      <Collapse
        items={collapseItems}
        defaultActiveKey={['fog', 'rain', 'snow']}
        ghost
        size="small"
        className="config-collapse"
      />
    </div>
  );
};

export default WeatherConfigPanel; 