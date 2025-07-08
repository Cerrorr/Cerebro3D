/**
 * NewProjectModal.types工具模块
 * @author Cerror
 * @since 2025-07-08
 */

export type ProjectType = 'Web3D' | 'VR' | 'AR' | 'Game' | 'App';

export interface ProjectTemplate {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly thumbnail: string;
  readonly type: ProjectType;
  readonly description: string;
}

export interface NewProjectFormData {
  name: string;
  category: ProjectType;
  description: string;
  templateId: string;
}

export interface NewProjectModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (formData: NewProjectFormData) => void;
}
