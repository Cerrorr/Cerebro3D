/**
 * 材质面板组件
 * 提供完整的材质编辑功能
 * @author Cerror
 * @since 2025-06-26
 */

import React, { useCallback } from 'react';
import {
  Input as AntInput,
  Select as AntSelect,
  Typography,
  Button as AntButton,
} from 'antd';
import {
  BgColorsOutlined,
  AppstoreOutlined,
  PictureOutlined,
  SettingOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { 
  MaterialPanelProps,
  MaterialInfo,
  MaterialAppearance,
  MaterialTextures,
  TextureConfig,
  MaterialRender
} from './types';
import {
  MATERIAL_TYPE_OPTIONS,
  BLENDING_MODE_OPTIONS,
  SIDE_OPTIONS
} from './types';
import './styles/MaterialPanel.scss';
import ModernCollapse from '@/components/common/ModernCollapse';
import { RButton, RSelect, RSwitch, RColorPicker, RSlider, RCheckbox } from '@/components/common/recordable';
import { useRecord } from '@/hooks/common/useRecord';

const { Panel } = ModernCollapse;
const { Text } = Typography;
const { Option } = AntSelect;

/**
 * 材质面板组件
 * 提供完整的材质编辑界面
 */
const MaterialPanel: React.FC<MaterialPanelProps> = ({
  materialState,
  onInfoChange,
  onAppearanceChange,
  onTextureChange,
  onRenderChange,
  onMaterialSelect,
  onMaterialApply
}) => {
  const record = useRecord('材质');

  // 处理材质信息变更
  const handleInfoChange = useCallback((field: keyof MaterialInfo, value: any) => {
    onInfoChange?.({ [field]: value });
  }, [onInfoChange]);

  // 处理外观变更
  const handleAppearanceChange = useCallback((field: keyof MaterialAppearance, value: any) => {
    onAppearanceChange?.({ [field]: value });
  }, [onAppearanceChange]);

  // 处理贴图配置变更
  const handleTextureChange = useCallback((
    textureType: keyof MaterialTextures,
    field: keyof TextureConfig,
    value: any
  ) => {
    onTextureChange?.(textureType, { [field]: value });
  }, [onTextureChange]);

  // 处理渲染设置变更
  const handleRenderChange = useCallback((field: keyof MaterialRender, value: any) => {
    onRenderChange?.({ [field]: value });
  }, [onRenderChange]);

  // 处理材质应用
  const handleMaterialApply = useCallback(() => {
    onMaterialApply?.();
  }, [onMaterialApply]);

  // 渲染贴图控制项
  const renderTextureControl = (
    textureType: keyof MaterialTextures,
    label: string
  ) => {
    if (!materialState) return null;
    
    const texture = materialState.textures[textureType];
    
    return (
      <div className="texture-item">
        <div className="texture-header">
          <Text className="texture-label">{label}</Text>
          <div className="texture-controls">
            <RCheckbox
              record={record}
              field={`${textureType}.enabled`}
              checked={texture.enabled}
              onChange={(e) => handleTextureChange(textureType, 'enabled', e.target.checked)}
            />
            <AntButton
              type="text"
              size="small"
              icon={<PlusOutlined />}
              className="texture-add-btn"
            />
          </div>
        </div>
      </div>
    );
  };

  if (!materialState) {
    return (
      <div className="material-panel">
        <div className="material-panel__empty">
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <Text type="secondary">请选择一个材质</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="material-panel">
      {/* 材质选择头部 */}
      <div className="material-header">
        <RSelect
          record={record}
          field="materialSelect"
          value={materialState.info.name}
          onChange={(value) => onMaterialSelect?.(value)}
          className="material-selector"
          dropdownClassName="material-dropdown"
        >
          <Option value="lambert5">lambert5</Option>
          <Option value="material1">material1</Option>
          <Option value="material2">material2</Option>
        </RSelect>
        <RButton
          record={record}
          desc="应用材质"
          type="primary"
          size="small"
          onClick={handleMaterialApply}
        >
          应用
        </RButton>
      </div>

      <div className="material-panel__collapse">
        <ModernCollapse 
          defaultActiveKey={['basic', 'appearance']}
          ghost
          expandIconPosition="end"
        >
          {/* 基本信息 */}
          <Panel 
            header={
              <div className="panel-header">
                <AppstoreOutlined className="panel-icon" />
                <span>基本信息</span>
              </div>
            } 
            key="basic"
          >
            <div className="basic-section">
              {/* 类型 */}
              <div className="form-row">
                <Text className="form-label">类型</Text>
                <RSelect
                  record={record}
                  field="materialType"
                  value={materialState.info.type}
                  onChange={(value) => handleInfoChange('type', value)}
                  className="type-selector"
                >
                  {MATERIAL_TYPE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </RSelect>
              </div>

              {/* 识别码 */}
              <div className="form-row">
                <Text className="form-label">识别码</Text>
                <div className="id-field">
                  <Text className="id-text">{materialState.info.id}</Text>
                  <AntButton
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    className="refresh-btn"
                  />
                </div>
              </div>

              {/* 名称 */}
              <div className="form-row">
                <Text className="form-label">名称</Text>
                <AntInput
                  value={materialState.info.name}
                  onChange={(e) => handleInfoChange('name', e.target.value)}
                  placeholder="输入材质名称"
                />
              </div>
            </div>
          </Panel>

          {/* 外观设置 */}
          <Panel 
            header={
              <div className="panel-header">
                <BgColorsOutlined className="panel-icon" />
                <span>外观</span>
              </div>
            } 
            key="appearance"
          >
            <div className="appearance-section">
              {/* 颜色 */}
              <div className="form-row">
                <Text className="form-label">颜色</Text>
                <RColorPicker
                  record={record}
                  field="color"
                  value={materialState.appearance.color}
                  onChange={(color) => handleAppearanceChange('color', color.toHexString())}
                  showText={(color) => color.toHexString()}
                  className="color-picker"
                />
              </div>

              {/* 自发光 */}
              <div className="form-row">
                <Text className="form-label">自发光</Text>
                <RColorPicker
                  record={record}
                  field="emissive"
                  value={materialState.appearance.emissive}
                  onChange={(color) => handleAppearanceChange('emissive', color.toHexString())}
                  showText={(color) => color.toHexString()}
                  className="color-picker"
                />
              </div>

              {/* 自发光强度 */}
              <div className="slider-row">
                <Text className="slider-label">自发光强度</Text>
                <div className="slider-control">
                  <RSlider
                    record={record}
                    field="emissiveIntensity"
                    value={materialState.appearance.emissiveIntensity}
                    onChange={(value) => handleAppearanceChange('emissiveIntensity', value)}
                    min={0}
                    max={5}
                    step={0.1}
                    className="slider"
                  />
                  <Text className="slider-value">{materialState.appearance.emissiveIntensity}</Text>
                </div>
              </div>

              {/* 粗糙度 */}
              <div className="slider-row">
                <Text className="slider-label">粗糙度</Text>
                <div className="slider-control">
                  <RSlider
                    record={record}
                    field="roughness"
                    value={materialState.appearance.roughness}
                    onChange={(value) => handleAppearanceChange('roughness', value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="slider"
                  />
                  <Text className="slider-value">{materialState.appearance.roughness}</Text>
                </div>
              </div>

              {/* 金属度 */}
              <div className="slider-row">
                <Text className="slider-label">金属度</Text>
                <div className="slider-control">
                  <RSlider
                    record={record}
                    field="metalness"
                    value={materialState.appearance.metalness}
                    onChange={(value) => handleAppearanceChange('metalness', value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="slider"
                  />
                  <Text className="slider-value">{materialState.appearance.metalness}</Text>
                </div>
              </div>

              {/* 透明度 */}
              <div className="slider-row">
                <Text className="slider-label">透明度</Text>
                <div className="slider-control">
                  <RSlider
                    record={record}
                    field="opacity"
                    value={materialState.appearance.opacity}
                    onChange={(value) => handleAppearanceChange('opacity', value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="slider"
                  />
                  <Text className="slider-value">{materialState.appearance.opacity}</Text>
                </div>
              </div>

              {/* 开关选项 */}
              <div className="switch-group">
                <div className="switch-item">
                  <Text>透明性</Text>
                  <RSwitch
                    record={record}
                    field="transparent"
                    checked={materialState.appearance.transparent}
                    onChange={(checked: boolean) => handleAppearanceChange('transparent', checked)}
                  />
                </div>
              </div>

              {/* α测试 */}
              <div className="slider-row">
                <Text className="slider-label">α测试</Text>
                <div className="slider-control">
                  <RSlider
                    record={record}
                    field="alphaTest"
                    value={materialState.appearance.alphaTest}
                    onChange={(value) => handleAppearanceChange('alphaTest', value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="slider"
                  />
                  <Text className="slider-value">{materialState.appearance.alphaTest}</Text>
                </div>
              </div>

              {/* 其他开关 */}
              <div className="switch-group">
                <div className="switch-item">
                  <Text>深度测试</Text>
                  <RSwitch
                    record={record}
                    field="depthTest"
                    checked={materialState.render.depthTest}
                    onChange={(checked: boolean) => handleRenderChange('depthTest', checked)}
                  />
                </div>
                <div className="switch-item">
                  <Text>深度缓冲</Text>
                  <RSwitch
                    record={record}
                    field="depthWrite"
                    checked={materialState.render.depthWrite}
                    onChange={(checked: boolean) => handleRenderChange('depthWrite', checked)}
                  />
                </div>
                <div className="switch-item">
                  <Text>线框</Text>
                  <RSwitch
                    record={record}
                    field="wireframe"
                    checked={materialState.render.wireframe}
                    onChange={(checked: boolean) => handleRenderChange('wireframe', checked)}
                  />
                </div>
              </div>
            </div>
          </Panel>

          {/* 贴图设置 */}
          <Panel 
            header={
              <div className="panel-header">
                <PictureOutlined className="panel-icon" />
                <span>贴图</span>
              </div>
            } 
            key="textures"
          >
            <div className="textures-section">
              {renderTextureControl('diffuse', '贴图')}
              {renderTextureControl('emissive', '自发光贴图')}
              {renderTextureControl('ao', '透明贴图')}
              {renderTextureControl('displacement', '凹凸贴图')}
              {renderTextureControl('normal', '法线贴图')}
              {renderTextureControl('roughness', '置换贴图')}
              {renderTextureControl('metalness', '粗糙贴图')}
              {renderTextureControl('environment', '金属贴图')}
              <div className="texture-item">
                <Text className="texture-label">环境贴图</Text>
              </div>
              <div className="texture-item">
                <Text className="texture-label">光照贴图</Text>
              </div>
              <div className="texture-item">
                <Text className="texture-label">环境遮挡贴图</Text>
              </div>
            </div>
          </Panel>

          {/* 渲染设置 */}
          <Panel 
            header={
              <div className="panel-header">
                <SettingOutlined className="panel-icon" />
                <span>渲染</span>
              </div>
            } 
            key="render"
          >
            <div className="render-section">
              {/* 面 */}
              <div className="form-row">
                <Text className="form-label">面</Text>
                <RSelect
                  record={record}
                  field="materialSide"
                  value={materialState.render.side}
                  onChange={(value) => handleRenderChange('side', value)}
                  className="side-selector"
                >
                  {SIDE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </RSelect>
              </div>

              {/* 平面着色 */}
              <div className="switch-item">
                <Text>平面着色</Text>
                <RSwitch
                  record={record}
                  field="flatShading"
                  checked={materialState.render.flatShading}
                  onChange={(checked: boolean) => handleRenderChange('flatShading', checked)}
                />
              </div>

              {/* 混合 */}
              <div className="form-row">
                <Text className="form-label">混合</Text>
                <RSelect
                  record={record}
                  field="materialBlending"
                  value={materialState.render.blending}
                  onChange={(value) => handleRenderChange('blending', value)}
                  className="blending-selector"
                >
                  {BLENDING_MODE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </RSelect>
              </div>
            </div>
          </Panel>
        </ModernCollapse>
      </div>
    </div>
  );
};

export default MaterialPanel; 