/**
 * 后期处理配置面板组件
 * @author Cerror
 * @since 2025-06-26
 */

import React, { useCallback } from 'react';
import { Switch, Select, Input, Collapse } from 'antd';
import { 
  CameraOutlined, 
  BorderlessTableOutlined, 
  AppstoreOutlined,
  CheckCircleOutlined,
  BorderOutlined,
  GoldOutlined,
  FilterOutlined,
  FastForwardOutlined
} from '@ant-design/icons';
import type { 
  PostProcessingPanelProps, 
  PostProcessingConfig,
  AntialiasingConfig,
  OutlineConfig,
  BloomConfig,
  LUTConfig,
  MotionBlurConfig,
  ZoomConfig,
  PixelConfig,
  HalftoneConfig
} from './types';
import './styles/PostProcessingPanel.scss';
import { useRecord } from '@/hooks/common/useRecord';
import { RSlider } from '@/components/common/recordable';

const { Option } = Select;

const PostProcessingPanel: React.FC<PostProcessingPanelProps> = ({
  config,
  onChange
}) => {
  // 记录器
  const record = useRecord('后期处理');

  // 抗锯齿配置更新
  const handleAntialiasingChange = useCallback((updates: Partial<AntialiasingConfig>) => {
    record(`抗锯齿 ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      antialiasing: { ...config.antialiasing, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 描边线配置更新
  const handleOutlineChange = useCallback((updates: Partial<OutlineConfig>) => {
    record(`描边线 ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      outline: { ...config.outline, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 辉光配置更新
  const handleBloomChange = useCallback((updates: Partial<BloomConfig>) => {
    record(`辉光 ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      bloom: { ...config.bloom, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // LUT配置更新
  const handleLUTChange = useCallback((updates: Partial<LUTConfig>) => {
    record(`LUT ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      lut: { ...config.lut, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 运动残影配置更新
  const handleMotionBlurChange = useCallback((updates: Partial<MotionBlurConfig>) => {
    record(`运动残影 ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      motionBlur: { ...config.motionBlur, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 变焦配置更新
  const handleZoomChange = useCallback((updates: Partial<ZoomConfig>) => {
    record(`变焦 ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      zoom: { ...config.zoom, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 像素风配置更新
  const handlePixelChange = useCallback((updates: Partial<PixelConfig>) => {
    record(`像素风 ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      pixel: { ...config.pixel, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  // 半色调配置更新
  const handleHalftoneChange = useCallback((updates: Partial<HalftoneConfig>) => {
    record(`半色调 ${Object.keys(updates).join(',')} 修改`);
    const newConfig: PostProcessingConfig = {
      ...config,
      halftone: { ...config.halftone, ...updates }
    };
    onChange(newConfig);
  }, [config, onChange]);

  const collapseItems = [
    {
      key: 'antialiasing',
      label: (
        <div className="panel-header">
          <CheckCircleOutlined className="panel-icon" />
          <span>抗锯齿</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.antialiasing.enabled}
                onChange={(enabled) => handleAntialiasingChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'outline',
      label: (
        <div className="panel-header">
          <BorderOutlined className="panel-icon" />
          <span>描边线</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.outline.enabled}
                onChange={(enabled) => handleOutlineChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">边缘强度</span>
              <span className="config-value">{config.outline.edgeStrength}</span>
            </div>
            <RSlider
              record={record}
              field="outline.edgeStrength"
              min={0}
              max={5}
              step={0.1}
              value={config.outline.edgeStrength}
              onChange={(edgeStrength) => handleOutlineChange({ edgeStrength })}
              onChangeComplete={(edgeStrength) => handleOutlineChange({ edgeStrength })}
              disabled={!config.outline.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">边缘发光</span>
              <span className="config-value">{config.outline.edgeGlow}</span>
            </div>
            <RSlider
              record={record}
              field="outline.edgeGlow"
              min={0}
              max={2}
              step={0.1}
              value={config.outline.edgeGlow}
              onChange={(edgeGlow) => handleOutlineChange({ edgeGlow })}
              onChangeComplete={(edgeGlow) => handleOutlineChange({ edgeGlow })}
              disabled={!config.outline.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">边缘厚度</span>
              <span className="config-value">{config.outline.edgeThickness}</span>
            </div>
            <RSlider
              record={record}
              field="outline.edgeThickness"
              min={0.1}
              max={5}
              step={0.1}
              value={config.outline.edgeThickness}
              onChange={(edgeThickness) => handleOutlineChange({ edgeThickness })}
              onChangeComplete={(edgeThickness) => handleOutlineChange({ edgeThickness })}
              disabled={!config.outline.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">可见边缘</span>
            <Input
              type="color"
              value={config.outline.visibleEdgeColor}
              onChange={(e) => handleOutlineChange({ visibleEdgeColor: e.target.value })}
              disabled={!config.outline.enabled}
              className="config-color-input"
            />
          </div>

          <div className="config-item">
            <span className="config-label">不可见边缘</span>
            <Input
              type="color"
              value={config.outline.hiddenEdgeColor}
              onChange={(e) => handleOutlineChange({ hiddenEdgeColor: e.target.value })}
              disabled={!config.outline.enabled}
              className="config-color-input"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'bloom',
      label: (
        <div className="panel-header">
          <GoldOutlined className="panel-icon" />
          <span>辉光</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.bloom.enabled}
                onChange={(enabled) => handleBloomChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">半径</span>
              <span className="config-value">{config.bloom.radius}</span>
            </div>
            <RSlider
              record={record}
              field="bloom.radius"
              min={0.1}
              max={2}
              step={0.1}
              value={config.bloom.radius}
              onChange={(radius) => handleBloomChange({ radius })}
              onChangeComplete={(radius) => handleBloomChange({ radius })}
              disabled={!config.bloom.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">阈值</span>
              <span className="config-value">{config.bloom.threshold}</span>
            </div>
            <RSlider
              record={record}
              field="bloom.threshold"
              min={0}
              max={1}
              step={0.01}
              value={config.bloom.threshold}
              onChange={(threshold) => handleBloomChange({ threshold })}
              onChangeComplete={(threshold) => handleBloomChange({ threshold })}
              disabled={!config.bloom.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">强度</span>
              <span className="config-value">{config.bloom.strength}</span>
            </div>
            <RSlider
              record={record}
              field="bloom.strength"
              min={0}
              max={3}
              step={0.1}
              value={config.bloom.strength}
              onChange={(strength) => handleBloomChange({ strength })}
              onChangeComplete={(strength) => handleBloomChange({ strength })}
              disabled={!config.bloom.enabled}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'lut',
      label: (
        <div className="panel-header">
          <FilterOutlined className="panel-icon" />
          <span>LUT 颜色滤镜</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.lut.enabled}
                onChange={(enabled) => handleLUTChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">LUT</span>
            <Select
              value={config.lut.lutType}
              onChange={(lutType) => handleLUTChange({ lutType })}
              disabled={!config.lut.enabled}
              className="config-select"
              size="small"
            >
              <Option value="Bourbon 64.CUBE">Bourbon 64.CUBE</Option>
              <Option value="Cinematic">Cinematic</Option>
              <Option value="Warm">Warm</Option>
              <Option value="Cool">Cool</Option>
              <Option value="Vintage">Vintage</Option>
            </Select>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">强度</span>
              <span className="config-value">{config.lut.intensity}</span>
            </div>
            <RSlider
              record={record}
              field="lut.intensity"
              min={0}
              max={1}
              step={0.1}
              value={config.lut.intensity}
              onChange={(intensity) => handleLUTChange({ intensity })}
              onChangeComplete={(intensity) => handleLUTChange({ intensity })}
              disabled={!config.lut.enabled}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'motionBlur',
      label: (
        <div className="panel-header">
          <FastForwardOutlined className="panel-icon" />
          <span>运动残影</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.motionBlur.enabled}
                onChange={(enabled) => handleMotionBlurChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">衰减</span>
              <span className="config-value">{config.motionBlur.decay}</span>
            </div>
            <RSlider
              record={record}
              field="motionBlur.decay"
              min={0.1}
              max={1}
              step={0.01}
              value={config.motionBlur.decay}
              onChange={(decay) => handleMotionBlurChange({ decay })}
              onChangeComplete={(decay) => handleMotionBlurChange({ decay })}
              disabled={!config.motionBlur.enabled}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'zoom',
      label: (
        <div className="panel-header">
          <CameraOutlined className="panel-icon" />
          <span>变焦</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.zoom.enabled}
                onChange={(enabled) => handleZoomChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">焦距</span>
            <RSlider
              record={record}
              field="zoom.focus"
              min={0.1}
              max={2.0}
              step={0.1}
              value={config.zoom.focus}
              onChange={(focus) => handleZoomChange({ focus })}
              onChangeComplete={(focus) => handleZoomChange({ focus })}
              disabled={!config.zoom.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">孔径</span>
            <RSlider
              record={record}
              field="zoom.aperture"
              min={0.001}
              max={0.1}
              step={0.001}
              value={config.zoom.aperture}
              onChange={(aperture) => handleZoomChange({ aperture })}
              onChangeComplete={(aperture) => handleZoomChange({ aperture })}
              disabled={!config.zoom.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">最大模糊</span>
            <RSlider
              record={record}
              field="zoom.maxBlur"
              min={0.001}
              max={0.05}
              step={0.001}
              value={config.zoom.maxBlur}
              onChange={(maxBlur) => handleZoomChange({ maxBlur })}
              onChangeComplete={(maxBlur) => handleZoomChange({ maxBlur })}
              disabled={!config.zoom.enabled}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'pixel',
      label: (
        <div className="panel-header">
          <BorderlessTableOutlined className="panel-icon" />
          <span>像素风</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.pixel.enabled}
                onChange={(enabled) => handlePixelChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">像素大小</span>
            <RSlider
              record={record}
              field="pixel.pixelSize"
              min={1}
              max={20}
              step={1}
              value={config.pixel.pixelSize}
              onChange={(pixelSize) => handlePixelChange({ pixelSize })}
              onChangeComplete={(pixelSize) => handlePixelChange({ pixelSize })}
              disabled={!config.pixel.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">法向边缘强度</span>
            <RSlider
              record={record}
              field="pixel.normalEdgeStrength"
              min={0}
              max={1}
              step={0.1}
              value={config.pixel.normalEdgeStrength}
              onChange={(normalEdgeStrength) => handlePixelChange({ normalEdgeStrength })}
              onChangeComplete={(normalEdgeStrength) => handlePixelChange({ normalEdgeStrength })}
              disabled={!config.pixel.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">深度边缘强度</span>
            <RSlider
              record={record}
              field="pixel.depthEdgeStrength"
              min={0}
              max={1}
              step={0.1}
              value={config.pixel.depthEdgeStrength}
              onChange={(depthEdgeStrength) => handlePixelChange({ depthEdgeStrength })}
              onChangeComplete={(depthEdgeStrength) => handlePixelChange({ depthEdgeStrength })}
              disabled={!config.pixel.enabled}
              className="config-slider"
            />
          </div>
        </div>
      ),
    },
    {
      key: 'halftone',
      label: (
        <div className="panel-header">
          <AppstoreOutlined className="panel-icon" />
          <span>半色调</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <div className="config-row">
              <span className="config-label">启用</span>
              <Switch
                checked={config.halftone.enabled}
                onChange={(enabled) => handleHalftoneChange({ enabled })}
                className="config-switch"
                size="small"
              />
            </div>
          </div>

          <div className="config-item">
            <span className="config-label">形状</span>
            <Select
              value={config.halftone.shape}
              onChange={(shape) => handleHalftoneChange({ shape })}
              disabled={!config.halftone.enabled}
              className="config-select"
              size="small"
            >
              <Option value="dot">点</Option>
              <Option value="line">线</Option>
              <Option value="cross">十字</Option>
              <Option value="ring">环</Option>
            </Select>
          </div>

          <div className="config-item">
            <span className="config-label">半径</span>
            <RSlider
              record={record}
              field="halftone.radius"
              min={1}
              max={20}
              step={0.5}
              value={config.halftone.radius}
              onChange={(radius) => handleHalftoneChange({ radius })}
              onChangeComplete={(radius) => handleHalftoneChange({ radius })}
              disabled={!config.halftone.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">R色旋转</span>
            <RSlider
              record={record}
              field="halftone.rotateR"
              min={0}
              max={180}
              step={1}
              value={config.halftone.rotateR}
              onChange={(rotateR) => handleHalftoneChange({ rotateR })}
              onChangeComplete={(rotateR) => handleHalftoneChange({ rotateR })}
              disabled={!config.halftone.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">G色旋转</span>
            <RSlider
              record={record}
              field="halftone.rotateG"
              min={0}
              max={180}
              step={1}
              value={config.halftone.rotateG}
              onChange={(rotateG) => handleHalftoneChange({ rotateG })}
              onChangeComplete={(rotateG) => handleHalftoneChange({ rotateG })}
              disabled={!config.halftone.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">B色旋转</span>
            <RSlider
              record={record}
              field="halftone.rotateB"
              min={0}
              max={180}
              step={1}
              value={config.halftone.rotateB}
              onChange={(rotateB) => handleHalftoneChange({ rotateB })}
              onChangeComplete={(rotateB) => handleHalftoneChange({ rotateB })}
              disabled={!config.halftone.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">散射</span>
            <RSlider
              record={record}
              field="halftone.scatter"
              min={0}
              max={1}
              step={0.1}
              value={config.halftone.scatter}
              onChange={(scatter) => handleHalftoneChange({ scatter })}
              onChangeComplete={(scatter) => handleHalftoneChange({ scatter })}
              disabled={!config.halftone.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">混合度</span>
            <RSlider
              record={record}
              field="halftone.blending"
              min={0}
              max={1}
              step={0.1}
              value={config.halftone.blending}
              onChange={(blending) => handleHalftoneChange({ blending })}
              onChangeComplete={(blending) => handleHalftoneChange({ blending })}
              disabled={!config.halftone.enabled}
              className="config-slider"
            />
          </div>

          <div className="config-item">
            <span className="config-label">混合模式</span>
            <Select
              value={config.halftone.blendingMode}
              onChange={(blendingMode) => handleHalftoneChange({ blendingMode })}
              disabled={!config.halftone.enabled}
              className="config-select"
              size="small"
            >
              <Option value="linear">线性</Option>
              <Option value="multiply">正片叠底</Option>
              <Option value="add">相加</Option>
              <Option value="lighter">变亮</Option>
              <Option value="darker">变暗</Option>
            </Select>
          </div>

          <div className="config-item">
            <div className="config-row">
              <span className="config-label">灰度</span>
              <Switch
                checked={config.halftone.greyscale}
                onChange={(greyscale) => handleHalftoneChange({ greyscale })}
                className="config-switch"
                size="small"
                disabled={!config.halftone.enabled}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="post-processing-panel">
      <Collapse
        items={collapseItems}
        defaultActiveKey={['antialiasing', 'outline', 'bloom', 'lut', 'motionBlur', 'zoom', 'pixel', 'halftone']}
        ghost
        size="small"
      />
    </div>
  );
};

export default PostProcessingPanel; 