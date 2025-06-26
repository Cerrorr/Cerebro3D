import React from 'react';
import type { LogEntry } from './types';
import { MOCK_LOG_DATA } from './constants';

/**
 * 控制台面板组件属性接口
 */
interface ConsolePanelProps {
  /** 日志数据 */
  logs?: LogEntry[];
  /** 日志级别筛选 */
  logLevel?: 'all' | 'info' | 'warn' | 'error';
  /** 清空日志回调 */
  onClearLogs?: () => void;
}

/**
 * 控制台面板组件
 * 提供系统日志显示和筛选功能
 * @author Cerror
 * @since 2025-06-25
 */
const ConsolePanel: React.FC<ConsolePanelProps> = ({
  logs = MOCK_LOG_DATA,
  logLevel = 'all',
  onClearLogs
}) => {
  // 根据级别筛选日志
  const filteredLogs = logs.filter(log => 
    logLevel === 'all' || log.level === logLevel
  );

  return (
    <div className="console-content">
      <div className="console-logs">
        {filteredLogs.map((log: LogEntry, index: number) => (
          <div key={index} className={`log-entry log-${log.level}`}>
            <span className="log-time">{log.time}</span>
            <span className="log-level">{log.level}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsolePanel; 