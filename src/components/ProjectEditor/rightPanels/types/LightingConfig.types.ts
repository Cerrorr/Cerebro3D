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
  x: number;
  y: number;
  z: number;
}

/**
 * 环境光配置
 */
export interface AmbientLightConfig {
  enabled: boolean;     // 是否启用
  intensity: number;    // 强度 (0-2)
  color: string;        // 颜色
}

/**
 * 平行光配置
 */
export interface DirectionalLightConfig {
  enabled: boolean;     // 是否启用
  intensity: number;    // 强度 (0-2)
  color: string;        // 颜色
  position: Vector3;    // 位置
  castShadow: boolean;  // 是否投射阴影
  shadowMapSize: number; // 阴影贴图尺寸
}

/**
 * 半球光配置
 */
export interface HemisphereLightConfig {
  enabled: boolean;     // 是否启用
  skyColor: string;     // 天空颜色
  groundColor: string;  // 地面颜色
  intensity: number;    // 强度 (0-2)
  position: Vector3;    // 位置
}

/**
 * 点光源配置
 */
export interface PointLightConfig {
  enabled: boolean;     // 是否启用
  color: string;        // 颜色
  intensity: number;    // 强度 (0-2)
  distance: number;     // 距离 (0-100)
  decay: number;        // 衰减 (0-2)
  position: Vector3;    // 位置
  castShadow: boolean;  // 是否投射阴影
  shadowMapSize: number; // 阴影贴图尺寸
}

/**
 * 聚光灯配置
 */
export interface SpotLightConfig {
  enabled: boolean;     // 是否启用
  color: string;        // 颜色
  intensity: number;    // 强度 (0-2)
  distance: number;     // 距离 (0-100)
  angle: number;        // 角度 (0-Math.PI/2)
  penumbra: number;     // 半影 (0-1)
  decay: number;        // 衰减 (0-2)
  position: Vector3;    // 位置
  target: Vector3;      // 目标点
  castShadow: boolean;  // 是否投射阴影
  shadowMapSize: number; // 阴影贴图尺寸
}

/**
 * 灯光配置
 */
export interface LightingConfig {
  ambient: AmbientLightConfig;
  directional: DirectionalLightConfig;
  hemisphere: HemisphereLightConfig;
  point: PointLightConfig;
  spot: SpotLightConfig;
}

/**
 * 灯光配置面板Props
 */
export interface LightingConfigPanelProps {
  lightingConfig: LightingConfig;
  onLightingConfigChange: (config: Partial<LightingConfig>) => void;
} 