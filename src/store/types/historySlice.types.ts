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

/** 历史记录条目 */
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
  isUndone: boolean;
  metadata?: Record<string, any>;
}

/** Slice 根状态 */
export interface HistorySliceState {
  records: HistoryRecord[];
  currentIndex: number;
  logs: LogEntry[];
  maxRecords: number;
  filter: HistoryFilter;
} 