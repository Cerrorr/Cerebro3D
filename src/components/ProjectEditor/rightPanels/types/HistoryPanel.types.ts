/**
 * 历史记录面板类型定义
 * @author Cerror
 * @since 2024-01-22
 */

/**
 * 操作类型枚举
 */
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

/**
 * 操作目标类型
 */
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

/**
 * 单个历史记录项
 */
export interface HistoryRecord {
  // 记录ID
  id: string;
  // 时间戳
  timestamp: number;
  // 操作类型
  actionType: HistoryActionType;
  // 目标类型
  targetType: HistoryTargetType;
  // 目标ID
  targetId?: string;
  // 目标名称
  targetName: string;
  // 操作描述
  description: string;
  // 旧值
  oldValue?: any;
  // 新值
  newValue?: any;
  // 是否可撤销
  canUndo: boolean;
  // 是否可重做
  canRedo: boolean;
  // 是否已撤销
  isUndone: boolean;
  // 元数据
  metadata?: Record<string, any>;
}

/**
 * 历史记录组（批量操作）
 */
export interface HistoryGroup {
  // 组ID
  id: string;
  // 时间戳
  timestamp: number;
  // 组标题
  title: string;
  // 记录列表
  records: HistoryRecord[];
  // 是否折叠
  collapsed: boolean;
}

/**
 * 历史记录过滤条件
 */
export interface HistoryFilter {
  // 操作类型列表
  actionTypes?: HistoryActionType[];
  // 目标类型列表
  targetTypes?: HistoryTargetType[];
  // 时间范围
  timeRange?: {
    start: number;
    end: number;
  };
  // 搜索文本
  searchText?: string;
  // 是否显示已撤销
  showUndone?: boolean;
}

/**
 * 历史记录状态
 */
export interface HistoryState {
  // 记录列表
  records: HistoryRecord[];
  // 组列表
  groups: HistoryGroup[];
  // 当前索引
  currentIndex: number;
  // 最大记录数
  maxRecords: number;
  // 过滤条件
  filter: HistoryFilter;
  // 是否在记录
  isRecording: boolean;
}

/**
 * 历史记录统计信息
 */
export interface HistoryStats {
  // 总记录数
  totalRecords: number;
  // 可撤销数量
  undoableCount: number;
  // 可重做数量
  redoableCount: number;
  // 操作类型计数
  actionTypeCounts: Record<HistoryActionType, number>;
  // 时间范围
  timeRange: {
    earliest: number;
    latest: number;
  };
}

/**
 * 历史记录面板配置
 */
export interface HistoryPanelConfig {
  // 最大显示记录数
  maxDisplayRecords: number;
  // 组合相似操作
  groupSimilarActions: boolean;
  // 自动保存
  autoSave: boolean;
  // 显示时间戳
  showTimestamps: boolean;
  // 紧凑模式
  compactMode: boolean;
  // 实时更新
  realTimeUpdates: boolean;
}

/**
 * 历史记录面板Props
 */
export interface HistoryPanelProps {
  // 历史状态
  historyState: HistoryState;
  // 面板配置
  config: HistoryPanelConfig;
  // 清除历史回调
  onClearHistory: () => void;
  // 跳转到记录回调
  onJumpToRecord: (recordId: string) => void;
  // 过滤变更回调
  onFilterChange: (filter: HistoryFilter) => void;
  // 配置变更回调
  onConfigChange: (config: Partial<HistoryPanelConfig>) => void;
}
 