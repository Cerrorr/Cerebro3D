/**
 * 通用记录 Hook
 * 为右侧面板生成记录函数，写入历史&日志，仅记录状态不实现功能
 * @author Cerror
 * @since 2025-06-30
 */

import { useHistoryRecorder } from '@/hooks/business/useHistoryRecorder';
import { useRef } from 'react';
import type {
  HistoryActionType,
  HistoryTargetType,
} from '@/components/projectEditor/rightPanels/types/HistoryPanel.types';
import { useDebouncedCallback } from './useDebounce';
import type { AddHistoryParams } from '@/hooks/business/types/useHistoryRecorder.types';

/**
 * useRecord
 * @param panelName 面板名称，用于前缀描述
 * @returns record(desc, actionType?, targetType?)
 */
export const useRecord = (panelName: string) => {
  const { addHistory } = useHistoryRecorder();

  // 保存不同 desc 的 debounced 函数
  const debounceMap = useRef<Record<string, (...args: any[]) => void>>({});

  const getDebounced = (key: string) => {
    if (!debounceMap.current[key]) {
      debounceMap.current[key] = useDebouncedCallback<[
        AddHistoryParams
      ]>((record) => addHistory(record), 300);
    }
    return debounceMap.current[key];
  };

  return (
    desc: string,
    actionType: HistoryActionType = 'modify',
    targetType: HistoryTargetType = 'scene',
    debounce = true
  ) => {
    const params = {
      actionType,
      targetType,
      targetName: panelName,
      description: `[${panelName}] ${desc}`,
    } as const;

    if (debounce) {
      (getDebounced(desc) as (p: AddHistoryParams) => void)(params);
    } else {
      addHistory(params);
    }
  };
}; 