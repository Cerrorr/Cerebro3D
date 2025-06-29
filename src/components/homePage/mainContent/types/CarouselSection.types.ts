/**
 * 轮播项数据
 */
export interface CarouselItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
}

/**
 * CarouselSection 组件 Props
 */
export interface CarouselSectionProps {
  readonly items: readonly CarouselItem[];
} 