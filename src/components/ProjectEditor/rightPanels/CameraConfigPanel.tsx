import React, { useCallback } from 'react';
import { 
  Select as AntSelect, 
  Space,
  Typography,
  Collapse
} from 'antd';
import { 
  DownOutlined,
  EyeOutlined,
  ReloadOutlined,
  AimOutlined,
  VideoCameraOutlined,
  ControlOutlined,
  SwapOutlined
} from '@ant-design/icons';
import type { CameraConfigPanelProps, CameraType } from './types';
import './styles/CameraConfigPanel.scss';
import { RSelect, RInputNumber, RButton } from '@/components/common/recordable';
import { useRecord } from '@/hooks/common/useRecord';

const { Option } = AntSelect;
const { Text } = Typography;

/**
 * 相机配置面板组件
 * 提供透视相机和正交相机的配置功能
 * @author Cerror
 * @since 2025-06-25
 */
const CameraConfigPanel: React.FC<CameraConfigPanelProps> = ({
  cameraConfig,
  onCameraConfigChange
}) => {
  // 记录函数
  const record = useRecord('相机配置');

  /**
   * 处理相机类型变更
   */
  const handleCameraTypeChange = useCallback((type: CameraType) => {
    onCameraConfigChange({ type });
  }, [onCameraConfigChange]);

  /**
   * 处理透视相机参数变更
   */
  const handlePerspectiveChange = useCallback((field: string, value: number) => {
    onCameraConfigChange({
      perspective: {
        ...cameraConfig.perspective,
        [field]: value
      }
    });
  }, [cameraConfig.perspective, onCameraConfigChange]);

  /**
   * 处理正交相机参数变更
   */
  const handleOrthographicChange = useCallback((field: string, value: number) => {
    onCameraConfigChange({
      orthographic: {
        ...cameraConfig.orthographic,
        [field]: value
      }
    });
  }, [cameraConfig.orthographic, onCameraConfigChange]);

  /**
   * 处理相机变换参数变更
   */
  const handleTransformChange = useCallback((section: 'position' | 'rotation' | 'target', field: 'x' | 'y' | 'z', value: number) => {
    onCameraConfigChange({
      transform: {
        ...cameraConfig.transform,
        [section]: {
          ...cameraConfig.transform[section],
          [field]: value
        }
      }
    });
  }, [cameraConfig.transform, onCameraConfigChange]);

  /**
   * 重置相机参数
   */
  const handleResetCamera = useCallback(() => {
    onCameraConfigChange({
      transform: {
        position: { x: 6, y: 4, z: 6 },
        rotation: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 }
      }
    });
  }, [onCameraConfigChange]);

  /**
   * 聚焦到原点
   */
  const handleFocusOrigin = useCallback(() => {
    onCameraConfigChange({
      transform: {
        ...cameraConfig.transform,
        target: { x: 0, y: 0, z: 0 }
      }
    });
  }, [cameraConfig.transform, onCameraConfigChange]);

  /* ---------- 构建 Collapse items ---------- */
  const items = [
    {
      key: 'type',
      label: (
        <div className="panel-header">
          <VideoCameraOutlined className="panel-icon" />
          <span>相机类型</span>
        </div>
      ),
      children: (
        <div className="config-section">
          <div className="config-item">
            <label className="config-label">类型</label>
            <RSelect
              record={record}
              field="cameraType"
              value={cameraConfig.type}
              onChange={handleCameraTypeChange}
              className="config-select"
              suffixIcon={<DownOutlined />}
            >
              <Option value="perspective">
                <Space>
                  <EyeOutlined />
                  <span>透视相机</span>
                </Space>
              </Option>
              <Option value="orthographic">
                <Space>
                  <AimOutlined />
                  <span>正交相机</span>
                </Space>
              </Option>
            </RSelect>
          </div>
        </div>
      ),
    },
    {
      key: 'parameters',
      label: (
        <div className="panel-header">
          <ControlOutlined className="panel-icon" />
          <span>相机参数</span>
        </div>
      ),
      children: (
        <div className="config-section">
          {cameraConfig.type === 'perspective' ? (
            // 透视相机参数
            <>
              <div className="config-item">
                <label className="config-label">视野角度 (FOV)</label>
                <RInputNumber
                  record={record}
                  field="fov"
                  value={cameraConfig.perspective.fov}
                  onChange={(value) => handlePerspectiveChange('fov', Number(value ?? 75))}
                  min={10}
                  max={160}
                  step={1}
                  className="config-input-number"
                />
              </div>
              
              <div className="config-item">
                <label className="config-label">宽高比</label>
                <RInputNumber
                  record={record}
                  field="aspect"
                  value={cameraConfig.perspective.aspect}
                  onChange={(value) => handlePerspectiveChange('aspect', Number(value ?? 1))}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
              
              <div className="config-item">
                <label className="config-label">近裁剪面</label>
                <RInputNumber
                  record={record}
                  field="near"
                  value={cameraConfig.perspective.near}
                  onChange={(value) => handlePerspectiveChange('near', Number(value ?? 0.1))}
                  min={0.01}
                  max={100}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
              
              <div className="config-item">
                <label className="config-label">远裁剪面</label>
                <RInputNumber
                  record={record}
                  field="far"
                  value={cameraConfig.perspective.far}
                  onChange={(value) => handlePerspectiveChange('far', Number(value ?? 10000))}
                  min={1}
                  max={10000}
                  step={10}
                  className="config-input-number"
                />
              </div>
            </>
          ) : (
            // 正交相机参数
            <>
              <div className="config-row">
                <div className="config-item config-item--half">
                  <label className="config-label">左边界</label>
                  <RInputNumber
                    record={record}
                    field="left"
                    value={cameraConfig.orthographic.left}
                    onChange={(value) => handleOrthographicChange('left', Number(value ?? -10))}
                    className="config-input-number"
                  />
                </div>
                <div className="config-item config-item--half">
                  <label className="config-label">右边界</label>
                  <RInputNumber
                    record={record}
                    field="right"
                    value={cameraConfig.orthographic.right}
                    onChange={(value) => handleOrthographicChange('right', Number(value ?? 10))}
                    className="config-input-number"
                  />
                </div>
              </div>
              
              <div className="config-row">
                <div className="config-item config-item--half">
                  <label className="config-label">上边界</label>
                  <RInputNumber
                    record={record}
                    field="top"
                    value={cameraConfig.orthographic.top}
                    onChange={(value) => handleOrthographicChange('top', Number(value ?? 10))}
                    className="config-input-number"
                  />
                </div>
                <div className="config-item config-item--half">
                  <label className="config-label">下边界</label>
                  <RInputNumber
                    record={record}
                    field="bottom"
                    value={cameraConfig.orthographic.bottom}
                    onChange={(value) => handleOrthographicChange('bottom', Number(value ?? -10))}
                    className="config-input-number"
                  />
                </div>
              </div>
              
              <div className="config-item">
                <label className="config-label">缩放系数</label>
                <RInputNumber
                  record={record}
                  field="zoom"
                  value={cameraConfig.orthographic.zoom}
                  onChange={(value) => handleOrthographicChange('zoom', Number(value ?? 1))}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
              
              <div className="config-row">
                <div className="config-item config-item--half">
                  <label className="config-label">近裁剪面</label>
                  <RInputNumber
                    record={record}
                    field="near"
                    value={cameraConfig.orthographic.near}
                    onChange={(value) => handleOrthographicChange('near', Number(value ?? 0.1))}
                    min={0.01}
                    max={100}
                    step={0.1}
                    className="config-input-number"
                  />
                </div>
                <div className="config-item config-item--half">
                  <label className="config-label">远裁剪面</label>
                  <RInputNumber
                    record={record}
                    field="far"
                    value={cameraConfig.orthographic.far}
                    onChange={(value) => handleOrthographicChange('far', Number(value ?? 10000))}
                    min={1}
                    max={10000}
                    step={10}
                    className="config-input-number"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'transform',
      label: (
        <div className="panel-header">
          <SwapOutlined className="panel-icon" />
          <span>变换</span>
        </div>
      ),
      children: (
        <div className="config-section">
          {/* 位置 */}
          <div className="config-group">
            <Text className="config-group-title">位置</Text>
            <div className="config-row">
              <div className="config-item config-item--third">
                <label className="config-label">X</label>
                <RInputNumber
                  record={record}
                  field="position.x"
                  value={cameraConfig.transform.position.x}
                  onChange={(value) => handleTransformChange('position', 'x', Number(value ?? 0))}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
              <div className="config-item config-item--third">
                <label className="config-label">Y</label>
                <RInputNumber
                  record={record}
                  field="position.y"
                  value={cameraConfig.transform.position.y}
                  onChange={(value) => handleTransformChange('position', 'y', Number(value ?? 0))}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
              <div className="config-item config-item--third">
                <label className="config-label">Z</label>
                <RInputNumber
                  record={record}
                  field="position.z"
                  value={cameraConfig.transform.position.z}
                  onChange={(value) => handleTransformChange('position', 'z', Number(value ?? 0))}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
            </div>
          </div>

          {/* 旋转 */}
          <div className="config-group">
            <Text className="config-group-title">旋转</Text>
            <div className="config-row">
              <div className="config-item config-item--third">
                <label className="config-label">X</label>
                <RInputNumber
                  record={record}
                  field="rotation.x"
                  value={cameraConfig.transform.rotation.x}
                  onChange={(value) => handleTransformChange('rotation', 'x', Number(value ?? 0))}
                  step={1}
                  className="config-input-number"
                />
              </div>
              <div className="config-item config-item--third">
                <label className="config-label">Y</label>
                <RInputNumber
                  record={record}
                  field="rotation.y"
                  value={cameraConfig.transform.rotation.y}
                  onChange={(value) => handleTransformChange('rotation', 'y', Number(value ?? 0))}
                  step={1}
                  className="config-input-number"
                />
              </div>
              <div className="config-item config-item--third">
                <label className="config-label">Z</label>
                <RInputNumber
                  record={record}
                  field="rotation.z"
                  value={cameraConfig.transform.rotation.z}
                  onChange={(value) => handleTransformChange('rotation', 'z', Number(value ?? 0))}
                  step={1}
                  className="config-input-number"
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
                <RInputNumber
                  record={record}
                  field="target.x"
                  value={cameraConfig.transform.target.x}
                  onChange={(value) => handleTransformChange('target', 'x', Number(value ?? 0))}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
              <div className="config-item config-item--third">
                <label className="config-label">Y</label>
                <RInputNumber
                  record={record}
                  field="target.y"
                  value={cameraConfig.transform.target.y}
                  onChange={(value) => handleTransformChange('target', 'y', Number(value ?? 0))}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
              <div className="config-item config-item--third">
                <label className="config-label">Z</label>
                <RInputNumber
                  record={record}
                  field="target.z"
                  value={cameraConfig.transform.target.z}
                  onChange={(value) => handleTransformChange('target', 'z', Number(value ?? 0))}
                  step={0.1}
                  className="config-input-number"
                />
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="config-actions">
            <Space size={12}>
              <RButton 
                record={record}
                desc="重置相机参数"
                size="small" 
                icon={<ReloadOutlined />}
                onClick={handleResetCamera}
                className="action-btn"
              >
                重置
              </RButton>
              <RButton 
                record={record}
                desc="聚焦到原点"
                size="small" 
                icon={<AimOutlined />}
                onClick={handleFocusOrigin}
                className="action-btn"
              >
                聚焦原点
              </RButton>
            </Space>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="camera-config-panel">
      <Collapse
        items={items}
        defaultActiveKey={['type', 'parameters', 'transform']}
        ghost
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
      />
    </div>
  );
};

export default CameraConfigPanel;