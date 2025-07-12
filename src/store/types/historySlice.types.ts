/**
 * 历史记录与日志 Redux Slice 类型定义
 * @author Cerror
 * @since 2025-06-30
 */

import type {
  HistoryActionType,
  HistoryTargetType,
  HistoryFilter,
} from '@/components/projectEditor/rightPanels/types/HistoryPanel.types';

/**
 * 日志级别
 */
export type LogLevel = 'info' | 'warn' | 'error';

/**
 * 日志条目
 */
export interface LogEntry {
  // 日志ID
  id: string;
  // 日志时间
  time: string;
  // 日志级别
  level: LogLevel;
  // 日志消息
  message: string;
}

/**
 * 历史记录元数据
 */
export interface HistoryMetadata {
  // 时间戳
  timestamp?: number;
  // 用户ID
  userId?: string;
  // 操作上下文
  context?: string;
  // 操作来源
  source?: 'user' | 'system' | 'import';
  // 批处理ID
  batchId?: string;
  // 其他扩展数据
  [key: string]: unknown;
}

/**
 * 历史记录条目
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
  // 操作前的值
  oldValue?: unknown;
  // 操作后的值
  newValue?: unknown;
  // 是否已撤销
  isUndone: boolean;
  // 历史记录元数据
  metadata?: HistoryMetadata;
}

/**
 * Slice 根状态
 */
export interface HistorySliceState {
  // 历史记录列表
  records: HistoryRecord[];
  // 当前索引
  currentIndex: number;
  // 日志列表
  logs: LogEntry[];
  // 最大记录数
  maxRecords: number;
  // 过滤器
  filter: HistoryFilter;
} 