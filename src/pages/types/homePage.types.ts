/**
 * 首页组件类型定义
 * 包含首页特有的业务类型和事件处理器类型
 * @author Cerror
 * @since 2025-06-24
 */

import { 
  SidebarMenuItem, 
  AppInfo, 
  CarouselItem, 
  ProjectItem
} from '@/types/common.types';

/**
 * 首页组件Props接口
 * 虽然首页组件当前不接收外部props，但为扩展性预留
 * 
 * @interface HomePageProps
 */
export interface HomePageProps {
  // 预留扩展属性
}

/**
 * 首页状态接口
 * 定义首页组件内部状态类型
 * 
 * @interface HomePageState
 * @property {readonly ProjectItem[]} projects - 项目列表（只读）
 * @property {readonly SidebarMenuItem[]} menuItems - 菜单项列表（只读）
 * @property {readonly CarouselItem[]} carouselItems - 轮播图列表（只读）
 * @property {AppInfo} appInfo - 应用信息
 */
export interface HomePageState {
  readonly projects: readonly ProjectItem[];
  readonly menuItems: readonly SidebarMenuItem[];
  readonly carouselItems: readonly CarouselItem[];
  readonly appInfo: AppInfo;
} 