/**
 * 后期处理配置面板类型定义
 * @author Cerror
 * @since 2024-01-22
 */

// 抗锯齿效果配置
export interface AntialiasingConfig {
  enabled: boolean;
}

// 描边线效果配置
export interface OutlineConfig {
  enabled: boolean;
  edgeStrength: number;
  edgeGlow: number;
  edgeThickness: number;
  visibleEdgeColor: string;
  hiddenEdgeColor: string;
}

// 辉光效果配置
export interface BloomConfig {
  enabled: boolean;
  radius: number;
  threshold: number;
  strength: number;
}

// LUT颜色滤镜配置
export interface LUTConfig {
  enabled: boolean;
  lutType: string;
  intensity: number;
}

// 运动残影配置
export interface MotionBlurConfig {
  enabled: boolean;
  decay: number;
}

// 变焦效果配置
export interface ZoomConfig {
  enabled: boolean;
  focus: number;
  aperture: number;
  maxBlur: number;
}

// 像素风效果配置
export interface PixelConfig {
  enabled: boolean;
  pixelSize: number;
  normalEdgeStrength: number;
  depthEdgeStrength: number;
}

// 半色调效果配置
export interface HalftoneConfig {
  enabled: boolean;
  shape: 'dot' | 'line' | 'cross' | 'ring';
  radius: number;
  rotateR: number;
  rotateG: number;
  rotateB: number;
  scatter: number;
  blending: number;
  blendingMode: 'linear' | 'multiply' | 'add' | 'lighter' | 'darker';
  greyscale: boolean;
}

// 完整的后期处理配置
export interface PostProcessingConfig {
  antialiasing: AntialiasingConfig;
  outline: OutlineConfig;
  bloom: BloomConfig;
  lut: LUTConfig;
  motionBlur: MotionBlurConfig;
  zoom: ZoomConfig;
  pixel: PixelConfig;
  halftone: HalftoneConfig;
}

// 默认后期处理配置
export const DEFAULT_POST_PROCESSING_CONFIG: PostProcessingConfig = {
  antialiasing: {
    enabled: false,
  },
  outline: {
    enabled: false,
    edgeStrength: 1.0,
    edgeGlow: 0.0,
    edgeThickness: 1.0,
    visibleEdgeColor: '#ffee00',
    hiddenEdgeColor: '#ff6a00',
  },
  bloom: {
    enabled: false,
    radius: 0.4,
    threshold: 0.85,
    strength: 1.0,
  },
  lut: {
    enabled: false,
    lutType: 'Bourbon 64.CUBE',
    intensity: 1.0,
  },
  motionBlur: {
    enabled: false,
    decay: 0.9,
  },
  zoom: {
    enabled: false,
    focus: 1.0,
    aperture: 0.025,
    maxBlur: 0.01,
  },
  pixel: {
    enabled: false,
    pixelSize: 6.0,
    normalEdgeStrength: 0.3,
    depthEdgeStrength: 0.4,
  },
  halftone: {
    enabled: false,
    shape: 'dot',
    radius: 4.0,
    rotateR: 15.0,
    rotateG: 45.0,
    rotateB: 0.0,
    scatter: 0.0,
    blending: 1.0,
    blendingMode: 'linear',
    greyscale: false,
  },
};

// 后期处理面板Props
export interface PostProcessingPanelProps {
  config: PostProcessingConfig;
  onChange: (config: PostProcessingConfig) => void;
} 