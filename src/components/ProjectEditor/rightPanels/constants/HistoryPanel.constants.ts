/**
 * 历史记录面板常量定义
 * @author Cerror
 * @since 2025-07-11
 */

import type { 
  HistoryPanelConfig, 
  HistoryState, 
  HistoryActionType 
} from '../types/HistoryPanel.types';

/**
 * 默认历史记录配置
 * 定义历史记录面板的默认配置选项
 */
export const DEFAULT_HISTORY_CONFIG: HistoryPanelConfig = {
  maxDisplayRecords: 100,
  groupSimilarActions: true,
  autoSave: true,
  showTimestamps: true,
  compactMode: false,
  realTimeUpdates: true,
};

/**
 * 默认历史记录状态
 * 定义历史记录面板的初始状态
 */
export const DEFAULT_HISTORY_STATE: HistoryState = {
  records: [],
  groups: [],
  currentIndex: -1,
  maxRecords: 100,
  filter: {
    showUndone: true,
  },
  isRecording: true,
};

/**
 * 操作类型图标映射表
 * 定义每种操作类型对应的图标名称
 */
export const ACTION_TYPE_ICONS: Record<HistoryActionType, string> = {
  create: 'plus-circle',
  delete: 'delete',
  modify: 'edit',
  transform: 'drag',
  material: 'bg-colors',
  lighting: 'bulb',
  camera: 'video-camera',
  scene: 'environment',
  import: 'import',
  export: 'export',
  undo: 'undo',
  redo: 'redo',
};

/**
 * 操作类型颜色映射表
 * 定义每种操作类型对应的显示颜色
 */
export const ACTION_TYPE_COLORS: Record<HistoryActionType, string> = {
  create: '#52c41a',      // 绿色
  delete: '#ff4d4f',      // 红色
  modify: '#1890ff',      // 蓝色
  transform: '#fa8c16',   // 橙色
  material: '#722ed1',    // 紫色
  lighting: '#fadb14',    // 黄色
  camera: '#13c2c2',      // 青色
  scene: '#eb2f96',       // 洋红
  import: '#2f54eb',      // 靛蓝
  export: '#52c41a',      // 绿色
  undo: '#8c8c8c',        // 灰色
  redo: '#595959',        // 深灰
};