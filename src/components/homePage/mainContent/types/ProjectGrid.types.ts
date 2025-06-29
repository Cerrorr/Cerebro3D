import type { ProjectType, NewProjectFormData } from './NewProjectModal.types';

export interface ProjectItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnail: string;
  readonly type: ProjectType;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type ProjectClickHandler = (project: ProjectItem) => void;

export interface ProjectGridProps {
  readonly projects: readonly ProjectItem[];
  readonly onProjectClick: ProjectClickHandler;
  readonly onNewProject: (formData: NewProjectFormData) => void;
} 