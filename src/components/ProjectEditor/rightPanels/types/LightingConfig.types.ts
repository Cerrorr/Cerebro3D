/**
 * 灯光配置面板相关类型定义
 * @author Cerror
 * @since 2024-01-22
 */

/**
 * 光源类型
 */
export type LightType = 'ambient' | 'directional' | 'hemisphere' | 'point' | 'spot';

/**
 * 3D坐标
 */
export interface Vector3 {
  // X坐标
  x: number;
  // Y坐标
  y: number;
  // Z坐标
  z: number;
}

/**
 * 环境光配置
 */
export interface AmbientLightConfig {
  // 是否启用
  enabled: boolean;
  // 强度 (0-2)
  intensity: number;
  // 颜色
  color: string;
}

/**
 * 平行光配置
 */
export interface DirectionalLightConfig {
  // 是否启用
  enabled: boolean;
  // 强度 (0-2)
  intensity: number;
  // 颜色
  color: string;
  // 位置
  position: Vector3;
  // 是否投射阴影
  castShadow: boolean;
  // 阴影贴图尺寸
  shadowMapSize: number;
}

/**
 * 半球光配置
 */
export interface HemisphereLightConfig {
  // 是否启用
  enabled: boolean;
  // 天空颜色
  skyColor: string;
  // 地面颜色
  groundColor: string;
  // 强度 (0-2)
  intensity: number;
  // 位置
  position: Vector3;
}

/**
 * 点光源配置
 */
export interface PointLightConfig {
  // 是否启用
  enabled: boolean;
  // 颜色
  color: string;
  // 强度 (0-2)
  intensity: number;
  // 距离 (0-100)
  distance: number;
  // 衰减 (0-2)
  decay: number;
  // 位置
  position: Vector3;
  // 是否投射阴影
  castShadow: boolean;
  // 阴影贴图尺寸
  shadowMapSize: number;
}

/**
 * 聚光灯配置
 */
export interface SpotLightConfig {
  // 是否启用
  enabled: boolean;
  // 颜色
  color: string;
  // 强度 (0-2)
  intensity: number;
  // 距离 (0-100)
  distance: number;
  // 角度 (0-Math.PI/2)
  angle: number;
  // 半影 (0-1)
  penumbra: number;
  // 衰减 (0-2)
  decay: number;
  // 位置
  position: Vector3;
  // 目标点
  target: Vector3;
  // 是否投射阴影
  castShadow: boolean;
  // 阴影贴图尺寸
  shadowMapSize: number;
}

/**
 * 灯光配置
 */
export interface LightingConfig {
  // 环境光配置
  ambient: AmbientLightConfig;
  // 平行光配置
  directional: DirectionalLightConfig;
  // 半球光配置
  hemisphere: HemisphereLightConfig;
  // 点光源配置
  point: PointLightConfig;
  // 聚光灯配置
  spot: SpotLightConfig;
}

/**
 * 灯光配置面板Props
 */
export interface LightingConfigPanelProps {
  // 灯光配置
  lightingConfig: LightingConfig;
  // 灯光配置变更回调
  onLightingConfigChange: (config: Partial<LightingConfig>) => void;
} 