/**
 * ProjectGrid.types工具模块
 * @author Cerror
 * @since 2025-07-08
 */

import type { ProjectType, NewProjectFormData } from './NewProjectModal.types';

/**
 * 项目数据项接口
 */
export interface ProjectItem {
  // 项目唯一标识符
  readonly id: string;
  // 项目标题
  readonly title: string;
  // 项目描述
  readonly description: string;
  // 项目缩略图URL
  readonly thumbnail: string;
  // 项目类型
  readonly type: ProjectType;
  // 项目标签数组
  readonly tags: readonly string[];
  // 项目创建时间
  readonly createdAt: string;
  // 项目最后更新时间
  readonly updatedAt: string;
}

/**
 * 项目点击处理函数类型
 */
export type ProjectClickHandler = (project: ProjectItem) => void;

/**
 * 项目网格组件的属性接口
 */
export interface ProjectGridProps {
  // 项目数据数组
  readonly projects: readonly ProjectItem[];
  // 项目点击处理函数
  readonly onProjectClick: ProjectClickHandler;
  // 新建项目处理函数
  readonly onNewProject: (formData: NewProjectFormData) => void;
}
