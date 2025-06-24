/**
 * 主内容区组件类型定义
 * 包含主内容区相关的组件Props和事件处理器类型
 * @author Cerror
 * @since 2025-06-24
 */

import { CarouselItem, ProjectItem, ProjectClickHandler } from '../../../types/common.types';

/**
 * 主内容区组件属性接口
 * 定义主内容区组件所需的所有属性类型
 * 
 * @interface MainContentProps
 * @property {readonly CarouselItem[]} carouselItems - 轮播图数据数组（只读）
 * @property {readonly ProjectItem[]} projects - 项目数据数组（只读）
 * @property {ProjectClickHandler} onProjectClick - 项目点击事件处理函数
 */
export interface MainContentProps {
  /** 轮播图项目列表 */
  readonly carouselItems: readonly CarouselItem[];
  /** 项目列表 */
  readonly projects: readonly ProjectItem[];
  /** 项目点击事件处理函数 */
  readonly onProjectClick: ProjectClickHandler;
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
 */
export interface ProjectGridProps {
  /** 项目列表 */
  readonly projects: readonly ProjectItem[];
  /** 项目点击回调函数 */
  readonly onProjectClick: ProjectClickHandler;
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
  readonly project: ProjectItem;
  /** 点击事件处理函数 */
  readonly onClick: () => void;
} 