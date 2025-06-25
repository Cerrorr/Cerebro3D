/**
 * Toolbar组件常量配置
 * 集中管理工具栏相关的常量数据
 * @author Cerror
 * @since 2025-06-25
 */

/**
 * 快捷键映射表
 * 定义工具栏按钮对应的快捷键
 */
export const TOOLBAR_SHORTCUTS: Record<string, string> = {
  'import': 'Ctrl+I',
  'undo': 'Ctrl+Z',
  'redo': 'Ctrl+Y',
  'delete': 'Delete',
  'clear': 'Ctrl+Shift+C',
  'copy': 'Ctrl+C',
  'fullscreen': 'F11',
  'export': 'Ctrl+E',
  'save': 'Ctrl+S',
  'preview': 'Ctrl+P',
  'settings': 'Ctrl+,'
} as const;

/**
 * 工具栏提示文本配置
 */
export const TOOLBAR_TOOLTIPS = {
  PROJECT_LOGO: '项目标识',
  EDIT_TITLE: '编辑项目标题',
  PROJECT_TITLE_PLACEHOLDER: '项目标题'
} as const; 