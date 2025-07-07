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

/** 日志级别 */
export type LogLevel = 'info' | 'warn' | 'error';

/** 日志条目 */
export interface LogEntry {
  id: string;
  time: string;
  level: LogLevel;
  message: string;
}

/** 历史记录元数据 */
export interface HistoryMetadata {
  /** 时间戳 */
  timestamp?: number;
  /** 用户ID */
  userId?: string;
  /** 操作上下文 */
  context?: string;
  /** 操作来源 */
  source?: 'user' | 'system' | 'import';
  /** 批处理ID */
  batchId?: string;
  /** 其他扩展数据 */
  [key: string]: unknown;
}

/** 历史记录条目 */
export interface HistoryRecord {
  id: string;
  timestamp: number;
  actionType: HistoryActionType;
  targetType: HistoryTargetType;
  targetId?: string;
  targetName: string;
  description: string;
  /** 操作前的值 */
  oldValue?: unknown;
  /** 操作后的值 */
  newValue?: unknown;
  isUndone: boolean;
  /** 历史记录元数据 */
  metadata?: HistoryMetadata;
}

/** Slice 根状态 */
export interface HistorySliceState {
  records: HistoryRecord[];
  currentIndex: number;
  logs: LogEntry[];
  maxRecords: number;
  filter: HistoryFilter;
} 