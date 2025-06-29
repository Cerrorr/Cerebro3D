/**
 * ProjectCard组件常量配置
 * 集中管理项目卡片相关的常量数据
 * @author Cerror
 * @since 2025-06-25
 */

/**
 * 项目类型样式配置接口
 */
export interface ProjectTypeStyle {
  gradient: string;
  icon: string;
  color: string;
}

/**
 * 项目类型样式映射表
 * 定义每种项目类型对应的渐变背景、图标和颜色
 */
export const PROJECT_TYPE_STYLES: Record<string, ProjectTypeStyle> = {
  Web3D: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🌐',
    color: '#667eea',
  },
  VR: {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '🥽',
    color: '#f093fb',
  },
  AR: {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '📱',
    color: '#4facfe',
  },
  Game: {
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: '🎮',
    color: '#43e97b',
  },
  App: {
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: '📱',
    color: '#fa709a',
  },
} as const;

/**
 * 默认项目类型样式
 */
export const DEFAULT_PROJECT_TYPE_STYLE = PROJECT_TYPE_STYLES['Web3D'];

/**
 * 卡片操作图标配置
 */
export const CARD_ACTION_ICONS = {
  edit: '✏️',
  delete: '🗑️',
  calendar: '📅',
} as const;

/**
 * 最大显示标签数量
 */
export const MAX_VISIBLE_TAGS = 3 as const;
