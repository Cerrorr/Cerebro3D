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

/** 动画播放状态类型 */
export type AnimationPlayState = 'playing' | 'paused' | 'stopped';

/** 动画编辑器状态接口 */
export interface AnimationEditorState {
  /** 播放状态 */
  playState: AnimationPlayState;
  /** 当前时间（秒） */
  currentTime: number;
  /** 总时长（秒） */
  duration: number;
  /** 当前帧数 */
  currentFrame: number;
  /** 总帧数 */
  totalFrames: number;
  /** 帧率 */
  frameRate: number;
  /** 是否有选中的对象 */
  hasSelectedObject: boolean;
}

/** 动画控制器属性接口 */
export interface AnimationControlsProps {
  /** 动画状态 */
  animationState: AnimationEditorState;
  /** 播放/暂停回调 */
  onPlayPause: () => void;
  /** 上一帧回调 */
  onPreviousFrame: () => void;
  /** 下一帧回调 */
  onNextFrame: () => void;
}

/** 日志条目类型 */
export interface LogEntry {
  /** 时间戳 */
  time: string;
  /** 日志级别 */
  level: 'info' | 'warn' | 'error';
  /** 日志消息 */
  message: string;
}

/** 资源分类配置类型 */
export interface AssetCategory {
  /** 分类标识符 */
  key: string;
  /** 分类显示名称 */
  label: string;
  /** 分类图标 */
  icon: React.ReactNode;
}

/** 资源标签页配置类型 */
export interface AssetTab {
  /** 标签页标识符 */
  key: string;
  /** 标签页显示名称 */
  label: string;
}

/** 资源数据结构类型 */
export interface AssetData {
  /** 图标视图数据 */
  icon: AssetItem[];
  /** 文本视图数据 */
  text: AssetItem[];
}

/** 资源项目类型 */
export interface AssetItem {
  /** 资源唯一标识 */
  id: string;
  /** 资源名称 */
  name: string;
  /** 资源预览颜色 */
  color: string;
  /** 资源类型 */
  type?: string;
  /** 资源路径 */
  path?: string;
}

/** 资源数据模拟类型 */
export interface MockAssetDataType {
  /** 模型分类资源 */
  model: AssetData;
  /** 粒子分类资源 */
  particle: AssetData;
  /** 广告牌分类资源 */
  billboard: AssetData;
  /** 面板分类资源 */
  panel: AssetData;
}

// 拆分后的组件属性接口

/** 底部面板头部组件属性接口 */
export interface BottomPanelHeaderProps {
  /** 当前激活的面板类型 */
  activeType: BottomPanelType;
  /** 面板类型变化回调 */
  onTypeChange: (type: BottomPanelType) => void;
  /** 动画编辑器状态 */
  animationState?: AnimationEditorState;
  /** 动画播放/暂停回调 */
  onAnimationPlayPause?: () => void;
  /** 上一帧回调 */
  onPreviousFrame?: () => void;
  /** 下一帧回调 */
  onNextFrame?: () => void;
  /** 时间格式化函数 */
  formatTime?: (seconds: number) => string;
}

/** 资源面板组件属性接口 */
export interface AssetsPanelProps {
  /** 搜索关键词 */
  searchKeyword?: string;
  /** 资源选择回调 */
  onAssetSelect?: (asset: AssetItem) => void;
}

/** 动画面板组件属性接口 */
export interface AnimationPanelProps {
  /** 动画编辑器状态 */
  animationState: AnimationEditorState;
  /** 对象选择回调 */
  onObjectSelect?: (objectId: string) => void;
}

/** 控制台面板组件属性接口 */
export interface ConsolePanelProps {
  /** 日志数据 */
  logs?: LogEntry[];
  /** 日志级别筛选 */
  logLevel?: 'all' | 'info' | 'warn' | 'error';
  /** 清空日志回调 */
  onClearLogs?: () => void;
} 