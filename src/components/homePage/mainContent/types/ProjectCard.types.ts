/**
 * ProjectCard.types工具模块
 * @author Cerror
 * @since 2025-07-08
 */

import type { ProjectItem } from './ProjectGrid.types';

/**
 * 项目卡片组件的属性接口
 */
export interface ProjectCardProps {
  // 项目数据对象
  project: ProjectItem;
  // 点击项目卡片时的回调函数
  onClick: (project: ProjectItem) => void;
}
