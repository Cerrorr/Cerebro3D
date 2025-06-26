/**
 * 渲染器配置面板组件
 * @author Cerror
 * @since 2024-01-22
 */

import React, { useCallback } from 'react';
import { Collapse, Switch, Select, Slider, Input, InputNumber } from 'antd';
import { 
  DesktopOutlined,
  CloudOutlined,
  BulbOutlined
} from '@ant-design/icons';
import type { 
  RendererConfigPanelProps,
  RendererConfig,
  RendererAntialiasingConfig,
  ToneMappingConfig,
  FrameRateConfig,
  RendererShadowConfig,
  GlobalIlluminationConfig
} from './types/rendererConfig.types';
import './styles/RendererConfigPanel.scss';

const { Option } = Select;

/**
 * 渲染器配置面板组件
 * 提供渲染器相关的详细配置选项
 * @author Cerror
 * @since 2024-01-22
 */
const RendererConfigPanel: React.FC<RendererConfigPanelProps> = ({
  config,
  onChange
}) => {
  // 抗锯齿配置更新处理函数
  const handleAntialiasingChange = useCallback((updates: Partial<RendererAntialiasingConfig>) => {
    const newConfig: RendererConfig = {
      ...config,
      antialiasing: { ...config.antialiasing, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 色调映射配置更新处理函数
  const handleToneMappingChange = useCallback((updates: Partial<ToneMappingConfig>) => {
    const newConfig: RendererConfig = {
      ...config,
      toneMapping: { ...config.toneMapping, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 帧率限制配置更新处理函数
  const handleFrameRateChange = useCallback((updates: Partial<FrameRateConfig>) => {
    const newConfig: RendererConfig = {
      ...config,
      frameRate: { ...config.frameRate, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 阴影配置更新处理函数
  const handleShadowChange = useCallback((updates: Partial<RendererShadowConfig>) => {
    const newConfig: RendererConfig = {
      ...config,
      shadow: { ...config.shadow, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 全局光影配置更新处理函数
  const handleGlobalIlluminationChange = useCallback((updates: Partial<GlobalIlluminationConfig>) => {
    const newConfig: RendererConfig = {
      ...config,
      globalIllumination: { ...config.globalIllumination, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  const collapseItems = [
    {
      key: 'renderer',
      label: (
        <span>
          <DesktopOutlined />
          渲染器
        </span>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">抗锯齿</span>
              <Switch
                checked={config.antialiasing.enabled}
                onChange={(enabled) => handleAntialiasingChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">色调映射</span>
            <Select
              value={config.toneMapping.type}
              onChange={(type) => handleToneMappingChange({ type })}
              className="config-select"
              size="small"
            >
              <Option value="No">No</Option>
              <Option value="Linear">Linear</Option>
              <Option value="Reinhard">Reinhard</Option>
              <Option value="Cineon">Cineon</Option>
              <Option value="ACESFilmic">ACESFilmic</Option>
            </Select>
          </div>

          <div className="config-item">
            <span className="config-label">帧率限制</span>
            <Select
              value={config.frameRate.type}
              onChange={(type) => handleFrameRateChange({ type })}
              className="config-select"
              size="small"
            >
              <Option value="高帧率">高帧率</Option>
              <Option value="中帧率">中帧率</Option>
              <Option value="低帧率">低帧率</Option>
              <Option value="自适应">自适应</Option>
            </Select>
          </div>
        </div>
      ),
    },
    {
      key: 'shadow',
      label: (
        <span>
          <CloudOutlined />
          阴影
        </span>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.shadow.enabled}
                onChange={(enabled) => handleShadowChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">类型</span>
            <Select
              value={config.shadow.type}
              onChange={(type) => handleShadowChange({ type })}
              disabled={!config.shadow.enabled}
              className="config-select"
              size="small"
            >
              <Option value="Basic">Basic</Option>
              <Option value="PCF">PCF</Option>
              <Option value="PCF Soft">PCF Soft</Option>
              <Option value="VSM">VSM</Option>
            </Select>
          </div>
        </div>
      ),
    },
    {
      key: 'globalIllumination',
      label: (
        <span>
          <BulbOutlined />
          全局光影
        </span>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.globalIllumination.enabled}
                onChange={(enabled) => handleGlobalIlluminationChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">溢出</span>
              <Switch
                checked={config.globalIllumination.bounce}
                onChange={(bounce) => handleGlobalIlluminationChange({ bounce })}
                className="config-switch"
                size="small"
                disabled={!config.globalIllumination.enabled}
              />
            </div>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">阴影远距</span>
              <span className="config-value">{config.globalIllumination.shadowDistance}</span>
            </div>
            <InputNumber
              value={config.globalIllumination.shadowDistance}
              onChange={(shadowDistance) => handleGlobalIlluminationChange({ shadowDistance: shadowDistance || 1000 })}
              disabled={!config.globalIllumination.enabled}
              className="config-number-input"
              min={100}
              max={10000}
              step={100}
            />
          </div>

          <div className="config-item">
            <span className="config-label">视锥体分割</span>
            <Select
              value={config.globalIllumination.cascadeSplits}
              onChange={(cascadeSplits) => handleGlobalIlluminationChange({ cascadeSplits })}
              disabled={!config.globalIllumination.enabled}
              className="config-select"
              size="small"
            >
              <Option value="practical">practical</Option>
              <Option value="uniform">uniform</Option>
              <Option value="logarithmic">logarithmic</Option>
            </Select>
          </div>

          <div className="config-item">
            <span className="config-label">阴影贴图</span>
            <Select
              value={config.globalIllumination.shadowMapSize}
              onChange={(shadowMapSize) => handleGlobalIlluminationChange({ shadowMapSize })}
              disabled={!config.globalIllumination.enabled}
              className="config-select"
              size="small"
            >
              <Option value="1024 * 1024">1024 * 1024</Option>
              <Option value="2048 * 2048">2048 * 2048</Option>
              <Option value="4096 * 4096">4096 * 4096</Option>
            </Select>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光强度</span>
              <span className="config-value">{config.globalIllumination.lightIntensity}</span>
            </div>
            <InputNumber
              value={config.globalIllumination.lightIntensity}
              onChange={(lightIntensity) => handleGlobalIlluminationChange({ lightIntensity: lightIntensity || 1 })}
              disabled={!config.globalIllumination.enabled}
              className="config-number-input"
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <div className="config-item">
            <span className="config-label">光颜色</span>
            <Input
              type="color"
              value={config.globalIllumination.lightColor}
              onChange={(e) => handleGlobalIlluminationChange({ lightColor: e.target.value })}
              disabled={!config.globalIllumination.enabled}
              className="config-color-input"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光方向X</span>
              <span className="config-value">{config.globalIllumination.lightDirectionX.toFixed(2)}</span>
            </div>
            <Slider
              min={-1}
              max={1}
              step={0.01}
              value={config.globalIllumination.lightDirectionX}
              onChange={(lightDirectionX) => handleGlobalIlluminationChange({ lightDirectionX })}
              disabled={!config.globalIllumination.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光方向Y</span>
              <span className="config-value">{config.globalIllumination.lightDirectionY.toFixed(2)}</span>
            </div>
            <Slider
              min={-1}
              max={1}
              step={0.01}
              value={config.globalIllumination.lightDirectionY}
              onChange={(lightDirectionY) => handleGlobalIlluminationChange({ lightDirectionY })}
              disabled={!config.globalIllumination.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光方向Z</span>
              <span className="config-value">{config.globalIllumination.lightDirectionZ.toFixed(2)}</span>
            </div>
            <Slider
              min={-1}
              max={1}
              step={0.01}
              value={config.globalIllumination.lightDirectionZ}
              onChange={(lightDirectionZ) => handleGlobalIlluminationChange({ lightDirectionZ })}
              disabled={!config.globalIllumination.enabled}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="renderer-config-panel">
      <Collapse
        items={collapseItems}
        defaultActiveKey={['renderer', 'shadow', 'globalIllumination']}
        ghost
        size="small"
        className="config-collapse"
      />
    </div>
  );
};

export default RendererConfigPanel; 