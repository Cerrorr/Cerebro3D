/**
 * 百度统计工具类
 * 提供页面访问追踪和自定义事件追踪功能
 * @author Cerror
 * @since 2025-06-25
 */

import './types/analytics.types';

/**
 * 开发环境日志输出
 * 只在开发环境输出日志，生产环境静默
 */
const devLog = {
  log: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(message, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error(message, ...args);
    }
  }
};

/**
 * 百度统计分析工具类
 */
export class BaiduAnalytics {
  private static initialized = false;

  /**
   * 初始化百度统计
   * 从环境变量读取统计ID并动态加载脚本
   */
  static init(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    const analyticsId = import.meta.env.VITE_BAIDU_ANALYTICS_ID;
    if (!analyticsId) {
      devLog.warn('百度统计ID未配置，请在.env文件中设置VITE_BAIDU_ANALYTICS_ID');
      return;
    }

    try {
      // 初始化百度统计全局变量
      window._hmt = window._hmt || [];
      
      // 动态加载百度统计脚本
      const script = document.createElement('script');
      script.src = `https://hm.baidu.com/hm.js?${analyticsId}`;
      script.async = true;
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
      
      this.initialized = true;
      devLog.log('✅ 百度统计已初始化');
    } catch (error) {
      devLog.error('百度统计初始化失败:', error);
    }
  }

  /**
   * 检查百度统计是否已加载
   * @returns {boolean} 是否已加载
   */
  static isLoaded(): boolean {
    return typeof window !== 'undefined' && Array.isArray(window._hmt) && this.initialized;
  }

  /**
   * 追踪页面访问
   * @param pagePath - 页面路径
   * @param pageTitle - 页面标题（可选）
   */
  static trackPageView(pagePath: string, pageTitle?: string): void {
    if (!this.isLoaded()) {
      devLog.warn('百度统计未加载');
      return;
    }

    try {
      // 追踪页面访问
      window._hmt!.push(['_trackPageview', pagePath]);
      
      if (pageTitle) {
        // 设置页面标题
        window._hmt!.push(['_setCustomVar', 1, 'page_title', pageTitle, 3]);
      }
      
      devLog.log(`📊 页面访问追踪: ${pagePath}${pageTitle ? ` (${pageTitle})` : ''}`);
    } catch (error) {
      devLog.error('百度统计页面追踪失败:', error);
    }
  }

  /**
   * 追踪自定义事件
   * @param category - 事件分类
   * @param action - 事件动作
   * @param label - 事件标签（可选）
   * @param value - 事件值（可选）
   */
  static trackEvent(
    category: string, 
    action: string, 
    label?: string, 
    value?: number
  ): void {
    if (!this.isLoaded()) {
      devLog.warn('百度统计未加载');
      return;
    }

    try {
      // 构建事件数据
      const eventData: any[] = ['_trackEvent', category, action];
      
      if (label) {
        eventData.push(label);
      }
      
      if (value !== undefined) {
        eventData.push(value);
      }

      window._hmt!.push(eventData);
      
      devLog.log(`📊 事件追踪: ${category} -> ${action}${label ? ` (${label})` : ''}${value !== undefined ? ` [${value}]` : ''}`);
    } catch (error) {
      devLog.error('百度统计事件追踪失败:', error);
    }
  }

  /**
   * 追踪项目相关事件
   */
  static trackProject = {
    /**
     * 项目创建事件
     * @param projectType - 项目类型
     */
    create: (projectType: string) => {
      BaiduAnalytics.trackEvent('项目管理', '创建项目', projectType);
    },

    /**
     * 项目打开事件
     * @param projectId - 项目ID
     * @param projectType - 项目类型
     */
    open: (projectId: string, projectType: string) => {
      BaiduAnalytics.trackEvent('项目管理', '打开项目', `${projectType}_${projectId}`);
    },

    /**
     * 项目分享事件
     * @param projectId - 项目ID
     */
    share: (projectId: string) => {
      BaiduAnalytics.trackEvent('项目管理', '分享项目', projectId);
    }
  };

  /**
   * 追踪菜单相关事件
   */
  static trackMenu = {
    /**
     * 菜单点击事件
     * @param menuId - 菜单ID
     * @param menuLabel - 菜单标签
     */
    click: (menuId: string, menuLabel: string) => {
      BaiduAnalytics.trackEvent('导航菜单', '点击菜单', `${menuId}_${menuLabel}`);
    }
  };

  /**
   * 追踪用户行为事件
   */
  static trackUser = {
    /**
     * 用户停留时间（页面卸载时调用）
     * @param pagePath - 页面路径
     * @param stayTime - 停留时间（秒）
     */
    stayTime: (pagePath: string, stayTime: number) => {
      BaiduAnalytics.trackEvent('用户行为', '页面停留', pagePath, stayTime);
    }
  };
}

/**
 * React Hook: 页面访问追踪
 * @param pagePath - 页面路径
 * @param pageTitle - 页面标题
 */
export const usePageTracking = (pagePath: string, pageTitle?: string) => {
  React.useEffect(() => {
    BaiduAnalytics.trackPageView(pagePath, pageTitle);
  }, [pagePath, pageTitle]);
};

// 导入React用于Hook
import React from 'react'; 