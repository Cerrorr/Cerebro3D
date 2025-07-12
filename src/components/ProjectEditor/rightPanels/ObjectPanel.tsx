/**
 * 对象面板组件
 * 提供对象属性配置界面
 * @author Cerror
 * @since 2025-06-26
 */

import React, { useCallback } from 'react';
import {
  Input,
  InputNumber,
  Switch,
  Select,
  ColorPicker,
  Typography
} from 'antd';
import {
  AppstoreOutlined,
  SwapOutlined,
  EyeOutlined,
  ScissorOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  CodeOutlined
} from '@ant-design/icons';
import type { 
  ObjectPanelProps, 
  ObjectInfo, 
  TransformConfig, 
  ObjectShadowConfig,
  VisibilityConfig,
  ClippingConfig,
  ExplodeConfig,
  ObjectVector3
} from './types';
import './styles/ObjectPanel.scss';
import ModernCollapse from '@/components/common/ModernCollapse';
import { useRecord } from '@/hooks/common/useRecord';
import { RInput, RSelect, RButton } from '@/components/common/recordable';

const { Panel } = ModernCollapse;
const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 对象面板组件
 * 展示和编辑选中对象的所有属性
 */
const ObjectPanel: React.FC<ObjectPanelProps> = ({
  objectState,
  onInfoChange,
  onTransformChange,
  onShadowChange,
  onVisibilityChange,
  onRenderOrderChange,
  onClippingChange,
  onExplodeChange,
  onCustomDataChange
}) => {
  // 记录器
  const record = useRecord('对象');

  // 处理对象信息变更
  const handleInfoChange = useCallback((field: keyof ObjectInfo, value: any) => {
    record(`信息 ${field} = ${value}`);
    onInfoChange?.({ [field]: value });
  }, [onInfoChange, record]);

  // 处理向量变更
  const handleVectorChange = useCallback((
    field: keyof TransformConfig, 
    axis: keyof ObjectVector3, 
    value: number
  ) => {
    if (!objectState) return;
    const currentVector = objectState.transform[field] as ObjectVector3;
    const newVector = { ...currentVector, [axis]: value };
    record(`变换 ${field}.${axis} = ${value}`);
    onTransformChange?.({ [field]: newVector });
  }, [objectState, onTransformChange, record]);

  // 处理阴影配置变更
  const handleShadowChange = useCallback((field: keyof ObjectShadowConfig, value: boolean) => {
    record(`阴影 ${field} = ${value}`);
    onShadowChange?.({ [field]: value });
  }, [onShadowChange, record]);

  // 处理可见性变更
  const handleVisibilityChange = useCallback((field: keyof VisibilityConfig, value: boolean) => {
    record(`可见性 ${field} = ${value}`);
    onVisibilityChange?.({ [field]: value });
  }, [onVisibilityChange, record]);

  // 处理渲染次序变更
  const handleRenderOrderChange = useCallback((value: number) => {
    record(`渲染次序 = ${value}`);
    onRenderOrderChange?.({ renderOrder: value });
  }, [onRenderOrderChange, record]);

  // 处理剖切配置变更
  const handleClippingChange = useCallback((field: keyof ClippingConfig, value: any) => {
    record(`剖切 ${field} = ${value}`);
    onClippingChange?.({ [field]: value });
  }, [onClippingChange, record]);

  // 处理剖切向量变更
  const handleClippingVectorChange = useCallback((
    field: 'planeNormal',
    axis: keyof ObjectVector3,
    value: number
  ) => {
    if (!objectState) return;
    const currentVector = objectState.clipping[field] as ObjectVector3;
    const newVector = { ...currentVector, [axis]: value };
    record(`剖切 ${field}.${axis} = ${value}`);
    onClippingChange?.({ [field]: newVector });
  }, [objectState, onClippingChange, record]);

  // 处理爆炸配置变更
  const handleExplodeChange = useCallback((field: keyof ExplodeConfig, value: any) => {
    record(`爆炸 ${field} = ${value}`);
    onExplodeChange?.({ [field]: value });
  }, [onExplodeChange, record]);

  // 处理爆炸向量变更
  const handleExplodeVectorChange = useCallback((
    field: 'center',
    axis: keyof ObjectVector3,
    value: number
  ) => {
    if (!objectState) return;
    const currentVector = objectState.explode[field] as ObjectVector3;
    const newVector = { ...currentVector, [axis]: value };
    record(`爆炸 ${field}.${axis} = ${value}`);
    onExplodeChange?.({ [field]: newVector });
  }, [objectState, onExplodeChange, record]);

  // 处理自定义数据变更
  const handleCustomDataChange = useCallback((dataString: string) => {
    record('修改自定义数据');
    try {
      const customData = JSON.parse(dataString);
      onCustomDataChange?.(customData);
    } catch (error) {
      // 解析失败时不更新
      console.warn('无效的JSON格式');
    }
  }, [onCustomDataChange, record]);

  // 复制识别码到剪贴板
  const handleCopyId = useCallback(() => {
    if (objectState?.info.id) {
      navigator.clipboard.writeText(objectState.info.id);
      record('复制识别码');
    }
  }, [objectState?.info?.id, record]);

  if (!objectState) {
    return (
      <div className="object-panel">
        <div className="object-panel__empty">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <Text type="secondary">请选择一个对象</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="object-panel">
      <div className="object-panel__collapse">
        <ModernCollapse 
          defaultActiveKey={['info', 'transform']}
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
          key="info"
        >
          <div className="info-section">
            {/* 类型 */}
            <div className="form-row">
              <Text className="form-label">类型</Text>
              <div className="type-field">
                <Text className="type-text">{objectState.info.type}</Text>
              </div>
            </div>

            {/* 识别码 */}
            <div className="form-row">
              <Text className="form-label">识别码</Text>
              <div className="id-field">
                <Text className="id-text">{objectState.info.id}</Text>
                <RButton
                  record={record}
                  desc="复制识别码"
                  type="text"
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={handleCopyId}
                />
              </div>
            </div>

            {/* 名称 */}
            <div className="form-row">
              <Text className="form-label">名称</Text>
              <RInput
                value={objectState.info.name}
                onChange={(e) => handleInfoChange('name', e.target.value)}
                record={record}
                field="info.name"
                placeholder="请输入名称"
                size="small"
              />
            </div>

            {/* 材质 */}
            <div className="form-row">
              <Text className="form-label">材质</Text>
              <RSelect
                value={objectState.info.material || ''}
                onChange={(value) => handleInfoChange('material', value)}
                record={record}
                field="info.material"
                size="small"
              >
                <Option value={objectState.info.material || ''}>
                  {objectState.info.material || '默认材质'}
                </Option>
              </RSelect>
            </div>
          </div>
        </Panel>

        {/* 变换 */}
        <Panel 
          header={
            <div className="panel-header">
              <SwapOutlined className="panel-icon" />
              <span>变换</span>
            </div>
          } 
          key="transform"
        >
          <div className="transform-section">
            {/* 位置 */}
            <div className="vector-group">
              <Text className="vector-label">位置</Text>
              <div className="vector-inputs">
                <InputNumber
                  value={objectState.transform.position.x}
                  onChange={(value) => handleVectorChange('position', 'x', value || 0)}
                  placeholder="X"
                  step={0.1}
                  precision={2}
                  className="vector-input"
                />
                <InputNumber
                  value={objectState.transform.position.y}
                  onChange={(value) => handleVectorChange('position', 'y', value || 0)}
                  placeholder="Y"
                  step={0.1}
                  precision={2}
                  className="vector-input"
                />
                <InputNumber
                  value={objectState.transform.position.z}
                  onChange={(value) => handleVectorChange('position', 'z', value || 0)}
                  placeholder="Z"
                  step={0.1}
                  precision={2}
                  className="vector-input"
                />
              </div>
            </div>

            {/* 旋转 */}
            <div className="vector-group">
              <Text className="vector-label">旋转</Text>
              <div className="vector-inputs">
                <InputNumber
                  value={objectState.transform.rotation.x}
                  onChange={(value) => handleVectorChange('rotation', 'x', value || 0)}
                  placeholder="X"
                  step={1}
                  precision={1}
                  className="vector-input"
                />
                <InputNumber
                  value={objectState.transform.rotation.y}
                  onChange={(value) => handleVectorChange('rotation', 'y', value || 0)}
                  placeholder="Y"
                  step={1}
                  precision={1}
                  className="vector-input"
                />
                <InputNumber
                  value={objectState.transform.rotation.z}
                  onChange={(value) => handleVectorChange('rotation', 'z', value || 0)}
                  placeholder="Z"
                  step={1}
                  precision={1}
                  className="vector-input"
                />
              </div>
            </div>

            {/* 缩放 */}
            <div className="vector-group">
              <Text className="vector-label">缩放</Text>
              <div className="vector-inputs">
                <InputNumber
                  value={objectState.transform.scale.x}
                  onChange={(value) => handleVectorChange('scale', 'x', value || 1)}
                  placeholder="X"
                  step={0.1}
                  precision={2}
                  min={0.01}
                  className="vector-input"
                />
                <InputNumber
                  value={objectState.transform.scale.y}
                  onChange={(value) => handleVectorChange('scale', 'y', value || 1)}
                  placeholder="Y"
                  step={0.1}
                  precision={2}
                  min={0.01}
                  className="vector-input"
                />
                <InputNumber
                  value={objectState.transform.scale.z}
                  onChange={(value) => handleVectorChange('scale', 'z', value || 1)}
                  placeholder="Z"
                  step={0.1}
                  precision={2}
                  min={0.01}
                  className="vector-input"
                />
              </div>
            </div>
          </div>
        </Panel>

        {/* 阴影 */}
        <Panel 
          header={
            <div className="panel-header">
              <EyeOutlined className="panel-icon" />
              <span>阴影</span>
            </div>
          } 
          key="shadow"
        >
          <div className="shadow-section">
            <div className="switch-group">
              <div className="switch-item">
                <Text>产生</Text>
                <Switch
                  checked={objectState.shadow.castShadow}
                  onChange={(checked) => handleShadowChange('castShadow', checked)}
                />
              </div>
              <div className="switch-item">
                <Text>接受</Text>
                <Switch
                  checked={objectState.shadow.receiveShadow}
                  onChange={(checked) => handleShadowChange('receiveShadow', checked)}
                />
              </div>
            </div>
          </div>
        </Panel>

        {/* 可见性和渲染 */}
        <Panel 
          header={
            <div className="panel-header">
              <EyeOutlined className="panel-icon" />
              <span>可见性</span>
            </div>
          } 
          key="visibility"
        >
          <div className="visibility-section">
            <div className="switch-item">
              <Text>可见性</Text>
              <Switch
                checked={objectState.visibility.visible}
                onChange={(checked) => handleVisibilityChange('visible', checked)}
              />
            </div>

            <div className="switch-item">
              <Text>视锥体裁剪</Text>
              <Switch
                checked={objectState.visibility.frustumCulled}
                onChange={(checked) => handleVisibilityChange('frustumCulled', checked)}
              />
            </div>

            <div className="form-row">
              <Text className="form-label">渲染次序</Text>
              <InputNumber
                value={objectState.renderOrder.renderOrder}
                onChange={(value) => handleRenderOrderChange(value || 0)}
                className="render-order-input"
              />
            </div>
          </div>
        </Panel>

        {/* 剖切 */}
        <Panel 
          header={
            <div className="panel-header">
              <ScissorOutlined className="panel-icon" />
              <span>剖切</span>
            </div>
          } 
          key="clipping"
        >
          <div className="clipping-section">
            <div className="switch-item">
              <Text>启用剖切</Text>
              <Switch
                checked={objectState.clipping.enabled}
                onChange={(checked) => handleClippingChange('enabled', checked)}
              />
            </div>

            {objectState.clipping.enabled && (
              <>
                {/* 剖切平面法向量 */}
                <div className="vector-group">
                  <Text className="vector-label">平面法向量</Text>
                  <div className="vector-inputs">
                    <InputNumber
                      value={objectState.clipping.planeNormal.x}
                      onChange={(value) => handleClippingVectorChange('planeNormal', 'x', value || 0)}
                      placeholder="X"
                      step={0.1}
                      precision={2}
                    />
                    <InputNumber
                      value={objectState.clipping.planeNormal.y}
                      onChange={(value) => handleClippingVectorChange('planeNormal', 'y', value || 0)}
                      placeholder="Y"
                      step={0.1}
                      precision={2}
                    />
                    <InputNumber
                      value={objectState.clipping.planeNormal.z}
                      onChange={(value) => handleClippingVectorChange('planeNormal', 'z', value || 0)}
                      placeholder="Z"
                      step={0.1}
                      precision={2}
                    />
                  </div>
                </div>

                {/* 剖切距离 */}
                <div className="form-row">
                  <Text className="form-label">剖切距离</Text>
                  <InputNumber
                    value={objectState.clipping.planeDistance}
                    onChange={(value) => handleClippingChange('planeDistance', value || 0)}
                    step={0.1}
                    precision={2}
                  />
                </div>

                {/* 剖切方向 */}
                <div className="form-row">
                  <Text className="form-label">剖切方向</Text>
                  <Select
                    value={objectState.clipping.side}
                    onChange={(value) => handleClippingChange('side', value)}
                  >
                    <Option value="front">正面</Option>
                    <Option value="back">背面</Option>
                    <Option value="double">双面</Option>
                  </Select>
                </div>

                {/* 边缘设置 */}
                <div className="switch-item">
                  <Text>显示边缘</Text>
                  <Switch
                    checked={objectState.clipping.showEdges}
                    onChange={(checked) => handleClippingChange('showEdges', checked)}
                  />
                </div>

                {objectState.clipping.showEdges && (
                  <>
                    <div className="form-row">
                      <Text className="form-label">边缘颜色</Text>
                      <ColorPicker
                        value={objectState.clipping.edgeColor}
                        onChange={(color) => handleClippingChange('edgeColor', color.toHexString())}
                        showText
                      />
                    </div>

                    <div className="form-row">
                      <Text className="form-label">边缘厚度</Text>
                      <InputNumber
                        value={objectState.clipping.edgeThickness}
                        onChange={(value) => handleClippingChange('edgeThickness', value || 1)}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Panel>

        {/* 爆炸 */}
        <Panel 
          header={
            <div className="panel-header">
              <ThunderboltOutlined className="panel-icon" />
              <span>爆炸</span>
            </div>
          } 
          key="explode"
        >
          <div className="explode-section">
            <div className="switch-item">
              <Text>启用爆炸视图</Text>
              <Switch
                checked={objectState.explode.enabled}
                onChange={(checked) => handleExplodeChange('enabled', checked)}
              />
            </div>

            {objectState.explode.enabled && (
              <>
                {/* 爆炸强度 */}
                <div className="form-row">
                  <Text className="form-label">爆炸强度</Text>
                  <InputNumber
                    value={objectState.explode.intensity}
                    onChange={(value) => handleExplodeChange('intensity', value || 1)}
                    min={0.1}
                    max={10}
                    step={0.1}
                    precision={1}
                  />
                </div>

                {/* 爆炸中心 */}
                <div className="vector-group">
                  <Text className="vector-label">爆炸中心</Text>
                  <div className="vector-inputs">
                    <div className="axis-input">
                      <span className="axis-label">X</span>
                      <InputNumber
                        value={objectState.explode.center.x}
                        onChange={(value) => handleExplodeVectorChange('center', 'x', value || 0)}
                        step={0.1}
                        precision={2}
                      />
                    </div>
                    <div className="axis-input">
                      <span className="axis-label">Y</span>
                      <InputNumber
                        value={objectState.explode.center.y}
                        onChange={(value) => handleExplodeVectorChange('center', 'y', value || 0)}
                        step={0.1}
                        precision={2}
                      />
                    </div>
                    <div className="axis-input">
                      <span className="axis-label">Z</span>
                      <InputNumber
                        value={objectState.explode.center.z}
                        onChange={(value) => handleExplodeVectorChange('center', 'z', value || 0)}
                        step={0.1}
                        precision={2}
                      />
                    </div>
                  </div>
                </div>

                {/* 爆炸方向 */}
                <div className="form-row">
                  <Text className="form-label">爆炸方向</Text>
                  <Select
                    value={objectState.explode.direction}
                    onChange={(value) => handleExplodeChange('direction', value)}
                  >
                    <Option value="radial">径向</Option>
                    <Option value="x">X轴</Option>
                    <Option value="y">Y轴</Option>
                    <Option value="z">Z轴</Option>
                  </Select>
                </div>

                {/* 动画设置 */}
                <div className="form-row">
                  <Text className="form-label">动画时长</Text>
                  <InputNumber
                    value={objectState.explode.duration}
                    onChange={(value) => handleExplodeChange('duration', value || 1000)}
                    min={100}
                    max={10000}
                    step={100}
                  />
                </div>

                <div className="form-row">
                  <Text className="form-label">缓动函数</Text>
                  <Select
                    value={objectState.explode.easing}
                    onChange={(value) => handleExplodeChange('easing', value)}
                  >
                    <Option value="linear">线性</Option>
                    <Option value="easeIn">缓入</Option>
                    <Option value="easeOut">缓出</Option>
                    <Option value="easeInOut">缓入缓出</Option>
                  </Select>
                </div>
              </>
            )}
          </div>
        </Panel>

        {/* 自定义数据 */}
        <Panel 
          header={
            <div className="panel-header">
              <CodeOutlined className="panel-icon" />
              <span>自定义数据</span>
            </div>
          } 
          key="customData"
        >
          <div className="custom-data-section">
            <TextArea
              value={JSON.stringify(objectState.customData, null, 2)}
              onChange={(e) => handleCustomDataChange(e.target.value)}
              placeholder="输入JSON格式的自定义数据"
              rows={6}
              className="custom-data-input"
            />
          </div>
        </Panel>
        </ModernCollapse>
      </div>
    </div>
  );
};

export default ObjectPanel; 