/**
 * 相机配置相关类型定义
 * @author Cerror
 * @since 2025-06-25
 */

/**
 * 相机类型
 */
export type CameraType = 'perspective' | 'orthographic';

/**
 * 透视相机配置接口
 */
export interface PerspectiveCameraConfig {
  /** 视野角度 (度) */
  fov: number;
  /** 宽高比 */
  aspect: number;
  /** 近裁剪面 */
  near: number;
  /** 远裁剪面 */
  far: number;
}

/**
 * 正交相机配置接口
 */
export interface OrthographicCameraConfig {
  /** 左边界 */
  left: number;
  /** 右边界 */
  right: number;
  /** 上边界 */
  top: number;
  /** 下边界 */
  bottom: number;
  /** 近裁剪面 */
  near: number;
  /** 远裁剪面 */
  far: number;
  /** 缩放系数 */
  zoom: number;
}

/**
 * 相机位置和旋转
 */
export interface CameraTransform {
  /** 位置 */
  position: {
    x: number;
    y: number;
    z: number;
  };
  /** 旋转 (欧拉角，度) */
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  /** 目标点 */
  target: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * 相机配置接口
 */
export interface CameraConfiguration {
  /** 相机类型 */
  type: CameraType;
  /** 透视相机配置 */
  perspective: PerspectiveCameraConfig;
  /** 正交相机配置 */
  orthographic: OrthographicCameraConfig;
  /** 相机变换 */
  transform: CameraTransform;
}

/**
 * 相机配置面板属性接口
 */
export interface CameraConfigPanelProps {
  /** 相机配置 */
  cameraConfig: CameraConfiguration;
  /** 相机配置变更回调 */
  onCameraConfigChange: (config: Partial<CameraConfiguration>) => void;
}

/**
 * 相机预设配置
 */
export interface CameraPreset {
  /** 预设名称 */
  name: string;
  /** 预设描述 */
  description: string;
  /** 相机配置 */
  config: Partial<CameraConfiguration>;
}

 