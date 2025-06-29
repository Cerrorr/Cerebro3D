/**
 * 侧边栏底部组件类型定义
 * 独立声明，不再从其他文件 re-export
 * @author Cerror
 * @since 2025-06-29
 */

export interface AppInfo {
  readonly name: string;
  readonly version: string;
  readonly author: string;
  readonly license: string;
  readonly licenseUrl?: string;
}

export interface SidebarFooterProps {
  readonly appInfo: AppInfo;
} 