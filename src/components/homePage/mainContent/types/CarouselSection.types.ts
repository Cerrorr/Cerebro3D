/**
 * 轮播项数据
 * @author Cerror
 * @since 2025-07-08 */
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
