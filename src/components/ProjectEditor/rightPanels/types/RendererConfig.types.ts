/**
 * 渲染器配置面板类型定义
 * @author Cerror
 * @since 2024-01-22
 */

/**
 * 抗锯齿配置
 */
export interface RendererAntialiasingConfig {
  // 是否启用
  enabled: boolean;
}

/**
 * 色调映射配置
 */
export interface ToneMappingConfig {
  // 映射类型
  type: 'No' | 'Linear' | 'Reinhard' | 'Cineon' | 'ACESFilmic';
}

/**
 * 帧率限制配置
 */
export interface FrameRateConfig {
  // 帧率类型
  type: '高帧率' | '中帧率' | '低帧率' | '自适应';
}

/**
 * 阴影配置
 */
export interface RendererShadowConfig {
  // 是否启用
  enabled: boolean;
  // 阴影类型
  type: 'Basic' | 'PCF' | 'PCF Soft' | 'VSM';
}

/**
 * 全局光影配置
 */
export interface GlobalIlluminationConfig {
  // 是否启用
  enabled: boolean;
  // 是否反弹
  bounce: boolean;
  // 阴影距离
  shadowDistance: number;
  // 级联分割
  cascadeSplits: 'practical' | 'uniform' | 'logarithmic';
  // 阴影贴图尺寸
  shadowMapSize: '1024 * 1024' | '2048 * 2048' | '4096 * 4096';
  // 光强度
  lightIntensity: number;
  // 光颜色
  lightColor: string;
  // 光方向X
  lightDirectionX: number;
  // 光方向Y
  lightDirectionY: number;
  // 光方向Z
  lightDirectionZ: number;
}

/**
 * 完整的渲染器配置
 */
export interface RendererConfig {
  // 抗锯齿配置
  antialiasing: RendererAntialiasingConfig;
  // 色调映射配置
  toneMapping: ToneMappingConfig;
  // 帧率配置
  frameRate: FrameRateConfig;
  // 阴影配置
  shadow: RendererShadowConfig;
  // 全局光影配置
  globalIllumination: GlobalIlluminationConfig;
}

/**
 * 渲染器配置面板Props
 */
export interface RendererConfigPanelProps {
  // 渲染器配置
  config: RendererConfig;
  // 配置变更回调
  onChange: (config: RendererConfig) => void;
} 