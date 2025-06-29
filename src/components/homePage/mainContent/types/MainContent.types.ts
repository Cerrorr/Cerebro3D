/**
 * 主内容区组件类型定义
 * 包含主内容区相关的组件Props和事件处理器类型
 * @author Cerror
 * @since 2025-06-24
 */

import type { NewProjectFormData } from './NewProjectModal.types';
import type { ProjectItem, ProjectClickHandler } from './ProjectGrid.types';
import type { CarouselItem } from './CarouselSection.types';

// 与首页主内容区相关的通用类型，就近定义

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
