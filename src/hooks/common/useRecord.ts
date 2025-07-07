// 通用记录 Hook
// 为右侧面板生成记录函数，写入历史&日志，仅记录状态不实现功能

import { useHistoryRecorder } from '@/hooks/business/useHistoryRecorder';
import { useRef, useEffect, useCallback } from 'react';
import type {
  HistoryActionType,
  HistoryTargetType,
} from '@/components/projectEditor/rightPanels/types/HistoryPanel.types';
import type { AddHistoryParams } from '@/hooks/business/types/useHistoryRecorder.types';

/**
 * useRecord
 * @param panelName 面板名称，用于前缀描述
 * @returns record(desc, actionType?, targetType?)
 */
export const useRecord = (panelName: string) => {
  const { addHistory } = useHistoryRecorder();

  // 存储各条记录对应的定时器 ID，实现手动防抖
  const timerMap = useRef<Record<string, NodeJS.Timeout>>({});

  /**
   * 触发记录（带防抖）
   * @param key 唯一键（desc）
   * @param params 记录参数
   */
  const triggerRecord = useCallback((key: string, params: AddHistoryParams) => {
    // 如果已存在计时器，则重置
    if (timerMap.current[key]) {
      clearTimeout(timerMap.current[key]);
    }
    
    timerMap.current[key] = setTimeout(() => {
      addHistory(params);
      delete timerMap.current[key];
    }, 300);
  }, [addHistory]);

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      Object.values(timerMap.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  return useCallback((
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
      triggerRecord(desc, params);
    } else {
      addHistory(params);
    }
  }, [addHistory, triggerRecord]);
}; 