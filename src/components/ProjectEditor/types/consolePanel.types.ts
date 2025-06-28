/**
 * 控制台面板组件类型定义
 * @author Cerror
 * @since 2025-06-25
 */

import type { LogEntry } from './BottomPanel.types';

/**
 * 控制台面板组件属性接口
 */
export interface ConsolePanelProps {
  /** 日志数据 */
  logs?: LogEntry[];
  /** 日志级别筛选 */
  logLevel?: 'all' | 'info' | 'warn' | 'error';
  /** 清空日志回调 */
  onClearLogs?: () => void;
} 