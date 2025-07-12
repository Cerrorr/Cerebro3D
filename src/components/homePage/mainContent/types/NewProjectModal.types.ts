/**
 * NewProjectModal.types工具模块
 * @author Cerror
 * @since 2025-07-08
 */

/**
 * 项目类型枚举
 */
export type ProjectType = 'Web3D' | 'VR' | 'AR' | 'Game' | 'App';

/**
 * 项目模板接口
 */
export interface ProjectTemplate {
  // 模板唯一标识符
  readonly id: string;
  // 模板名称
  readonly name: string;
  // 模板分类
  readonly category: string;
  // 模板缩略图URL
  readonly thumbnail: string;
  // 模板类型
  readonly type: ProjectType;
  // 模板描述
  readonly description: string;
}

/**
 * 新建项目表单数据接口
 */
export interface NewProjectFormData {
  // 项目名称
  name: string;
  // 项目类型
  category: ProjectType;
  // 项目描述
  description: string;
  // 选中的模板ID
  templateId: string;
}

/**
 * 新建项目模态框组件的属性接口
 */
export interface NewProjectModalProps {
  // 模态框是否打开
  readonly isOpen: boolean;
  // 关闭模态框的回调函数
  readonly onClose: () => void;
  // 确认创建项目的回调函数
  readonly onConfirm: (formData: NewProjectFormData) => void;
}
