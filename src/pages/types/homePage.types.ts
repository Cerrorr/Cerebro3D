/**
 * 首页组件类型定义
 * 包含首页特有的业务类型和事件处理器类型
 * @author Cerror
 * @since 2025-06-24
 */

import type {
  SidebarMenuItem,
  AppInfo,
  CarouselItem,
  ProjectItem,
} from '@/components/homePage/types';

/**
 * 首页组件Props接口
 * 虽然首页组件当前不接收外部props，但为扩展性预留
 */
export interface HomePageProps {
  // 预留扩展属性
}

/**
 * 首页状态接口
 * 定义首页组件内部状态类型
 */
export interface HomePageState {
  // 项目列表（只读）
  readonly projects: readonly ProjectItem[];
  // 菜单项列表（只读）
  readonly menuItems: readonly SidebarMenuItem[];
  // 轮播图列表（只读）
  readonly carouselItems: readonly CarouselItem[];
  // 应用信息
  readonly appInfo: AppInfo;
}
