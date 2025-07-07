/**
 * 历史记录面板类型定义
 * @author Cerror
 * @since 2024-01-22
 */

// 操作类型枚举
export type HistoryActionType = 
  | 'create'          // 创建对象
  | 'delete'          // 删除对象
  | 'modify'          // 修改属性
  | 'transform'       // 变换操作
  | 'material'        // 材质修改
  | 'lighting'        // 灯光调整
  | 'camera'          // 相机操作
  | 'scene'           // 场景设置
  | 'import'          // 导入资源
  | 'export'          // 导出操作
  | 'undo'            // 撤销操作
  | 'redo';           // 重做操作

// 操作目标类型
export type HistoryTargetType = 
  | 'object'          // 3D对象
  | 'mesh'            // 网格
  | 'light'           // 灯光
  | 'camera'          // 相机
  | 'scene'           // 场景
  | 'material'        // 材质
  | 'texture'         // 纹理
  | 'geometry'        // 几何体
  | 'group'           // 群组
  | 'animation'       // 动画
  | 'helper';         // 辅助对象

// 单个历史记录项
export interface HistoryRecord {
  id: string;
  timestamp: number;
  actionType: HistoryActionType;
  targetType: HistoryTargetType;
  targetId?: string;
  targetName: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  canUndo: boolean;
  canRedo: boolean;
  isUndone: boolean;
  metadata?: Record<string, any>;
}

// 历史记录组（批量操作）
export interface HistoryGroup {
  id: string;
  timestamp: number;
  title: string;
  records: HistoryRecord[];
  collapsed: boolean;
}

// 历史记录过滤条件
export interface HistoryFilter {
  actionTypes?: HistoryActionType[];
  targetTypes?: HistoryTargetType[];
  timeRange?: {
    start: number;
    end: number;
  };
  searchText?: string;
  showUndone?: boolean;
}

// 历史记录状态
export interface HistoryState {
  records: HistoryRecord[];
  groups: HistoryGroup[];
  currentIndex: number;
  maxRecords: number;
  filter: HistoryFilter;
  isRecording: boolean;
}

// 历史记录统计信息
export interface HistoryStats {
  totalRecords: number;
  undoableCount: number;
  redoableCount: number;
  actionTypeCounts: Record<HistoryActionType, number>;
  timeRange: {
    earliest: number;
    latest: number;
  };
}

// 历史记录面板配置
export interface HistoryPanelConfig {
  maxDisplayRecords: number;
  groupSimilarActions: boolean;
  autoSave: boolean;
  showTimestamps: boolean;
  compactMode: boolean;
  realTimeUpdates: boolean;
}

// 默认历史记录配置
export const DEFAULT_HISTORY_CONFIG: HistoryPanelConfig = {
  maxDisplayRecords: 100,
  groupSimilarActions: true,
  autoSave: true,
  showTimestamps: true,
  compactMode: false,
  realTimeUpdates: true,
};

// 默认历史记录状态
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

// 历史记录面板Props
export interface HistoryPanelProps {
  historyState: HistoryState;
  config: HistoryPanelConfig;
  onClearHistory: () => void;
  onJumpToRecord: (recordId: string) => void;
  onFilterChange: (filter: HistoryFilter) => void;
  onConfigChange: (config: Partial<HistoryPanelConfig>) => void;
}

// 操作类型图标映射
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

// 操作类型颜色映射
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