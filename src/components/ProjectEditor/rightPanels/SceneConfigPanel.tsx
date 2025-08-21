import React, { useCallback } from 'react';
import { 
  Input, 
  Collapse,
  Select as AntSelect,
  ColorPicker,
  Upload,
  Button
} from 'antd';
import { 
  DownOutlined,
  ProjectOutlined,
  SettingOutlined,
  UploadOutlined
} from '@ant-design/icons';
import type { SceneConfigPanelProps } from './types';
import './styles/SceneConfigPanel.scss';
import type { CollapseProps } from 'antd';
import { useRecord } from '@/hooks/common/useRecord';
import { RInput, RSwitch, RSelect, RButton } from '@/components/common/recordable';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateSceneConfig } from '@/store/slices/sceneSlice';

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
  onProjectInfoChange,
  // sceneConfig 和 onSceneConfigChange 现在从 Redux 获取
}) => {

  /* 记录器 */
  const record = useRecord('SceneConfig');
  
  /* Redux */
  const dispatch = useAppDispatch();
  const sceneConfig = useAppSelector(state => state.scene.sceneConfig);

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
    dispatch(updateSceneConfig({
      [section]: {
        ...sceneConfig[section as keyof typeof sceneConfig],
        [field]: value
      }
    }));
  }, [dispatch, sceneConfig]);

  /**
   * 处理截屏功能
   */
  const handleScreenshot = useCallback(async () => {
    try {
      // 查找Canvas元素（来自ViewportScene的Canvas组件）
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        console.error('未找到Canvas元素');
        return;
      }

      // 确保渲染完成后再截屏
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // 将Canvas内容转换为base64图片
      // 使用jpeg格式并设置白色背景，避免透明度问题
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      
      // 更新项目信息中的封面图片
      onProjectInfoChange({ coverImage: dataURL });
      
      console.log('截屏完成');
    } catch (error) {
      console.error('截屏失败:', error);
    }
  }, [onProjectInfoChange]);

  /**
   * 处理背景图片上传
   */
  const handleBackgroundImageUpload = useCallback((file: File, type: 'texture' | 'skybox') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataURL = e.target?.result as string;
      handleSceneConfigChange('background', type, dataURL);
    };
    reader.readAsDataURL(file);
    return false; // 阻止默认上传行为
  }, [handleSceneConfigChange]);

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
              <RButton 
                className="cover-upload-btn" 
                block 
                record={record} 
                desc="点击截屏"
                onClick={handleScreenshot}
              >
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
            
            {/* 根据背景类型显示不同的配置选项 */}
            {sceneConfig.background.type === 'color' && (
              <div className="background-config" style={{ marginTop: '8px' }}>
                <ColorPicker
                  value={sceneConfig.background.color || '#2a2a2a'}
                  onChange={(color) => {
                    const hexColor = color.toHexString();
                    handleSceneConfigChange('background', 'color', hexColor);
                  }}
                  showText
                  style={{ width: '100%' }}
                />
              </div>
            )}
            
            {sceneConfig.background.type === 'texture' && (
              <div className="background-config" style={{ marginTop: '8px' }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file) => handleBackgroundImageUpload(file, 'texture')}
                >
                  <Button icon={<UploadOutlined />} block>
                    上传纹理图片
                  </Button>
                </Upload>
                {sceneConfig.background.texture && (
                  <div className="uploaded-preview" style={{ marginTop: '8px' }}>
                    <img 
                      src={sceneConfig.background.texture} 
                      alt="背景纹理" 
                      style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {sceneConfig.background.type === 'skybox' && (
              <div className="background-config" style={{ marginTop: '8px' }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file) => handleBackgroundImageUpload(file, 'skybox')}
                >
                  <Button icon={<UploadOutlined />} block>
                    上传天空盒图片
                  </Button>
                </Upload>
                {sceneConfig.background.skybox && (
                  <div className="uploaded-preview" style={{ marginTop: '8px' }}>
                    <img 
                      src={sceneConfig.background.skybox} 
                      alt="天空盒" 
                      style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </div>
            )}
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