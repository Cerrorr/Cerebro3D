/**
 * Transform控制器管理Hook
 * 处理变换控制器的模式切换和快捷键
 * @author Cerror
 * @since 2025-08-22
 */

import { useState, useEffect } from 'react';

import type {
  UseTransformControlsProps,
  UseTransformControlsReturn
} from './types/useTransformControls.types';

export const useTransformControls = ({
  selectedObjects,
  helpersEnabled
}: UseTransformControlsProps): UseTransformControlsReturn => {
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  // 变换控制器快捷键监听
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 阻止在输入框中触发快捷键
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // 仅在有选中对象且辅助功能开启时才响应快捷键
      if (selectedObjects.length === 0 || !helpersEnabled) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'g':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setTransformMode('translate');
          }
          break;
        case 'r':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setTransformMode('rotate');
          }
          break;
        case 's':
          if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            setTransformMode('scale');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedObjects.length, helpersEnabled]);

  const isEnabled = helpersEnabled && selectedObjects.length > 0;

  return {
    transformMode,
    setTransformMode,
    isEnabled,
  };
};