/**
 * 历史记录状态管理
 * 管理用户操作历史记录和系统日志
 * @author Cerror
 * @since 2025-07-08
 */

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { DEFAULT_HISTORY_STATE } from '@/components/projectEditor/rightPanels/types/HistoryPanel.types';
import type {
  HistorySliceState,
  HistoryRecord,
  LogEntry,
  LogLevel,
} from '@/store/types/historySlice.types';

const initialState: HistorySliceState = {
  ...DEFAULT_HISTORY_STATE,
  logs: [],
  currentIndex: -1,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    appendLog: {
      prepare: (level: LogLevel, message: string) => ({
        payload: {
          id: nanoid(),
          level,
          message,
          time: new Date().toLocaleTimeString(),
        } as LogEntry,
      }),
      /**
       * 添加日志条目到状态中
       * @param state 当前状态
       * @param payload 日志条目数据
       */
      reducer(state, { payload }: PayloadAction<LogEntry>) {
        state.logs.push(payload);
      },
    },

    /* 历史记录 */
    addRecord: {
      prepare: (record: Omit<HistoryRecord, 'id' | 'timestamp' | 'isUndone'>) => ({
        payload: {
          ...record,
          id: nanoid(),
          timestamp: Date.now(),
          isUndone: false,
        } as HistoryRecord,
      }),
      /**
       * 添加历史记录到状态中
       * @param state 当前状态
       * @param payload 历史记录数据
       */
      reducer(state, { payload }: PayloadAction<HistoryRecord>) {
        // 截断未来记录
        state.records = state.records.slice(0, state.currentIndex + 1);
        state.records.push(payload);
        state.currentIndex = state.records.length - 1;
        if (state.records.length > state.maxRecords) {
          state.records.shift();
          state.currentIndex -= 1;
        }
      },
    },

    /**
     * 撤销操作
     * @param state 当前状态
     */
    undo(state) {
      if (state.currentIndex < 0) return;
      state.records[state.currentIndex].isUndone = true;
      state.currentIndex -= 1;
    },
    /**
     * 重做操作
     * @param state 当前状态
     */
    redo(state) {
      if (state.currentIndex >= state.records.length - 1) return;
      state.currentIndex += 1;
      state.records[state.currentIndex].isUndone = false;
    },
    /**
     * 清空历史记录
     * @param state 当前状态
     */
    clearHistory(state) {
      state.records = [];
      state.currentIndex = -1;
    },
    /**
     * 设置历史记录过滤器
     * @param state 当前状态
     * @param payload 过滤器配置
     */
    setFilter(state, { payload }: PayloadAction<Partial<HistorySliceState['filter']>>) {
      state.filter = { ...state.filter, ...payload };
    },
  },
});

export const {
  appendLog,
  addRecord,
  undo,
  redo,
  clearHistory,
  setFilter,
} = historySlice.actions;

export default historySlice.reducer; 