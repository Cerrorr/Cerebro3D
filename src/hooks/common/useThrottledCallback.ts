/**
 * 节流Hook - 用于优化高频率的配置更新
 * @author Cerror
 * @since 2025-08-28
 */

import { useCallback, useRef } from 'react';

/**
 * 使用节流的Hook来减少高频调用
 * @param callback 要节流的函数
 * @param delay 节流间隔（毫秒）
 * @returns 节流后的函数
 */
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      // 如果距离上次调用时间超过delay，立即执行
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        // 否则延迟执行（防止最后一次调用丢失）
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
          timeoutRef.current = null;
        }, delay - (now - lastCallRef.current));
      }
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
};