/**
 * 全局通用类型定义模块
 * 包含跨模块使用的基础业务类型
 * @author Cerror
 * @since 2025-06-23
 */

/**
 * 项目类型枚举
 * 定义系统支持的项目类别
 */
export type ProjectType = 'Web3D' | 'VR' | 'AR' | 'Game' | 'App';

/**
 * 项目标签类型
 * 定义项目的标签信息
 */
export type ProjectTag = string;

/**
 * 项目日期时间类型
 * 使用ISO字符串格式
 */
export type DateTimeString = string;

/**
 * 项目卡片数据接口
 * 定义3D编辑器中项目展示卡片的完整数据结构
 * 
 * @interface ProjectItem
 * @property {string} id - 项目唯一标识符
 * @property {string} title - 项目标题
 * @property {string} description - 项目详细描述
 * @property {string} thumbnail - 项目缩略图URL或占位符
 * @property {ProjectType} type - 项目类型（Web3D/VR/AR/Game/App）
 * @property {readonly ProjectTag[]} tags - 项目标签数组（只读）
 * @property {DateTimeString} createdAt - 项目创建时间（ISO格式）
 * @property {DateTimeString} updatedAt - 项目最后更新时间（ISO格式）
 */
export interface ProjectItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnail: string;
  readonly type: ProjectType;
  readonly tags: readonly ProjectTag[];
  readonly createdAt: DateTimeString;
  readonly updatedAt: DateTimeString;
}

/**
 * 轮播图数据接口
 * 定义首页轮播图的数据结构
 * 
 * @interface CarouselItem
 * @property {string} id - 轮播图唯一标识符
 * @property {string} title - 轮播图主标题
 * @property {string} description - 轮播图描述文本
 * @property {string} image - 轮播图片URL或占位符标识
 */
export interface CarouselItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
}

/**
 * 侧边栏菜单项数据接口
 * 定义左侧导航菜单的数据结构
 * 
 * @interface SidebarMenuItem
 * @property {string} id - 菜单项唯一标识符
 * @property {string} label - 菜单项显示文本
 * @property {string} icon - 菜单项图标（emoji或图标名）
 * @property {string} path - 菜单项路由路径
 * @property {boolean} [active] - 是否为当前激活状态（可选）
 */
export interface SidebarMenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly path: string;
  readonly active?: boolean;
}

/**
 * 应用程序信息接口
 * 定义应用的基本元数据信息
 * 
 * @interface AppInfo
 * @property {string} name - 应用程序名称
 * @property {string} version - 应用程序版本号
 * @property {string} author - 应用程序作者
 * @property {string} license - 应用程序许可证或备案信息
 * @property {string} [licenseUrl] - 备案号跳转链接（可选）
 */
export interface AppInfo {
  readonly name: string;
  readonly version: string;
  readonly author: string;
  readonly license: string;
  readonly licenseUrl?: string;
}

/**
 * 类型守卫：检查是否为有效的项目类型
 * 用于运行时类型检查，确保类型安全
 * 
 * @param value - 待检查的值
 * @returns {boolean} 如果是有效的项目类型则返回true
 */
export function isValidProjectType(value: unknown): value is ProjectType {
  const validTypes: readonly ProjectType[] = ['Web3D', 'VR', 'AR', 'Game', 'App'];
  return typeof value === 'string' && validTypes.includes(value as ProjectType);
}

/**
 * 项目点击事件处理函数类型
 * 定义项目卡片点击时的回调函数签名
 * 
 * @param project - 被点击的项目对象
 * @returns void
 */
export type ProjectClickHandler = (project: ProjectItem) => void;

/**
 * 菜单点击事件处理函数类型
 * 定义侧边栏菜单点击时的回调函数签名
 * 
 * @param menuItem - 被点击的菜单项对象
 * @returns void
 */
export type MenuClickHandler = (menuItem: SidebarMenuItem) => void;

/**
 * 类型守卫：检查是否为有效的项目对象
 * 用于运行时验证项目数据的完整性
 * 
 * @param value - 待检查的值
 * @returns {boolean} 如果是有效的项目对象则返回true
 */
export function isValidProjectItem(value: unknown): value is ProjectItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  
  const item = value as Record<string, unknown>;
  
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.description === 'string' &&
    typeof item.thumbnail === 'string' &&
    isValidProjectType(item.type) &&
    Array.isArray(item.tags) &&
    item.tags.every((tag): tag is string => typeof tag === 'string') &&
    typeof item.createdAt === 'string' &&
    typeof item.updatedAt === 'string'
  );
} 