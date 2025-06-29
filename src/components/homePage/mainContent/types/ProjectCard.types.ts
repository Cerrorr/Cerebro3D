import type { ProjectItem } from './ProjectGrid.types';

export interface ProjectCardProps {
  project: ProjectItem;
  onClick: (project: ProjectItem) => void;
} 