/**
 * 渲染器配置防抖Hook - 减少频繁配置更新导致的性能问题
 * @author Cerror
 * @since 2025-08-28
 */

import { useRef, useCallback, useEffect } from 'react';

interface DebouncedRendererConfig {
  toneMapping: { type: string };
  shadow: { enabled: boolean; type: string };
  frameRate: { type: string };
  globalIllumination: { enabled: boolean };
}

/**
 * 使用防抖的渲染器配置Hook
 * @param config 原始配置
 * @param delay 防抖延迟（毫秒）
 * @returns 防抖后的配置
 */
export const useDebouncedRendererConfig = (
  config: DebouncedRendererConfig,
  delay: number = 100
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const debouncedConfigRef = useRef<DebouncedRendererConfig>(config);
  const callbacksRef = useRef<Array<() => void>>([]);

  // 防抖更新函数
  const updateConfig = useCallback((newConfig: DebouncedRendererConfig) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      debouncedConfigRef.current = newConfig;
      // 触发所有注册的回调
      callbacksRef.current.forEach(callback => callback());
    }, delay);
  }, [delay]);

  // 配置变化时更新
  useEffect(() => {
    updateConfig(config);
  }, [config, updateConfig]);

  // 注册配置变化回调
  const registerCallback = useCallback((callback: () => void) => {
    callbacksRef.current.push(callback);
    
    // 返回取消注册函数
    return () => {
      const index = callbacksRef.current.indexOf(callback);
      if (index > -1) {
        callbacksRef.current.splice(index, 1);
      }
    };
  }, []);

  // 清理函数
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    debouncedConfig: debouncedConfigRef.current,
    registerCallback,
  };
};