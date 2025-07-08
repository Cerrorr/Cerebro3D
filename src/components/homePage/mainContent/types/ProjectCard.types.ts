/**
 * ProjectCard.types工具模块
 * @author Cerror
 * @since 2025-07-08
 */

import type { ProjectItem } from './ProjectGrid.types';

export interface ProjectCardProps {
  project: ProjectItem;
  onClick: (project: ProjectItem) => void;
}
