/**
 * useEnvironment Hook 类型定义
 * @author Cerror
 * @since 2025-07-11
 */

/**
 * useEnvironment Hook 返回值类型
 */
export interface UseEnvironmentResult {
  // 灯光元素数组
  lightElements: JSX.Element[];
  // 网格元素
  gridElement: JSX.Element | null;
  // 坐标轴元素
  axisElement: JSX.Element | null;
  // 更新灯光强度
  updateLightIntensity: (lightType: 'ambient' | 'directional', intensity: number) => void;
}

/**
 * 灯光配置内部类型
 */
export interface LightConfig {
  // 环境光强度
  ambientIntensity: number;
  // 平行光强度
  directionalIntensity: number;
  // 平行光位置
  directionalPosition: [number, number, number];
}