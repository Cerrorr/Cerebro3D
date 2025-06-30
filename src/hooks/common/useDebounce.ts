/**
 * 通用防抖 Hook
 * 在指定延迟后执行回调，适用于高频交互
 * @author Cerror
 * @since 2025-06-30
 */
import { useRef, useCallback, useEffect } from 'react';

export const useDebouncedCallback = <T extends any[]>(
  fn: (...args: T) => void,
  delay = 300
) => {
  const timeoutRef = useRef<number | undefined>();

  const debounced = useCallback((...args: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // @ts-ignore - window.setTimeout for browser env
    timeoutRef.current = window.setTimeout(() => {
      fn(...args);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, delay]);

  /* 组件卸载时清理 */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
}; 