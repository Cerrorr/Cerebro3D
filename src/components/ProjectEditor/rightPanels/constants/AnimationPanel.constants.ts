/**
 * 动画面板相关常量
 * @author Cerror
 * @since 2025-07-11
 */

import { AnimationType, AnimationStatus } from '../types/AnimationPanel.types';

/**
 * 动画类型图标映射
 */
export const ANIMATION_TYPE_ICONS: Record<AnimationType, string> = {
  position: '📍',
  rotation: '🔄',
  scale: '📏',
  opacity: '👁️',
  material: '🎨',
  camera: '📷',
  light: '💡',
  keyframe: '🎬',
  morph: '🔄',
  skeletal: '🦴',
  custom: '⚙️'
};

/**
 * 动画类型颜色映射
 */
export const ANIMATION_TYPE_COLORS: Record<AnimationType, string> = {
  position: '#52c41a',
  rotation: '#1890ff',
  scale: '#fa8c16',
  opacity: '#722ed1',
  material: '#eb2f96',
  camera: '#13c2c2',
  light: '#fadb14',
  keyframe: '#2f54eb',
  morph: '#f759ab',
  skeletal: '#d48806',
  custom: '#8c8c8c'
};

/**
 * 动画状态颜色映射
 */
export const ANIMATION_STATUS_COLORS: Record<AnimationStatus, string> = {
  playing: '#52c41a',
  paused: '#fa8c16',
  stopped: '#8c8c8c',
  completed: '#1890ff'
};