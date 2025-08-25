/**
 * 相机配置相关常量
 * @author Cerror
 * @since 2025-08-25
 */

import type { 
  CameraConfiguration, 
  CameraPreset,
  PerspectiveCameraConfig,
  OrthographicCameraConfig,
  CameraTransform
} from '../types/CameraConfig.types';

/**
 * 默认透视相机配置
 */
export const DEFAULT_PERSPECTIVE_CONFIG: PerspectiveCameraConfig = {
  fov: 75,
  aspect: 1,
  near: 0.1,
  far: 10000,
};

/**
 * 默认正交相机配置
 */
export const DEFAULT_ORTHOGRAPHIC_CONFIG: OrthographicCameraConfig = {
  left: -10,
  right: 10,
  top: 10,
  bottom: -10,
  near: 0.1,
  far: 10000,
  zoom: 1,
};

/**
 * 默认相机变换配置
 */
export const DEFAULT_CAMERA_TRANSFORM: CameraTransform = {
  position: {
    x: 6,
    y: 4,
    z: 6,
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0,
  },
  target: {
    x: 0,
    y: 0,
    z: 0,
  },
};

/**
 * 默认相机配置
 */
export const DEFAULT_CAMERA_CONFIG: CameraConfiguration = {
  type: 'perspective',
  perspective: DEFAULT_PERSPECTIVE_CONFIG,
  orthographic: DEFAULT_ORTHOGRAPHIC_CONFIG,
  transform: DEFAULT_CAMERA_TRANSFORM,
};

/**
 * 相机预设配置集合
 */
export const CAMERA_PRESETS: CameraPreset[] = [
  {
    name: '默认视角',
    description: '默认的透视相机视角',
    config: {
      type: 'perspective',
      transform: {
        position: { x: 6, y: 4, z: 6 },
        rotation: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 },
      },
    },
  },
  {
    name: '前视图',
    description: '从正前方观察场景',
    config: {
      type: 'orthographic',
      transform: {
        position: { x: 0, y: 0, z: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 },
      },
    },
  },
  {
    name: '顶视图',
    description: '从顶部俯视场景',
    config: {
      type: 'orthographic',
      transform: {
        position: { x: 0, y: 10, z: 0 },
        rotation: { x: -90, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 },
      },
    },
  },
  {
    name: '侧视图',
    description: '从侧面观察场景',
    config: {
      type: 'orthographic',
      transform: {
        position: { x: 10, y: 0, z: 0 },
        rotation: { x: 0, y: 90, z: 0 },
        target: { x: 0, y: 0, z: 0 },
      },
    },
  },
  {
    name: '等轴视图',
    description: '等轴测视角',
    config: {
      type: 'perspective',
      perspective: {
        fov: 50,
        aspect: 1,
        near: 0.1,
        far: 10000,
      },
      transform: {
        position: { x: 5, y: 5, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 },
      },
    },
  },
];

/** 透视相机FOV范围 */
export const PERSPECTIVE_FOV_RANGE = {
  MIN: 10,
  MAX: 160,
  STEP: 1,
  DEFAULT: 75,
};

/** 正交相机缩放范围 */
export const ORTHOGRAPHIC_ZOOM_RANGE = {
  MIN: 0.1,
  MAX: 10,
  STEP: 0.1,
  DEFAULT: 1,
};

/** 裁剪面范围 */
export const CLIPPING_PLANE_RANGE = {
  NEAR_MIN: 0.01,
  NEAR_MAX: 100,
  NEAR_DEFAULT: 0.1,
  FAR_MIN: 1,
  FAR_MAX: 10000,
  FAR_DEFAULT: 10000,
};

/** 相机位置步进值 */
export const CAMERA_POSITION_STEP = 0.1;

/** 相机旋转步进值 (度) */
export const CAMERA_ROTATION_STEP = 1;

/** 相机类型选项 */
export const CAMERA_TYPE_OPTIONS = [
  { value: 'perspective', label: '透视相机', icon: 'EyeOutlined' },
  { value: 'orthographic', label: '正交相机', icon: 'AimOutlined' },
] as const;