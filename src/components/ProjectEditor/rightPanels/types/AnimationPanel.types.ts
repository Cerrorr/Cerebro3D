/**
 * 动画面板组件类型定义
 * @author Cerror
 * @since 2025-06-25
 */

/**
 * 动画类型枚举
 */
export type AnimationType = 
  | 'position'    // 位置动画
  | 'rotation'    // 旋转动画
  | 'scale'       // 缩放动画
  | 'opacity'     // 透明度动画
  | 'material'    // 材质动画
  | 'camera'      // 相机动画
  | 'light'       // 灯光动画
  | 'keyframe'    // 关键帧动画
  | 'morph'       // 形变动画
  | 'skeletal'    // 骨骼动画
  | 'custom';     // 自定义动画

/**
 * 动画状态枚举
 */
export type AnimationStatus = 'playing' | 'paused' | 'stopped' | 'completed';

/**
 * 动画缓动类型
 */
export type AnimationEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic' | 'back';

/**
 * 动画项接口
 */
export interface AnimationItem {
  /** 动画唯一标识 */
  id: string;
  /** 动画名称 */
  name: string;
  /** 动画类型 */
  type: AnimationType;
  /** 目标对象ID */
  targetId: string;
  /** 目标对象名称 */
  targetName: string;
  /** 动画时长（毫秒） */
  duration: number;
  /** 当前进度百分比 (0-100) */
  progress: number;
  /** 动画状态 */
  status: AnimationStatus;
  /** 缓动类型 */
  easing: AnimationEasing;
  /** 是否循环播放 */
  loop: boolean;
  /** 延迟开始时间（毫秒） */
  delay: number;
  /** 创建时间 */
  createdAt: Date;
  /** 最后修改时间 */
  updatedAt: Date;
  /** 是否启用 */
  enabled: boolean;
}

/**
 * 动画播放控制配置
 */
export interface AnimationPlaybackConfig {
  /** 全局播放速度倍率 (0.1 - 5.0) */
  playbackSpeed: number;
  /** 是否自动播放 */
  autoPlay: boolean;
  /** 是否循环播放全部动画 */
  loopAll: boolean;
  /** 混合模式 */
  blendMode: 'replace' | 'add' | 'multiply';
}

/**
 * 动画面板配置
 */
export interface AnimationPanelConfig {
  /** 是否显示预览 */
  showPreview: boolean;
  /** 是否显示时间轴 */
  showTimeline: boolean;
  /** 是否自动保存 */
  autoSave: boolean;
  /** 列表显示模式 */
  listMode: 'compact' | 'detailed';
  /** 排序方式 */
  sortBy: 'name' | 'type' | 'created' | 'duration' | 'status';
  /** 排序顺序 */
  sortOrder: 'asc' | 'desc';
}

/**
 * 动画面板状态
 */
export interface AnimationPanelState {
  /** 动画列表 */
  animations: AnimationItem[];
  /** 当前选中的动画ID */
  selectedAnimationId: string | null;
  /** 播放配置 */
  playbackConfig: AnimationPlaybackConfig;
  /** 面板配置 */
  config: AnimationPanelConfig;
  /** 搜索关键词 */
  searchKeyword: string;
  /** 过滤类型 */
  filterType: AnimationType | 'all';
  /** 过滤状态 */
  filterStatus: AnimationStatus | 'all';
}

/**
 * 动画面板组件属性接口
 */
export interface AnimationPanelProps {
  /** 动画面板状态 */
  animationState: AnimationPanelState;
  /** 动画选择回调 */
  onAnimationSelect?: (animationId: string) => void;
  /** 动画播放回调 */
  onAnimationPlay?: (animationId: string) => void;
  /** 动画暂停回调 */
  onAnimationPause?: (animationId: string) => void;
  /** 动画停止回调 */
  onAnimationStop?: (animationId: string) => void;
  /** 动画删除回调 */
  onAnimationDelete?: (animationId: string) => void;
  /** 动画进度变更回调 */
  onProgressChange?: (animationId: string, progress: number) => void;
  /** 播放速度变更回调 */
  onSpeedChange?: (speed: number) => void;
  /** 播放配置变更回调 */
  onPlaybackConfigChange?: (config: Partial<AnimationPlaybackConfig>) => void;
  /** 面板配置变更回调 */
  onConfigChange?: (config: Partial<AnimationPanelConfig>) => void;
  /** 搜索回调 */
  onSearch?: (keyword: string) => void;
  /** 过滤回调 */
  onFilter?: (type: AnimationType | 'all', status: AnimationStatus | 'all') => void;
}

/**
 * 动画类型图标映射
 */
export const ANIMATION_TYPE_ICONS: Record<AnimationType, string> = {
  position: '📍',
  rotation: '🔄',
  scale: '📏',
  opacity: '👁️',
  material: '🎨',
  camera: '📷',
  light: '💡',
  keyframe: '🎬',
  morph: '🔄',
  skeletal: '🦴',
  custom: '⚙️'
};

/**
 * 动画类型颜色映射
 */
export const ANIMATION_TYPE_COLORS: Record<AnimationType, string> = {
  position: '#52c41a',
  rotation: '#1890ff',
  scale: '#fa8c16',
  opacity: '#722ed1',
  material: '#eb2f96',
  camera: '#13c2c2',
  light: '#fadb14',
  keyframe: '#2f54eb',
  morph: '#f759ab',
  skeletal: '#d48806',
  custom: '#8c8c8c'
};

/**
 * 动画状态颜色映射
 */
export const ANIMATION_STATUS_COLORS: Record<AnimationStatus, string> = {
  playing: '#52c41a',
  paused: '#fa8c16',
  stopped: '#8c8c8c',
  completed: '#1890ff'
}; 