/**
 * useHistoryRecorder Hook 类型定义
 * 负责记录历史操作和日志信息，提供撤销/重做功能
 * @author Cerror
 * @since 2025-06-30
 */

import type {
  HistoryActionType,
  HistoryTargetType,
  HistoryFilter,
} from '@/components/projectEditor/rightPanels/types/HistoryPanel.types';
import type { LogEntry } from '@/components/projectEditor/bottomPanels/types/BottomPanel.types';
import type { HistorySliceState } from '@/store/types/historySlice.types';

/** HistoryRecorder 初始化配置 */
export interface UseHistoryRecorderOptions {
  /** 最大历史记录条数 */
  maxRecords?: number;
  /** 是否启用分组（暂未实现） */
  enableGrouping?: boolean;
  /** 是否自动记录日志 */
  autoLog?: boolean;
}

/** 添加历史记录时的参数 */
export interface AddHistoryParams {
  /** 操作类型 */
  actionType: HistoryActionType;
  /** 目标对象类型 */
  targetType: HistoryTargetType;
  /** 目标对象ID（可选） */
  targetId?: string;
  /** 目标对象名称 */
  targetName: string;
  /** 操作描述 */
  description: string;
  /** 旧值 */
  oldValue?: any;
  /** 新值 */
  newValue?: any;
  /** 日志级别，默认 info */
  logLevel?: LogEntry['level'];
  /** 额外元数据 */
  metadata?: Record<string, any>;
}

/** useHistoryRecorder 返回结果 */
export interface UseHistoryRecorderResult {
  /** 历史记录状态 */
  historyState: HistorySliceState;
  /** 日志条目列表 */
  logs: LogEntry[];
  /** 添加历史记录 */
  addHistory: (params: AddHistoryParams) => void;
  /** 撤销 */
  undo: () => void;
  /** 重做 */
  redo: () => void;
  /** 清空历史 */
  clearHistory: () => void;
  /** 过滤历史 */
  setHistoryFilter: (filter: Partial<HistoryFilter>) => void;
  /** 记录 info 日志 */
  info: (message: string) => void;
  /** 记录 warn 日志 */
  warn: (message: string) => void;
  /** 记录 error 日志 */
  error: (message: string) => void;
} 