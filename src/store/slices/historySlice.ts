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
    /* 日志 */
    appendLog: {
      prepare: (level: LogLevel, message: string) => ({
        payload: {
          id: nanoid(),
          level,
          message,
          time: new Date().toLocaleTimeString(),
        } as LogEntry,
      }),
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

    undo(state) {
      if (state.currentIndex < 0) return;
      state.records[state.currentIndex].isUndone = true;
      state.currentIndex -= 1;
    },
    redo(state) {
      if (state.currentIndex >= state.records.length - 1) return;
      state.currentIndex += 1;
      state.records[state.currentIndex].isUndone = false;
    },
    clearHistory(state) {
      state.records = [];
      state.currentIndex = -1;
    },
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