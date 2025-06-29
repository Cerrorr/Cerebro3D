/**
 * 灯光配置面板组件
 * 支持环境光、平行光、半球光、点光源、聚光灯的配置
 * @author Cerror
 * @since 2024-01-22
 */

import React, { useState, useCallback } from 'react';
import { Collapse, InputNumber, Switch, Space, Typography, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { 
  DownOutlined, 
  BulbOutlined,
  SunOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  HighlightOutlined
} from '@ant-design/icons';
import type { 
  LightingConfigPanelProps,
  LightingConfig,
  Vector3
} from './types';
import './styles/LightingConfigPanel.scss';

const { Panel } = Collapse;
const { Text } = Typography;

/**
 * 灯光配置面板组件
 */
const LightingConfigPanel: React.FC<LightingConfigPanelProps> = ({
  lightingConfig,
  onLightingConfigChange
}) => {
  const [activeKey, setActiveKey] = useState<string[]>(['ambient', 'directional']);

  /**
   * 处理环境光配置变化
   */
  const handleAmbientChange = useCallback((field: string, value: any) => {
    onLightingConfigChange({
      ambient: {
        ...lightingConfig.ambient,
        [field]: value
      }
    });
  }, [lightingConfig.ambient, onLightingConfigChange]);

  /**
   * 处理平行光配置变化
   */
  const handleDirectionalChange = useCallback((field: string, value: any) => {
    onLightingConfigChange({
      directional: {
        ...lightingConfig.directional,
        [field]: value
      }
    });
  }, [lightingConfig.directional, onLightingConfigChange]);

  /**
   * 处理半球光配置变化
   */
  const handleHemisphereChange = useCallback((field: string, value: any) => {
    onLightingConfigChange({
      hemisphere: {
        ...lightingConfig.hemisphere,
        [field]: value
      }
    });
  }, [lightingConfig.hemisphere, onLightingConfigChange]);

  /**
   * 处理点光源配置变化
   */
  const handlePointChange = useCallback((field: string, value: any) => {
    onLightingConfigChange({
      point: {
        ...lightingConfig.point,
        [field]: value
      }
    });
  }, [lightingConfig.point, onLightingConfigChange]);

  /**
   * 处理聚光灯配置变化
   */
  const handleSpotChange = useCallback((field: string, value: any) => {
    onLightingConfigChange({
      spot: {
        ...lightingConfig.spot,
        [field]: value
      }
    });
  }, [lightingConfig.spot, onLightingConfigChange]);

  /**
   * 处理位置变化
   */
  const handlePositionChange = useCallback((
    lightType: keyof LightingConfig,
    axis: keyof Vector3,
    value: number
  ) => {
    const currentConfig = lightingConfig[lightType] as any;
    onLightingConfigChange({
      [lightType]: {
        ...currentConfig,
        position: {
          ...currentConfig.position,
          [axis]: value || 0
        }
      }
    });
  }, [lightingConfig, onLightingConfigChange]);

  /**
   * 处理目标点变化（聚光灯）
   */
  const handleTargetChange = useCallback((axis: keyof Vector3, value: number) => {
    onLightingConfigChange({
      spot: {
        ...lightingConfig.spot,
        target: {
          ...lightingConfig.spot.target,
          [axis]: value || 0
        }
      }
    });
  }, [lightingConfig.spot, onLightingConfigChange]);

  /**
   * 处理颜色变化
   */
  const handleColorChange = useCallback((
    lightType: keyof LightingConfig,
    field: string,
    color: Color
  ) => {
    const currentConfig = lightingConfig[lightType] as any;
    onLightingConfigChange({
      [lightType]: {
        ...currentConfig,
        [field]: color.toHexString()
      }
    });
  }, [lightingConfig, onLightingConfigChange]);

  return (
    <div className="lighting-config-panel">
      <Collapse 
        activeKey={activeKey}
        onChange={setActiveKey}
        ghost
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
      >
        {/* 环境光 */}
        <Panel 
          header={
            <Space>
              <BulbOutlined />
              <span>环境光</span>
              <Switch 
                size="small"
                checked={lightingConfig.ambient.enabled}
                onChange={(checked) => handleAmbientChange('enabled', checked)}
              />
            </Space>
          } 
          key="ambient"
        >
          <div className="config-section">
            <div className="config-item">
              <label className="config-label">强度</label>
              <InputNumber
                value={lightingConfig.ambient.intensity}
                onChange={(value) => handleAmbientChange('intensity', value || 0)}
                min={0}
                max={2}
                step={0.1}
                className="config-input-number"
                disabled={!lightingConfig.ambient.enabled}
              />
            </div>
            
            <div className="config-item">
              <label className="config-label">颜色</label>
              <ColorPicker
                value={lightingConfig.ambient.color}
                onChange={(color) => handleColorChange('ambient', 'color', color)}
                disabled={!lightingConfig.ambient.enabled}
                className="config-color-picker"
              />
            </div>
          </div>
        </Panel>

        {/* 平行光 */}
        <Panel 
          header={
            <Space>
              <SunOutlined />
              <span>平行光</span>
              <Switch 
                size="small"
                checked={lightingConfig.directional.enabled}
                onChange={(checked) => handleDirectionalChange('enabled', checked)}
              />
            </Space>
          } 
          key="directional"
        >
          <div className="config-section">
            <div className="config-item">
              <label className="config-label">强度</label>
              <InputNumber
                value={lightingConfig.directional.intensity}
                onChange={(value) => handleDirectionalChange('intensity', value || 0)}
                min={0}
                max={2}
                step={0.1}
                className="config-input-number"
                disabled={!lightingConfig.directional.enabled}
              />
            </div>
            
            <div className="config-item">
              <label className="config-label">颜色</label>
              <ColorPicker
                value={lightingConfig.directional.color}
                onChange={(color) => handleColorChange('directional', 'color', color)}
                disabled={!lightingConfig.directional.enabled}
                className="config-color-picker"
              />
            </div>

            {/* 位置 */}
            <div className="config-group">
              <Text className="config-group-title">位置</Text>
              <div className="config-row">
                <div className="config-item config-item--third">
                  <label className="config-label">X</label>
                  <InputNumber
                    value={lightingConfig.directional.position.x}
                    onChange={(value) => handlePositionChange('directional', 'x', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.directional.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Y</label>
                  <InputNumber
                    value={lightingConfig.directional.position.y}
                    onChange={(value) => handlePositionChange('directional', 'y', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.directional.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Z</label>
                  <InputNumber
                    value={lightingConfig.directional.position.z}
                    onChange={(value) => handlePositionChange('directional', 'z', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.directional.enabled}
                  />
                </div>
              </div>
            </div>

            <div className="config-item">
              <label className="config-label">投射阴影</label>
              <Switch
                checked={lightingConfig.directional.castShadow}
                onChange={(checked) => handleDirectionalChange('castShadow', checked)}
                disabled={!lightingConfig.directional.enabled}
              />
            </div>
          </div>
        </Panel>

        {/* 半球光 */}
        <Panel 
          header={
            <Space>
              <GlobalOutlined />
              <span>半球光</span>
              <Switch 
                size="small"
                checked={lightingConfig.hemisphere.enabled}
                onChange={(checked) => handleHemisphereChange('enabled', checked)}
              />
            </Space>
          } 
          key="hemisphere"
        >
          <div className="config-section">
            <div className="config-item">
              <label className="config-label">强度</label>
              <InputNumber
                value={lightingConfig.hemisphere.intensity}
                onChange={(value) => handleHemisphereChange('intensity', value || 0)}
                min={0}
                max={2}
                step={0.1}
                className="config-input-number"
                disabled={!lightingConfig.hemisphere.enabled}
              />
            </div>
            
            <div className="config-item">
              <label className="config-label">天空颜色</label>
              <ColorPicker
                value={lightingConfig.hemisphere.skyColor}
                onChange={(color) => handleColorChange('hemisphere', 'skyColor', color)}
                disabled={!lightingConfig.hemisphere.enabled}
                className="config-color-picker"
              />
            </div>

            <div className="config-item">
              <label className="config-label">地面颜色</label>
              <ColorPicker
                value={lightingConfig.hemisphere.groundColor}
                onChange={(color) => handleColorChange('hemisphere', 'groundColor', color)}
                disabled={!lightingConfig.hemisphere.enabled}
                className="config-color-picker"
              />
            </div>

            {/* 位置 */}
            <div className="config-group">
              <Text className="config-group-title">位置</Text>
              <div className="config-row">
                <div className="config-item config-item--third">
                  <label className="config-label">X</label>
                  <InputNumber
                    value={lightingConfig.hemisphere.position.x}
                    onChange={(value) => handlePositionChange('hemisphere', 'x', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.hemisphere.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Y</label>
                  <InputNumber
                    value={lightingConfig.hemisphere.position.y}
                    onChange={(value) => handlePositionChange('hemisphere', 'y', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.hemisphere.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Z</label>
                  <InputNumber
                    value={lightingConfig.hemisphere.position.z}
                    onChange={(value) => handlePositionChange('hemisphere', 'z', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.hemisphere.enabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* 点光源 */}
        <Panel 
          header={
            <Space>
              <EnvironmentOutlined />
              <span>点光源</span>
              <Switch 
                size="small"
                checked={lightingConfig.point.enabled}
                onChange={(checked) => handlePointChange('enabled', checked)}
              />
            </Space>
          } 
          key="point"
        >
          <div className="config-section">
            <div className="config-item">
              <label className="config-label">强度</label>
              <InputNumber
                value={lightingConfig.point.intensity}
                onChange={(value) => handlePointChange('intensity', value || 0)}
                min={0}
                max={2}
                step={0.1}
                className="config-input-number"
                disabled={!lightingConfig.point.enabled}
              />
            </div>
            
            <div className="config-item">
              <label className="config-label">颜色</label>
              <ColorPicker
                value={lightingConfig.point.color}
                onChange={(color) => handleColorChange('point', 'color', color)}
                disabled={!lightingConfig.point.enabled}
                className="config-color-picker"
              />
            </div>

            <div className="config-row">
              <div className="config-item config-item--half">
                <label className="config-label">距离</label>
                <InputNumber
                  value={lightingConfig.point.distance}
                  onChange={(value) => handlePointChange('distance', value || 0)}
                  min={0}
                  max={100}
                  step={1}
                  className="config-input-number"
                  disabled={!lightingConfig.point.enabled}
                />
              </div>
              <div className="config-item config-item--half">
                <label className="config-label">衰减</label>
                <InputNumber
                  value={lightingConfig.point.decay}
                  onChange={(value) => handlePointChange('decay', value || 0)}
                  min={0}
                  max={2}
                  step={0.1}
                  className="config-input-number"
                  disabled={!lightingConfig.point.enabled}
                />
              </div>
            </div>

            {/* 位置 */}
            <div className="config-group">
              <Text className="config-group-title">位置</Text>
              <div className="config-row">
                <div className="config-item config-item--third">
                  <label className="config-label">X</label>
                  <InputNumber
                    value={lightingConfig.point.position.x}
                    onChange={(value) => handlePositionChange('point', 'x', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.point.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Y</label>
                  <InputNumber
                    value={lightingConfig.point.position.y}
                    onChange={(value) => handlePositionChange('point', 'y', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.point.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Z</label>
                  <InputNumber
                    value={lightingConfig.point.position.z}
                    onChange={(value) => handlePositionChange('point', 'z', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.point.enabled}
                  />
                </div>
              </div>
            </div>

            <div className="config-item">
              <label className="config-label">投射阴影</label>
              <Switch
                checked={lightingConfig.point.castShadow}
                onChange={(checked) => handlePointChange('castShadow', checked)}
                disabled={!lightingConfig.point.enabled}
              />
            </div>

            <div className="config-item">
              <label className="config-label">阴影贴图尺寸</label>
              <InputNumber
                value={lightingConfig.point.shadowMapSize}
                onChange={(value) => handlePointChange('shadowMapSize', value || 512)}
                min={256}
                max={2048}
                step={256}
                className="config-input-number"
                disabled={!lightingConfig.point.enabled || !lightingConfig.point.castShadow}
              />
            </div>
          </div>
        </Panel>

        {/* 聚光灯 */}
        <Panel 
          header={
            <Space>
              <HighlightOutlined />
              <span>聚光灯</span>
              <Switch 
                size="small"
                checked={lightingConfig.spot.enabled}
                onChange={(checked) => handleSpotChange('enabled', checked)}
              />
            </Space>
          } 
          key="spot"
        >
          <div className="config-section">
            <div className="config-item">
              <label className="config-label">强度</label>
              <InputNumber
                value={lightingConfig.spot.intensity}
                onChange={(value) => handleSpotChange('intensity', value || 0)}
                min={0}
                max={2}
                step={0.1}
                className="config-input-number"
                disabled={!lightingConfig.spot.enabled}
              />
            </div>
            
            <div className="config-item">
              <label className="config-label">颜色</label>
              <ColorPicker
                value={lightingConfig.spot.color}
                onChange={(color) => handleColorChange('spot', 'color', color)}
                disabled={!lightingConfig.spot.enabled}
                className="config-color-picker"
              />
            </div>

            <div className="config-row">
              <div className="config-item config-item--half">
                <label className="config-label">距离</label>
                <InputNumber
                  value={lightingConfig.spot.distance}
                  onChange={(value) => handleSpotChange('distance', value || 0)}
                  min={0}
                  max={100}
                  step={1}
                  className="config-input-number"
                  disabled={!lightingConfig.spot.enabled}
                />
              </div>
              <div className="config-item config-item--half">
                <label className="config-label">衰减</label>
                <InputNumber
                  value={lightingConfig.spot.decay}
                  onChange={(value) => handleSpotChange('decay', value || 0)}
                  min={0}
                  max={2}
                  step={0.1}
                  className="config-input-number"
                  disabled={!lightingConfig.spot.enabled}
                />
              </div>
            </div>

            <div className="config-row">
              <div className="config-item config-item--half">
                <label className="config-label">角度</label>
                <InputNumber
                  value={Math.round(lightingConfig.spot.angle * 180 / Math.PI)}
                  onChange={(value) => handleSpotChange('angle', (value || 45) * Math.PI / 180)}
                  min={0}
                  max={90}
                  step={1}
                  className="config-input-number"
                  disabled={!lightingConfig.spot.enabled}
                />
              </div>
              <div className="config-item config-item--half">
                <label className="config-label">半影</label>
                <InputNumber
                  value={lightingConfig.spot.penumbra}
                  onChange={(value) => handleSpotChange('penumbra', value || 0)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="config-input-number"
                  disabled={!lightingConfig.spot.enabled}
                />
              </div>
            </div>

            {/* 位置 */}
            <div className="config-group">
              <Text className="config-group-title">位置</Text>
              <div className="config-row">
                <div className="config-item config-item--third">
                  <label className="config-label">X</label>
                  <InputNumber
                    value={lightingConfig.spot.position.x}
                    onChange={(value) => handlePositionChange('spot', 'x', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.spot.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Y</label>
                  <InputNumber
                    value={lightingConfig.spot.position.y}
                    onChange={(value) => handlePositionChange('spot', 'y', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.spot.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Z</label>
                  <InputNumber
                    value={lightingConfig.spot.position.z}
                    onChange={(value) => handlePositionChange('spot', 'z', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.spot.enabled}
                  />
                </div>
              </div>
            </div>

            {/* 目标点 */}
            <div className="config-group">
              <Text className="config-group-title">目标点</Text>
              <div className="config-row">
                <div className="config-item config-item--third">
                  <label className="config-label">X</label>
                  <InputNumber
                    value={lightingConfig.spot.target.x}
                    onChange={(value) => handleTargetChange('x', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.spot.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Y</label>
                  <InputNumber
                    value={lightingConfig.spot.target.y}
                    onChange={(value) => handleTargetChange('y', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.spot.enabled}
                  />
                </div>
                <div className="config-item config-item--third">
                  <label className="config-label">Z</label>
                  <InputNumber
                    value={lightingConfig.spot.target.z}
                    onChange={(value) => handleTargetChange('z', value || 0)}
                    step={0.1}
                    className="config-input-number"
                    disabled={!lightingConfig.spot.enabled}
                  />
                </div>
              </div>
            </div>

            <div className="config-item">
              <label className="config-label">投射阴影</label>
              <Switch
                checked={lightingConfig.spot.castShadow}
                onChange={(checked) => handleSpotChange('castShadow', checked)}
                disabled={!lightingConfig.spot.enabled}
              />
            </div>

            <div className="config-item">
              <label className="config-label">阴影贴图尺寸</label>
              <InputNumber
                value={lightingConfig.spot.shadowMapSize}
                onChange={(value) => handleSpotChange('shadowMapSize', value || 512)}
                min={256}
                max={2048}
                step={256}
                className="config-input-number"
                disabled={!lightingConfig.spot.enabled || !lightingConfig.spot.castShadow}
              />
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default LightingConfigPanel; 