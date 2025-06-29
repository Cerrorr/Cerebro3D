/**
 * NewProjectModal组件常量配置
 * 集中管理新建项目弹窗相关的常量数据
 * @author Cerror
 * @since 2025-06-25
 */

import type { ProjectTemplate, NewProjectFormData } from '@/components/homePage/mainContent/types';
import type { ProjectType } from '@/components/homePage/mainContent/types';

/**
 * 项目模板数据配置
 * 定义所有可用的项目模板
 */
export const PROJECT_TEMPLATES: readonly ProjectTemplate[] = [
  {
    id: 'blank',
    name: '空项目',
    category: 'Web3D',
    thumbnail: '',
    type: 'Web3D',
    description: '从空白场景开始创建'
  },
  {
    id: '3d-editor',
    name: '3D Editor',
    category: '模板',
    thumbnail: '',
    type: 'Web3D',
    description: '基础3D编辑器模板'
  },
  {
    id: 'house-template',
    name: '风格化场景',
    category: '其他',
    thumbnail: '',
    type: 'Web3D',
    description: '现代建筑风格场景'
  },
  {
    id: 'city-template',
    name: '城市',
    category: '园区',
    thumbnail: '',
    type: 'Web3D',
    description: '城市建筑群场景'
  },
  {
    id: 'animations',
    name: 'animations',
    category: '其他',
    thumbnail: '',
    type: 'Game',
    description: '动物动画展示'
  },
  {
    id: 'material-template',
    name: '特效材质贴图',
    category: '其他',
    thumbnail: '',
    type: 'Web3D',
    description: '材质和特效演示'
  }
] as const;

/**
 * 项目类型渐变背景映射表
 * 定义每种项目类型对应的渐变背景样式
 */
export const PROJECT_TYPE_GRADIENTS: Record<ProjectType, string> = {
  'Web3D': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'VR': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'AR': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'Game': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'App': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
} as const;

/**
 * 默认表单数据配置
 * 定义新建项目表单的初始值
 */
export const DEFAULT_FORM_DATA: NewProjectFormData = {
  name: '',
  category: 'Web3D',
  description: '',
  templateId: 'blank'
} as const;

/**
 * 默认选中模板ID
 */
export const DEFAULT_SELECTED_TEMPLATE = 'blank' as const;

/**
 * 模板图标映射表
 * 定义模板对应的图标
 */
export const TEMPLATE_ICONS: Record<string, string> = {
  blank: '📄',
  default: '🎨'
} as const; 