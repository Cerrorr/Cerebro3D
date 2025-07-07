import { useCallback } from 'react';
import type { UseHistoryRecorderOptions, UseHistoryRecorderResult, AddHistoryParams } from './types/useHistoryRecorder.types';
import { useAppDispatch, useAppSelector } from '@/store';
import { addRecord, appendLog, undo, redo, clearHistory, setFilter } from '@/store/slices/historySlice';
import type { LogLevel } from '@/store/types/historySlice.types';
import { devLog } from '@/utils/devLog';

// 统一管理历史记录与日志记录
/**
 * useHistoryRecorder
 * @param options 配置选项
 * @returns Hook返回值，包含历史记录操作方法
 */
export const useHistoryRecorder = (
  options: UseHistoryRecorderOptions = {}
): UseHistoryRecorderResult => {
  const dispatch = useAppDispatch();
  const historyState = useAppSelector(state => state.history);
  const { logs } = historyState;

  const autoLog = options.autoLog ?? true;

  /* 日志 */
  const appendLogEntry = useCallback(
    (level: LogLevel, message: string) => {
      dispatch(appendLog(level, message));
      if (import.meta.env.DEV) devLog(`[${level.toUpperCase()}] ${message}`);
    },
    [dispatch]
  );

  /* ---------------- 历史记录相关 ---------------- */
  const addHistory = useCallback(
    (params: AddHistoryParams) => {
      dispatch(addRecord(params));
      if (autoLog) {
        appendLogEntry(params.logLevel ?? 'info', params.description);
      }
    },
    [dispatch, autoLog, appendLogEntry]
  );

  const undoHandler = useCallback(() => {
    dispatch(undo());
    addHistory({
      actionType: 'undo',
      targetType: 'scene',
      targetName: 'Undo',
      description: '撤销一次操作',
      logLevel: 'info',
    });
  }, [dispatch, addHistory]);

  const redoHandler = useCallback(() => {
    dispatch(redo());
    addHistory({
      actionType: 'redo',
      targetType: 'scene',
      targetName: 'Redo',
      description: '重做一次操作',
      logLevel: 'info',
    });
  }, [dispatch, addHistory]);

  const clearHistoryHandler = useCallback(() => {
    dispatch(clearHistory());
    appendLogEntry('info', '已清空历史记录');
  }, [dispatch, appendLogEntry]);

  const setHistoryFilterHandler = useCallback((filter: Partial<typeof historyState.filter>) => {
    dispatch(setFilter(filter));
  }, [dispatch]);

  return {
    historyState,
    logs,
    addHistory,
    undo: undoHandler,
    redo: redoHandler,
    clearHistory: clearHistoryHandler,
    setHistoryFilter: setHistoryFilterHandler,
    info: (msg: string) => appendLogEntry('info', msg),
    warn: (msg: string) => appendLogEntry('warn', msg),
    error: (msg: string) => appendLogEntry('error', msg),
  };
}; 