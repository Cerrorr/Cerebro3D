/**
 * 渲染器配置面板组件
 * @author Cerror
 * @since 2025-06-26
 */

import React, { useCallback } from 'react';
import { Select as AntSelect } from 'antd';
import { RSwitch, RSelect, RSlider, RInput, RInputNumber } from '@/components/common/recordable';
import { useRecord } from '@/hooks/common/useRecord';
import ModernCollapse from '@/components/common/ModernCollapse';
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
} from './types';
import './styles/RendererConfigPanel.scss';

const { Option } = AntSelect;

/**
 * 渲染器配置面板组件
 * 提供渲染器相关的详细配置选项
 * @author Cerror
 * @since 2025-06-26
 */
const RendererConfigPanel: React.FC<RendererConfigPanelProps> = ({
  config,
  onChange
}) => {
  // 记录器
  const record = useRecord('渲染器');

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
        <div className="panel-header">
          <DesktopOutlined className="panel-icon" />
          <span>渲染器</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">抗锯齿</span>
              <RSwitch
                record={record}
                field="antialiasing.enabled"
                checked={config.antialiasing.enabled}
                onChange={(enabled: boolean) => handleAntialiasingChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">色调映射</span>
            <RSelect
              record={record}
              field="toneMapping.type"
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
            </RSelect>
          </div>

          <div className="config-item">
            <span className="config-label">帧率限制</span>
            <RSelect
              record={record}
              field="frameRate.type"
              value={config.frameRate.type}
              onChange={(type) => handleFrameRateChange({ type })}
              className="config-select"
              size="small"
            >
              <Option value="高帧率">高帧率</Option>
              <Option value="中帧率">中帧率</Option>
              <Option value="低帧率">低帧率</Option>
              <Option value="自适应">自适应</Option>
            </RSelect>
          </div>
        </div>
      ),
    },
    {
      key: 'shadow',
      label: (
        <div className="panel-header">
          <CloudOutlined className="panel-icon" />
          <span>阴影</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <RSwitch
                record={record}
                field="shadow.enabled"
                checked={config.shadow.enabled}
                onChange={(enabled: boolean) => handleShadowChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">类型</span>
            <RSelect
              record={record}
              field="shadow.type"
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
            </RSelect>
          </div>
        </div>
      ),
    },
    {
      key: 'globalIllumination',
      label: (
        <div className="panel-header">
          <BulbOutlined className="panel-icon" />
          <span>全局光影</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <RSwitch
                record={record}
                field="globalIllumination.enabled"
                checked={config.globalIllumination.enabled}
                onChange={(enabled: boolean) => handleGlobalIlluminationChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">溢出</span>
              <RSwitch
                record={record}
                field="globalIllumination.bounce"
                checked={config.globalIllumination.bounce}
                onChange={(bounce: boolean) => handleGlobalIlluminationChange({ bounce })}
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
            <RInputNumber
              record={record}
              field="globalIllumination.shadowDistance"
              value={config.globalIllumination.shadowDistance}
              onChange={(val) => handleGlobalIlluminationChange({ shadowDistance: Number(val ?? 1000) })}
              disabled={!config.globalIllumination.enabled}
              className="config-number-input"
              min={100}
              max={10000}
              step={100}
            />
          </div>

          <div className="config-item">
            <span className="config-label">视锥体分割</span>
            <RSelect
              record={record}
              field="globalIllumination.cascadeSplits"
              value={config.globalIllumination.cascadeSplits}
              onChange={(cascadeSplits) => handleGlobalIlluminationChange({ cascadeSplits })}
              disabled={!config.globalIllumination.enabled}
              className="config-select"
              size="small"
            >
              <Option value="practical">practical</Option>
              <Option value="uniform">uniform</Option>
              <Option value="logarithmic">logarithmic</Option>
            </RSelect>
          </div>

          <div className="config-item">
            <span className="config-label">阴影贴图</span>
            <RSelect
              record={record}
              field="globalIllumination.shadowMapSize"
              value={config.globalIllumination.shadowMapSize}
              onChange={(shadowMapSize) => handleGlobalIlluminationChange({ shadowMapSize })}
              disabled={!config.globalIllumination.enabled}
              className="config-select"
              size="small"
            >
              <Option value="1024 * 1024">1024 * 1024</Option>
              <Option value="2048 * 2048">2048 * 2048</Option>
              <Option value="4096 * 4096">4096 * 4096</Option>
            </RSelect>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光强度</span>
              <span className="config-value">{config.globalIllumination.lightIntensity}</span>
            </div>
            <RInputNumber
              record={record}
              field="globalIllumination.lightIntensity"
              value={config.globalIllumination.lightIntensity}
              onChange={(val) => handleGlobalIlluminationChange({ lightIntensity: Number(val ?? 1) })}
              disabled={!config.globalIllumination.enabled}
              className="config-number-input"
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <div className="config-item">
            <span className="config-label">光颜色</span>
            <RInput
              record={record}
              field="globalIllumination.lightColor"
              type="color"
              value={config.globalIllumination.lightColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGlobalIlluminationChange({ lightColor: e.target.value })}
              disabled={!config.globalIllumination.enabled}
              className="config-color-input"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光方向X</span>
              <span className="config-value">{config.globalIllumination.lightDirectionX.toFixed(2)}</span>
            </div>
            <RSlider
              record={record}
              field="globalIllumination.lightDirectionX"
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
            <RSlider
              record={record}
              field="globalIllumination.lightDirectionY"
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
            <RSlider
              record={record}
              field="globalIllumination.lightDirectionZ"
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
      <ModernCollapse
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