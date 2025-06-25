/**
 * 右侧栏配置常量
 * 集中管理右侧栏相关的常量数据
 * @author Cerror
 * @since 2024-01-22
 */

import React from 'react';
import {
  RadarChartOutlined,
  VideoCameraOutlined,
  SunOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  RocketOutlined,
  FormatPainterOutlined,
  FunctionOutlined,
  BuildOutlined
} from '@ant-design/icons';
import type { RightSidebarTabType, RightSidebarTabItem } from '../types/rightSidebar.types';

/**
 * 标签标题映射表
 * 定义每个标签ID对应的中文标题
 */
export const TAB_TITLE_MAP: Record<RightSidebarTabType, string> = {
  scene: '场景配置',
  camera: '相机配置', 
  lighting: '灯光配置',
  renderer: '渲染器配置',
  postprocess: '后期处理',
  weather: '天气设置',
  history: '历史记录',
  object: '对象',
  geometry: '几何',
  material: '材质',
  animation: '动画',
  script: '脚本'
};

/**
 * 空状态图标映射表
 * 定义每个标签对应的空状态显示图标
 */
export const EMPTY_STATE_ICONS: Record<RightSidebarTabType, string> = {
  scene: '🎬',
  camera: '📹',
  lighting: '💡',
  renderer: '👁️',
  postprocess: '🔬',
  weather: '⚡',
  history: '⏰',
  object: '📦',
  geometry: '🔧',
  material: '🎨',
  animation: '🚀',
  script: '⚙️'
};

/**
 * 标签图标映射表
 * 定义每个标签对应的图标组件
 */
export const TAB_ICON_MAP: Record<RightSidebarTabType, () => React.ReactElement> = {
  scene: () => React.createElement(RadarChartOutlined),
  camera: () => React.createElement(VideoCameraOutlined),
  lighting: () => React.createElement(SunOutlined),
  renderer: () => React.createElement(EyeOutlined),
  postprocess: () => React.createElement(ThunderboltOutlined),
  weather: () => React.createElement(BuildOutlined),
  history: () => React.createElement(ClockCircleOutlined),
  object: () => React.createElement(AppstoreOutlined),
  geometry: () => React.createElement(RocketOutlined),
  material: () => React.createElement(FormatPainterOutlined),
  animation: () => React.createElement(FunctionOutlined),
  script: () => React.createElement(BuildOutlined)
};

/**
 * 获取标签配置项列表
 * 返回所有可用的标签项及其配置
 */
export const getTabItems = (): RightSidebarTabItem[] => [
  // 配置组 🎛️
  {
    id: 'scene',
    label: '场景配置',
    icon: TAB_ICON_MAP.scene(),
    enabled: true,
    group: 'config'
  },
  {
    id: 'camera',
    label: '相机配置',
    icon: TAB_ICON_MAP.camera(),
    enabled: true,
    group: 'config'
  },
  {
    id: 'lighting',
    label: '灯光配置',
    icon: TAB_ICON_MAP.lighting(),
    enabled: true,
    group: 'config'
  },
  {
    id: 'renderer',
    label: '渲染器配置',
    icon: TAB_ICON_MAP.renderer(),
    enabled: true,
    group: 'config'
  },
  {
    id: 'postprocess',
    label: '后期处理',
    icon: TAB_ICON_MAP.postprocess(),
    enabled: true,
    group: 'config'
  },
  {
    id: 'weather',
    label: '天气设置',
    icon: TAB_ICON_MAP.weather(),
    enabled: true,
    group: 'config'
  },
  {
    id: 'history',
    label: '历史记录',
    icon: TAB_ICON_MAP.history(),
    enabled: true,
    group: 'config'
  },
  // 内容组 📦
  {
    id: 'object',
    label: '对象',
    icon: TAB_ICON_MAP.object(),
    enabled: true,
    group: 'content'
  },
  {
    id: 'geometry',
    label: '几何',
    icon: TAB_ICON_MAP.geometry(),
    enabled: true,
    group: 'content'
  },
  {
    id: 'material',
    label: '材质',
    icon: TAB_ICON_MAP.material(),
    enabled: true,
    group: 'content'
  },
  {
    id: 'animation',
    label: '动画',
    icon: TAB_ICON_MAP.animation(),
    enabled: true,
    group: 'content'
  },
  {
    id: 'script',
    label: '脚本',
    icon: TAB_ICON_MAP.script(),
    enabled: true,
    group: 'content'
  }
];

/**
 * 默认配置常量
 */
export const DEFAULT_CONFIG = {
  /** 默认宽度 */
  DEFAULT_WIDTH: 300,
  /** 收起宽度 */
  COLLAPSED_WIDTH: 48,
  /** 默认激活标签 */
  DEFAULT_ACTIVE_TAB: 'scene' as RightSidebarTabType,
  /** 历史记录标签索引（用于添加分割线） */
  HISTORY_TAB_INDEX: 5,
  /** 默认收起状态 */
  DEFAULT_COLLAPSED: true
} as const; 