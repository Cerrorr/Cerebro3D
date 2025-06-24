import React, { useState } from 'react';
import { message } from 'antd';
import { ProjectType } from '../../types/common.types';
import './styles/NewProjectModal.scss';

/**
 * 项目模板接口
 * 
 * @interface ProjectTemplate
 * @property {string} id - 模板唯一标识
 * @property {string} name - 模板名称
 * @property {string} category - 模板分类
 * @property {string} thumbnail - 模板缩略图
 * @property {ProjectType} type - 项目类型
 * @property {string} description - 模板描述
 */
interface ProjectTemplate {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly thumbnail: string;
  readonly type: ProjectType;
  readonly description: string;
}

/**
 * 新建项目表单数据接口
 * 
 * @interface NewProjectFormData
 * @property {string} name - 项目名称
 * @property {ProjectType} category - 项目分类
 * @property {string} description - 项目说明
 * @property {string} templateId - 选中的模板ID
 */
interface NewProjectFormData {
  name: string;
  category: ProjectType;
  description: string;
  templateId: string;
}

/**
 * 新建项目弹窗组件属性接口
 * 
 * @interface NewProjectModalProps
 * @property {boolean} isOpen - 弹窗是否打开
 * @property {() => void} onClose - 关闭弹窗回调
 * @property {(formData: NewProjectFormData) => void} onConfirm - 确认创建回调
 */
interface NewProjectModalProps {
  /** 弹窗是否打开 */
  readonly isOpen: boolean;
  /** 关闭弹窗回调 */
  readonly onClose: () => void;
  /** 确认创建回调 */
  readonly onConfirm: (formData: NewProjectFormData) => void;
}

/**
 * 项目模板数据
 */
const projectTemplates: readonly ProjectTemplate[] = [
  {
    id: 'blank',
    name: '空项目',
    category: 'Web3D',
    thumbnail: '',
    type: 'Web3D',
    description: '从空白场景开始创建'
  },
  {
    id: '3d-editor',
    name: '3D Editor',
    category: '模板',
    thumbnail: '',
    type: 'Web3D',
    description: '基础3D编辑器模板'
  },
  {
    id: 'house-template',
    name: '风格化场景',
    category: '其他',
    thumbnail: '',
    type: 'Web3D',
    description: '现代建筑风格场景'
  },
  {
    id: 'city-template',
    name: '城市',
    category: '园区',
    thumbnail: '',
    type: 'Web3D',
    description: '城市建筑群场景'
  },
  {
    id: 'animations',
    name: 'animations',
    category: '其他',
    thumbnail: '',
    type: 'Game',
    description: '动物动画展示'
  },
  {
    id: 'material-template',
    name: '特效材质贴图',
    category: '其他',
    thumbnail: '',
    type: 'Web3D',
    description: '材质和特效演示'
  }
];

/**
 * 新建项目弹窗组件
 * 提供模板选择和项目基本信息设置功能
 * 
 * @param isOpen - 弹窗打开状态
 * @param onClose - 关闭回调
 * @param onConfirm - 确认回调
 * @author Cerror
 * @since 2025-06-24
 */
const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [formData, setFormData] = useState<NewProjectFormData>({
    name: '',
    category: 'Web3D',
    description: '',
    templateId: 'blank'
  });

  /**
   * 处理表单字段变化
   * @param field - 字段名
   * @param value - 字段值
   */
  const handleFormChange = (field: keyof NewProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 处理模板选择
   * @param templateId - 模板ID
   */
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = projectTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        templateId,
        category: template.type
      }));
    }
  };

  /**
   * 处理确认创建
   */
  const handleConfirm = () => {
    if (!formData.name.trim()) {
      message.error('请输入项目名称');
      return;
    }
    
    onConfirm({
      ...formData,
      templateId: selectedTemplate
    });
    
    // 重置表单
    setFormData({
      name: '',
      category: 'Web3D',
      description: '',
      templateId: 'blank'
    });
    setSelectedTemplate('blank');
  };

  /**
   * 处理关闭弹窗
   */
  const handleClose = () => {
    onClose();
    // 重置表单
    setFormData({
      name: '',
      category: 'Web3D',
      description: '',
      templateId: 'blank'
    });
    setSelectedTemplate('blank');
  };

  /**
   * 获取模板的渐变背景样式
   * @param template - 模板对象
   */
  const getTemplateGradient = (template: ProjectTemplate) => {
    const gradients = {
      'Web3D': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'VR': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'AR': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Game': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'App': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return gradients[template.type];
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="new-project-modal" onClick={(e) => e.stopPropagation()}>
        {/* 弹窗头部 */}
        <div className="modal-header">
          <h2 className="modal-title">新建项目</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          {/* 左侧模板选择区域 */}
          <div className="template-section">
            <h3 className="section-title">模板</h3>
            <div className="template-grid">
              {projectTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div 
                    className="template-thumbnail"
                    style={{ background: getTemplateGradient(template) }}
                  >
                    <span className="template-icon">
                      {template.id === 'blank' ? '📄' : '🎨'}
                    </span>
                  </div>
                  <div className="template-info">
                    <div className="template-name">{template.name}</div>
                    <div className="template-category">{template.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧项目设置区域 */}
          <div className="settings-section">
            <h3 className="section-title">项目默认设置</h3>
            
            <div className="form-group">
              <label className="form-label required">
                场景名称 <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="请输入场景名称"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">场景分类</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value as ProjectType)}
              >
                <option value="Web3D">Web3D</option>
                <option value="VR">VR</option>
                <option value="AR">AR</option>
                <option value="Game">Game</option>
                <option value="App">App</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">场景说明</label>
              <textarea
                className="form-textarea"
                placeholder="请输入场景描述"
                rows={4}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 弹窗底部 */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={handleClose}>
            取消
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal; 