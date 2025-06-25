/**
 * 百度统计工具类型定义
 * 包含analytics.ts相关的所有类型声明
 * @author Cerror
 * @since 2025-06-24
 */

/**
 * 百度统计全局对象类型声明
 * 扩展Window接口以支持百度统计
 */
declare global {
  interface Window {
    /** 百度统计数据推送数组 */
    _hmt?: Array<(string | number)[]>;
    /** 百度统计脚本元素 */
    hm?: HTMLScriptElement;
  }
}

/**
 * 百度统计事件数据接口
 * 定义追踪事件的数据结构
 */
export interface AnalyticsEvent {
  /** 事件分类 */
  category: string;
  /** 事件动作 */
  action: string;
  /** 事件标签（可选） */
  label?: string;
  /** 事件值（可选） */
  value?: number;
}

/**
 * 页面访问追踪数据接口
 * 定义页面访问追踪的数据结构
 */
export interface PageViewData {
  /** 页面路径 */
  pagePath: string;
  /** 页面标题（可选） */
  pageTitle?: string;
  /** 访问时间戳 */
  timestamp?: number;
}

/**
 * 项目追踪事件类型
 * 定义项目相关的事件类型
 */
export type ProjectEventType = 'create' | 'open' | 'share' | 'save' | 'export';

/**
 * 菜单追踪事件数据接口
 * 定义菜单点击追踪的数据结构
 */
export interface MenuClickData {
  /** 菜单ID */
  menuId: string;
  /** 菜单标签 */
  menuLabel: string;
  /** 点击时间戳 */
  timestamp?: number;
}

/**
 * 用户行为追踪数据接口
 * 定义用户行为追踪的数据结构
 */
export interface UserBehaviorData {
  /** 页面路径 */
  pagePath: string;
  /** 停留时间（毫秒） */
  duration?: number;
  /** 行为类型 */
  behaviorType: 'stay' | 'scroll' | 'click' | 'input';
} 