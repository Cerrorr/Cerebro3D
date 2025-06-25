/**
 * 底部面板组件类型定义
 * @author Cerror  
 * @since 2025-06-25
 */

export type BottomPanelType = 'assets' | 'animation' | 'console';

export interface BottomPanelProps {
  /** 默认激活的面板类型 */
  defaultActiveType?: BottomPanelType;
  /** 面板类型变化回调函数 */
  onTypeChange?: (type: BottomPanelType) => void;
  /** 面板高度 */
  height?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 自定义类名 */
  className?: string;
}

export interface BottomPanelOption {
  /** 选项值 */
  value: BottomPanelType;
  /** 显示标签 */
  label: string;
  /** 图标组件 */
  icon: React.ReactNode;
  /** 描述文本 */
  description: string;
}

export interface ContentPlaceholderProps {
  /** 图标组件 */
  icon: React.ReactNode;
  /** 标题文本 */
  title: string;
  /** 描述文本 */
  description: string;
} 