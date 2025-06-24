/**
 * 主内容区组件类型定义
 * 包含主内容区相关的组件Props和事件处理器类型
 * @author Cerror
 * @since 2025-06-24
 */

import { CarouselItem, ProjectItem, ProjectClickHandler, ProjectType } from '@/types/common.types';

/**
 * 主内容区组件属性接口
 * 定义主内容区组件所需的所有属性类型
 * 
 * @interface MainContentProps
 * @property {readonly CarouselItem[]} carouselItems - 轮播图数据数组（只读）
 * @property {readonly ProjectItem[]} projects - 项目数据数组（只读）
 * @property {ProjectClickHandler} onProjectClick - 项目点击事件处理函数
 * @property {(formData: NewProjectFormData) => void} onNewProject - 新建项目处理函数
 */
export interface MainContentProps {
  /** 轮播图项目列表 */
  readonly carouselItems: readonly CarouselItem[];
  /** 项目列表 */
  readonly projects: readonly ProjectItem[];
  /** 项目点击事件处理函数 */
  readonly onProjectClick: ProjectClickHandler;
  /** 新建项目处理函数 */
  readonly onNewProject: (formData: NewProjectFormData) => void;
}

/**
 * 轮播图组件属性接口
 * 定义轮播图组件所需的所有属性类型
 * 
 * @interface CarouselSectionProps
 * @property {readonly CarouselItem[]} items - 轮播图数据数组（只读）
 */
export interface CarouselSectionProps {
  /** 轮播图项目列表 */
  readonly items: readonly CarouselItem[];
}

/**
 * 项目网格组件属性接口
 * 定义项目网格组件所需的所有属性类型
 * 
 * @interface ProjectGridProps
 * @property {readonly ProjectItem[]} projects - 项目数据数组（只读）
 * @property {ProjectClickHandler} onProjectClick - 项目点击事件处理函数
 * @property {(formData: NewProjectFormData) => void} onNewProject - 新建项目处理函数
 */
export interface ProjectGridProps {
  /** 项目列表 */
  readonly projects: readonly ProjectItem[];
  /** 项目点击回调函数 */
  readonly onProjectClick: ProjectClickHandler;
  /** 新建项目处理函数 */
  readonly onNewProject: (formData: NewProjectFormData) => void;
}

/**
 * 项目卡片组件属性接口
 * 定义单个项目卡片组件的属性类型
 * 
 * @interface ProjectCardProps
 * @property {ProjectItem} project - 项目数据对象
 * @property {() => void} onClick - 卡片点击事件处理函数
 */
export interface ProjectCardProps {
  /** 项目数据 */
  project: ProjectItem;
  /** 项目点击事件处理函数 */
  onClick: (project: ProjectItem) => void;
}

/**
 * 新建项目卡片组件属性接口
 */
export interface NewProjectCardProps {
  /** 点击事件处理函数 */
  readonly onClick: () => void;
}

/**
 * 项目模板接口
 */
export interface ProjectTemplate {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly thumbnail: string;
  readonly type: ProjectType;
  readonly description: string;
}

/**
 * 新建项目弹窗组件属性接口
 */
export interface NewProjectModalProps {
  /** 弹窗是否打开 */
  readonly isOpen: boolean;
  /** 关闭弹窗回调 */
  readonly onClose: () => void;
  /** 确认创建回调 */
  readonly onConfirm: (formData: NewProjectFormData) => void;
}

/**
 * 新建项目表单数据接口
 */
export interface NewProjectFormData {
  name: string;
  category: ProjectType;
  description: string;
  templateId: string;
} 