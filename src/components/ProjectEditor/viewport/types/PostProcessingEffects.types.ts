/**
 * PostProcessingEffects 组件类型定义
 * @author Cerror
 * @since 2025-08-29
 */

import type { PostProcessingConfig } from '@/components/projectEditor/rightPanels/types/PostProcessing.types';

export interface PostProcessingEffectsProps {
  /** 选中的对象数组，用于描边效果 */
  selectedObjects?: any[];
  /** 后期处理配置 */
  config: PostProcessingConfig;
}