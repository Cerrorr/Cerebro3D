/**
 * CarouselSection组件常量配置
 * 集中管理轮播组件相关的常量数据
 * @author Cerror
 * @since 2024-01-22
 */

import type { CarouselItem } from '@/types/common.types';

/**
 * 默认轮播图项目配置
 * 定义轮播图的默认展示内容
 */
export const DEFAULT_CAROUSEL_ITEMS: readonly CarouselItem[] = [
  {
    id: '1',
    title: '欢迎使用 Cerebro3D',
    description: '智能化Web3D编辑器，让创作更简单',
    image: '' // 使用渐变背景
  },
  {
    id: '2',
    title: '创建精美的3D场景',
    description: '拖拽式操作，所见即所得',
    image: '' // 使用渐变背景
  },
  {
    id: '3',
    title: '实时预览与发布',
    description: '一键发布到Web，随时随地访问',
    image: '' // 使用渐变背景
  }
] as const;

/**
 * 轮播图渐变背景配置
 * 定义每个轮播项的背景渐变样式
 */
export const CAROUSEL_GRADIENTS: readonly string[] = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
] as const;

/**
 * 轮播图装饰图标配置
 * 定义每个轮播项的装饰图标
 */
export const CAROUSEL_ICONS: readonly string[] = ['🚀', '✨', '🌟'] as const; 