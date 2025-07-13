import React, { useState, useCallback } from 'react';
import { 
  Input, 
  Collapse,
  Select as AntSelect
} from 'antd';
import { 
  DownOutlined,
  ProjectOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { SceneConfigPanelProps } from './types';
import './styles/SceneConfigPanel.scss';
import type { CollapseProps } from 'antd';
import { useRecord } from '@/hooks/common/useRecord';
import { RInput, RSwitch, RSelect, RButton } from '@/components/common/recordable';

const { TextArea } = Input;
const { Option } = AntSelect;

/**
 * 场景配置面板组件
 * 提供项目信息编辑和场景配置功能
 * @author Cerror
 * @since 2025-06-25
 */
const SceneConfigPanel: React.FC<SceneConfigPanelProps> = ({
  projectInfo,
  sceneConfig,
  onProjectInfoChange,
  onSceneConfigChange
}) => {

  /* 记录器 */
  const record = useRecord('SceneConfig');

  /**
   * 处理项目信息字段变更
   */
  const handleProjectInfoChange = useCallback((field: string, value: any) => {
    onProjectInfoChange({ [field]: value });
  }, [onProjectInfoChange]);

  /**
   * 处理场景配置变更
   */
  const handleSceneConfigChange = useCallback((section: string, field: string, value: any) => {
    onSceneConfigChange({
      [section]: {
        ...sceneConfig[section as keyof typeof sceneConfig],
        [field]: value
      }
    });
  }, [sceneConfig, onSceneConfigChange]);

  /* ---------- 构建 Collapse items ---------- */
  const projectHeader = (
    <div className="panel-header">
      <ProjectOutlined className="panel-icon" />
      <span>项目信息</span>
    </div>
  );

  const sceneHeader = (
    <div className="panel-header">
      <SettingOutlined className="panel-icon" />
      <span>场景配置</span>
    </div>
  );

  const items: CollapseProps['items'] = [
    {
      key: 'project',
      label: projectHeader,
      children: (
        <div className="config-section">
          {/* 场景名称 */}
          <div className="config-item">
            <label className="config-label">场景名称</label>
            <RInput
              value={projectInfo.sceneName}
              onChange={(e) => handleProjectInfoChange('sceneName', e.target.value)}
              record={record}
              field="场景名称"
              placeholder="请输入场景名称"
              className="config-input"
            />
          </div>

          {/* 场景分类 */}
          <div className="config-item">
            <label className="config-label">场景分类</label>
            <RSelect
              value={projectInfo.sceneCategory}
              onChange={(value) => handleProjectInfoChange('sceneCategory', value)}
              record={record}
              field="场景分类"
              className="config-select"
              suffixIcon={<DownOutlined />}
            >
              <Option value="其他">其他</Option>
              <Option value="建筑">建筑</Option>
              <Option value="产品">产品</Option>
              <Option value="游戏">游戏</Option>
              <Option value="教育">教育</Option>
              <Option value="展示">展示</Option>
            </RSelect>
          </div>

          {/* 场景说明 */}
          <div className="config-item">
            <label className="config-label">场景说明</label>
            <RInput
              as={TextArea as any}
              value={projectInfo.sceneDescription}
              onChange={(e) => handleProjectInfoChange('sceneDescription', e.target.value)}
              record={record}
              field="场景说明"
              placeholder="请输入场景描述"
              rows={3}
              className="config-textarea"
            />
          </div>

          {/* 项目类型 */}
          <div className="config-item">
            <label className="config-label">项目类型</label>
            <div className="project-type">
              <span className="project-type-badge">Web3D</span>
            </div>
          </div>

          {/* 封面 */}
          <div className="config-item">
            <label className="config-label">封面</label>
            <div className="cover-upload">
              <div className="cover-preview">
                {projectInfo.coverImage ? (
                  <img src={projectInfo.coverImage} alt="封面" />
                ) : (
                  <div className="cover-placeholder">
                    <div className="grid-pattern"></div>
                  </div>
                )}
              </div>
              <RButton className="cover-upload-btn" block record={record} desc="点击截屏">
                截屏
              </RButton>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'scene',
      label: sceneHeader,
      children: (
        <div className="config-section">
          {/* 背景 */}
          <div className="config-item">
            <label className="config-label">背景</label>
            <RSelect
              value={sceneConfig.background.type}
              onChange={(value) => handleSceneConfigChange('background', 'type', value)}
              record={record}
              field="背景"
              className="config-select"
              suffixIcon={<DownOutlined />}
            >
              <Option value="color">Color</Option>
              <Option value="texture">Texture</Option>
              <Option value="skybox">Skybox</Option>
            </RSelect>
          </div>

          {/* 环境 */}
          <div className="config-item">
            <label className="config-label">环境</label>
            <div className="environment-config">
              <RSelect
                value={sceneConfig.environment.type}
                onChange={(value) => handleSceneConfigChange('environment', 'type', value)}
                record={record}
                field="环境"
                className="config-select"
                suffixIcon={<DownOutlined />}
              >
                <Option value="none">None</Option>
                <Option value="equirect">Equirect</Option>
                <Option value="cube">Cube</Option>
              </RSelect>
              {sceneConfig.environment.type !== 'none' && (
                <div className="environment-preview">
                  <div className="environment-placeholder">
                    <span className="environment-text">RGB</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 辅助 */}
          <div className="config-item">
            <label className="config-label">辅助</label>
            <RSwitch
              checked={sceneConfig.helpers.enabled}
              onChange={(checked) => {handleSceneConfigChange('helpers', 'enabled', checked);}}
              record={record}
              field="辅助"
              className="config-switch"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="scene-config-panel">
      <Collapse
        items={items}
        defaultActiveKey={['project', 'scene']}
        ghost
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
      />
    </div>
  );
};

export default SceneConfigPanel; 