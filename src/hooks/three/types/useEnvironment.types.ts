/**
 * useEnvironment Hook 类型定义
 * @author Cerror
 * @since 2025-07-11
 */

/**
 * useEnvironment Hook 返回值类型
 */
export interface UseEnvironmentResult {
  lightElements: JSX.Element[];
  gridElement: JSX.Element | null;
  axisElement: JSX.Element | null;
  updateLightIntensity: (lightType: 'ambient' | 'directional', intensity: number) => void;
}

/**
 * 灯光配置内部类型
 */
export interface LightConfig {
  ambientIntensity: number;
  directionalIntensity: number;
  directionalPosition: [number, number, number];
}