/**
 * 后期处理配置面板类型定义
 * @author Cerror
 * @since 2024-01-22
 */

/**
 * 抗锯齿效果配置
 */
export interface AntialiasingConfig {
  // 是否启用
  enabled: boolean;
}

/**
 * 描边线效果配置
 */
export interface OutlineConfig {
  // 是否启用
  enabled: boolean;
  // 边缘强度
  edgeStrength: number;
  // 边缘发光
  edgeGlow: number;
  // 边缘厚度
  edgeThickness: number;
  // 可见边缘颜色
  visibleEdgeColor: string;
  // 隐藏边缘颜色
  hiddenEdgeColor: string;
}

/**
 * 辉光效果配置
 */
export interface BloomConfig {
  // 是否启用
  enabled: boolean;
  // 辉光半径
  radius: number;
  // 辉光阈值
  threshold: number;
  // 辉光强度
  strength: number;
}

/**
 * LUT颜色滤镜配置
 */
export interface LUTConfig {
  // 是否启用
  enabled: boolean;
  // LUT类型
  lutType: string;
  // 效果强度
  intensity: number;
}

/**
 * 运动残影配置
 */
export interface MotionBlurConfig {
  // 是否启用
  enabled: boolean;
  // 残影衰减
  decay: number;
}

/**
 * 变焦效果配置
 */
export interface ZoomConfig {
  // 是否启用
  enabled: boolean;
  // 焦点距离
  focus: number;
  // 光圈大小
  aperture: number;
  // 最大模糊
  maxBlur: number;
}

/**
 * 像素风效果配置
 */
export interface PixelConfig {
  // 是否启用
  enabled: boolean;
  // 像素大小
  pixelSize: number;
  // 法线边缘强度
  normalEdgeStrength: number;
  // 深度边缘强度
  depthEdgeStrength: number;
}

/**
 * 半色调效果配置
 */
export interface HalftoneConfig {
  // 是否启用
  enabled: boolean;
  // 形状类型
  shape: 'dot' | 'line' | 'cross' | 'ring';
  // 半径大小
  radius: number;
  // 红色旋转
  rotateR: number;
  // 绿色旋转
  rotateG: number;
  // 蓝色旋转
  rotateB: number;
  // 散射程度
  scatter: number;
  // 混合强度
  blending: number;
  // 混合模式
  blendingMode: 'linear' | 'multiply' | 'add' | 'lighter' | 'darker';
  // 是否灰度
  greyscale: boolean;
}

/**
 * 完整的后期处理配置
 */
export interface PostProcessingConfig {
  // 抗锯齿配置
  antialiasing: AntialiasingConfig;
  // 描边线配置
  outline: OutlineConfig;
  // 辉光配置
  bloom: BloomConfig;
  // LUT配置
  lut: LUTConfig;
  // 运动残影配置
  motionBlur: MotionBlurConfig;
  // 变焦配置
  zoom: ZoomConfig;
  // 像素风配置
  pixel: PixelConfig;
  // 半色调配置
  halftone: HalftoneConfig;
}

/**
 * 后期处理面板Props
 */
export interface PostProcessingPanelProps {
  // 后期处理配置
  config: PostProcessingConfig;
  // 配置变更回调
  onChange: (config: PostProcessingConfig) => void;
} 