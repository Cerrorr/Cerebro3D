import React, { useState, useCallback } from 'react';
import { 
  Input, 
  Select, 
  Button, 
  Switch, 
  Collapse
} from 'antd';
import { 
  DownOutlined,
  ProjectOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { SceneConfigPanelProps } from './types';
import './styles/SceneConfigPanel.scss';
import type { CollapseProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

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
  const [activeKey, setActiveKey] = useState<string[]>(['project', 'scene']);

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
            <Input
              value={projectInfo.sceneName}
              onChange={(e) => handleProjectInfoChange('sceneName', e.target.value)}
              placeholder="请输入场景名称"
              className="config-input"
            />
          </div>

          {/* 场景分类 */}
          <div className="config-item">
            <label className="config-label">场景分类</label>
            <Select
              value={projectInfo.sceneCategory}
              onChange={(value) => handleProjectInfoChange('sceneCategory', value)}
              className="config-select"
              suffixIcon={<DownOutlined />}
            >
              <Option value="其他">其他</Option>
              <Option value="建筑">建筑</Option>
              <Option value="产品">产品</Option>
              <Option value="游戏">游戏</Option>
              <Option value="教育">教育</Option>
              <Option value="展示">展示</Option>
            </Select>
          </div>

          {/* 场景说明 */}
          <div className="config-item">
            <label className="config-label">场景说明</label>
            <TextArea
              value={projectInfo.sceneDescription}
              onChange={(e) => handleProjectInfoChange('sceneDescription', e.target.value)}
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
              <Button className="cover-upload-btn" block>
                截屏
              </Button>
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
            <Select
              value={sceneConfig.background.type}
              onChange={(value) => handleSceneConfigChange('background', 'type', value)}
              className="config-select"
              suffixIcon={<DownOutlined />}
            >
              <Option value="color">Color</Option>
              <Option value="texture">Texture</Option>
              <Option value="skybox">Skybox</Option>
            </Select>
          </div>

          {/* 环境 */}
          <div className="config-item">
            <label className="config-label">环境</label>
            <div className="environment-config">
              <Select
                value={sceneConfig.environment.type}
                onChange={(value) => handleSceneConfigChange('environment', 'type', value)}
                className="config-select"
                suffixIcon={<DownOutlined />}
              >
                <Option value="none">None</Option>
                <Option value="equirect">Equirect</Option>
                <Option value="cube">Cube</Option>
              </Select>
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
            <Switch
              checked={sceneConfig.helpers.enabled}
              onChange={(checked) => handleSceneConfigChange('helpers', 'enabled', checked)}
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
        activeKey={activeKey}
        onChange={setActiveKey}
        ghost
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
      />
    </div>
  );
};

export default SceneConfigPanel; 