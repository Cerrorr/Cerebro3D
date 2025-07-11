/**
 * 渲染器配置面板类型定义
 * @author Cerror
 * @since 2024-01-22
 */

// 抗锯齿配置
export interface RendererAntialiasingConfig {
  enabled: boolean;
}

// 色调映射配置
export interface ToneMappingConfig {
  type: 'No' | 'Linear' | 'Reinhard' | 'Cineon' | 'ACESFilmic';
}

// 帧率限制配置
export interface FrameRateConfig {
  type: '高帧率' | '中帧率' | '低帧率' | '自适应';
}

// 阴影配置
export interface RendererShadowConfig {
  enabled: boolean;
  type: 'Basic' | 'PCF' | 'PCF Soft' | 'VSM';
}

// 全局光影配置
export interface GlobalIlluminationConfig {
  enabled: boolean;
  bounce: boolean;
  shadowDistance: number;
  cascadeSplits: 'practical' | 'uniform' | 'logarithmic';
  shadowMapSize: '1024 * 1024' | '2048 * 2048' | '4096 * 4096';
  lightIntensity: number;
  lightColor: string;
  lightDirectionX: number;
  lightDirectionY: number;
  lightDirectionZ: number;
}

// 完整的渲染器配置
export interface RendererConfig {
  antialiasing: RendererAntialiasingConfig;
  toneMapping: ToneMappingConfig;
  frameRate: FrameRateConfig;
  shadow: RendererShadowConfig;
  globalIllumination: GlobalIlluminationConfig;
}

// 渲染器配置面板Props
export interface RendererConfigPanelProps {
  config: RendererConfig;
  onChange: (config: RendererConfig) => void;
} 