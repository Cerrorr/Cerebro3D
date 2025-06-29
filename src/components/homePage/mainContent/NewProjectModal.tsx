import React, { useState } from 'react';
import { message } from 'antd';
import type { ProjectType, NewProjectModalProps, ProjectTemplate, NewProjectFormData } from './types';
import { 
  PROJECT_TEMPLATES, 
  PROJECT_TYPE_GRADIENTS, 
  DEFAULT_FORM_DATA, 
  DEFAULT_SELECTED_TEMPLATE,
  TEMPLATE_ICONS 
} from './constants';
import './styles/NewProjectModal.scss';

/**
 * 新建项目弹窗组件
 * 提供模板选择和项目基本信息设置功能
 * 
 * @param isOpen - 弹窗打开状态
 * @param onClose - 关闭回调
 * @param onConfirm - 确认回调
 * @author Cerror
 * @since 2025-06-25
 */
const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(DEFAULT_SELECTED_TEMPLATE);
  const [formData, setFormData] = useState<NewProjectFormData>(DEFAULT_FORM_DATA);

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
    const template = PROJECT_TEMPLATES.find((t: ProjectTemplate) => t.id === templateId);
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
    setFormData(DEFAULT_FORM_DATA);
    setSelectedTemplate(DEFAULT_SELECTED_TEMPLATE);
  };

  /**
   * 处理关闭弹窗
   */
  const handleClose = () => {
    onClose();
    // 重置表单
    setFormData(DEFAULT_FORM_DATA);
    setSelectedTemplate(DEFAULT_SELECTED_TEMPLATE);
  };

  /**
   * 获取模板的渐变背景样式
   * @param template - 模板对象
   */
  const getTemplateGradient = (template: ProjectTemplate) => {
    return PROJECT_TYPE_GRADIENTS[template.type];
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
              {PROJECT_TEMPLATES.map((template: ProjectTemplate) => (
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
                      {TEMPLATE_ICONS[template.id] || TEMPLATE_ICONS.default}
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