/**
 * 渲染器配置面板组件
 * @author Cerror
 * @since 2025-06-26
 */

import React, { useCallback, memo } from 'react';
import { Select as AntSelect, Collapse } from 'antd';
import { RSwitch, RSelect, RSlider, RInput, RInputNumber } from '@/components/common/recordable';
import { useRecord } from '@/hooks/common/useRecord';
import { useThrottledCallback } from '@/hooks/common/useThrottledCallback';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  DesktopOutlined,
  CloudOutlined,
  BulbOutlined,
  DownOutlined
} from '@ant-design/icons';
import {
  setAntialiasingConfig,
  setToneMappingConfig,
  setFrameRateConfig,
  setShadowConfig,
  setGlobalIlluminationConfig,
} from '@/store/slices/rendererSlice';
import type { 
  RendererAntialiasingConfig,
  ToneMappingConfig,
  FrameRateConfig,
  RendererShadowConfig,
  GlobalIlluminationConfig
} from './types/RendererConfig.types';
import './styles/RendererConfigPanel.scss';

const { Option } = AntSelect;

/**
 * 渲染器配置面板组件
 * 提供渲染器相关的详细配置选项
 * @author Cerror
 * @since 2025-06-26
 */
const RendererConfigPanel: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const rendererConfig = useAppSelector(state => state.renderer.config);
  
  // 记录器
  const record = useRecord('渲染器');

  // 抗锯齿配置更新处理函数
  const handleAntialiasingChange = useCallback((updates: Partial<RendererAntialiasingConfig>) => {
    dispatch(setAntialiasingConfig(updates));
  }, [dispatch]);

  // 色调映射配置更新处理函数
  const handleToneMappingChange = useCallback((updates: Partial<ToneMappingConfig>) => {
    dispatch(setToneMappingConfig(updates));
  }, [dispatch]);

  // 帧率限制配置更新处理函数
  const handleFrameRateChange = useCallback((updates: Partial<FrameRateConfig>) => {
    dispatch(setFrameRateConfig(updates));
  }, [dispatch]);

  // 阴影配置更新处理函数
  const handleShadowChange = useCallback((updates: Partial<RendererShadowConfig>) => {
    dispatch(setShadowConfig(updates));
  }, [dispatch]);

  // 全局光影配置更新处理函数
  const handleGlobalIlluminationChange = useCallback((updates: Partial<GlobalIlluminationConfig>) => {
    dispatch(setGlobalIlluminationConfig(updates));
  }, [dispatch]);

  // 节流处理滑块操作以提高性能
  const throttledGlobalIlluminationChange = useThrottledCallback(handleGlobalIlluminationChange, 50);

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
                checked={rendererConfig.antialiasing.enabled}
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
              value={rendererConfig.toneMapping.type}
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
              value={rendererConfig.frameRate.type}
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
                checked={rendererConfig.shadow.enabled}
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
              value={rendererConfig.shadow.type}
              onChange={(type) => handleShadowChange({ type })}
              disabled={!rendererConfig.shadow.enabled}
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
                checked={rendererConfig.globalIllumination.enabled}
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
                checked={rendererConfig.globalIllumination.bounce}
                onChange={(bounce: boolean) => handleGlobalIlluminationChange({ bounce })}
                className="config-switch"
                size="small"
                disabled={!rendererConfig.globalIllumination.enabled}
              />
            </div>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">阴影远距</span>
              <span className="config-value">{rendererConfig.globalIllumination.shadowDistance}</span>
            </div>
            <RInputNumber
              record={record}
              field="globalIllumination.shadowDistance"
              value={rendererConfig.globalIllumination.shadowDistance}
              onChange={(val) => handleGlobalIlluminationChange({ shadowDistance: Number(val ?? 1000) })}
              disabled={!rendererConfig.globalIllumination.enabled}
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
              value={rendererConfig.globalIllumination.cascadeSplits}
              onChange={(cascadeSplits) => handleGlobalIlluminationChange({ cascadeSplits })}
              disabled={!rendererConfig.globalIllumination.enabled}
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
              value={rendererConfig.globalIllumination.shadowMapSize}
              onChange={(shadowMapSize) => handleGlobalIlluminationChange({ shadowMapSize })}
              disabled={!rendererConfig.globalIllumination.enabled}
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
              <span className="config-value">{rendererConfig.globalIllumination.lightIntensity}</span>
            </div>
            <RInputNumber
              record={record}
              field="globalIllumination.lightIntensity"
              value={rendererConfig.globalIllumination.lightIntensity}
              onChange={(val) => handleGlobalIlluminationChange({ lightIntensity: Number(val ?? 1) })}
              disabled={!rendererConfig.globalIllumination.enabled}
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
              value={rendererConfig.globalIllumination.lightColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGlobalIlluminationChange({ lightColor: e.target.value })}
              disabled={!rendererConfig.globalIllumination.enabled}
              className="config-color-input"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光方向X</span>
              <span className="config-value">{rendererConfig.globalIllumination.lightDirectionX.toFixed(2)}</span>
            </div>
            <RSlider
              record={record}
              field="globalIllumination.lightDirectionX"
              min={-1}
              max={1}
              step={0.01}
              value={rendererConfig.globalIllumination.lightDirectionX}
              onChange={(lightDirectionX) => throttledGlobalIlluminationChange({ lightDirectionX })}
              onChangeComplete={(lightDirectionX) => handleGlobalIlluminationChange({ lightDirectionX })}
              disabled={!rendererConfig.globalIllumination.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光方向Y</span>
              <span className="config-value">{rendererConfig.globalIllumination.lightDirectionY.toFixed(2)}</span>
            </div>
            <RSlider
              record={record}
              field="globalIllumination.lightDirectionY"
              min={-1}
              max={1}
              step={0.01}
              value={rendererConfig.globalIllumination.lightDirectionY}
              onChange={(lightDirectionY) => throttledGlobalIlluminationChange({ lightDirectionY })}
              onChangeComplete={(lightDirectionY) => handleGlobalIlluminationChange({ lightDirectionY })}
              disabled={!rendererConfig.globalIllumination.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">光方向Z</span>
              <span className="config-value">{rendererConfig.globalIllumination.lightDirectionZ.toFixed(2)}</span>
            </div>
            <RSlider
              record={record}
              field="globalIllumination.lightDirectionZ"
              min={-1}
              max={1}
              step={0.01}
              value={rendererConfig.globalIllumination.lightDirectionZ}
              onChange={(lightDirectionZ) => throttledGlobalIlluminationChange({ lightDirectionZ })}
              onChangeComplete={(lightDirectionZ) => handleGlobalIlluminationChange({ lightDirectionZ })}
              disabled={!rendererConfig.globalIllumination.enabled}
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
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
      />
    </div>
  );
});

RendererConfigPanel.displayName = 'RendererConfigPanel';

export default RendererConfigPanel; 