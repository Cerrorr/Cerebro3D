/**
 * 雾效果配置接口
 */
export interface FogConfig {
  // 是否启用雾效果
  enabled: boolean;
  // 雾类型：Linear(线性) 或 Exponential(指数)
  type: 'Linear' | 'Exponential';
  // 雾颜色
  color: string;
  // 近点距离
  near: number;
  // 远点距离
  far: number;
}

/**
 * 雨效果配置接口
 */
export interface RainConfig {
  // 是否启用雨效果
  enabled: boolean;
  // 雨的速度
  speed: number;
  // 雨滴颜色
  color: string;
  // 雨滴大小
  size: number;
  // 雨的弧度/角度
  arc: number;
  // 雨的透明度
  opacity: number;
}

/**
 * 雪效果配置接口
 */
export interface SnowConfig {
  // 是否启用雪效果
  enabled: boolean;
  // 雪花下落速度
  speed: number;
  // 雪花密度
  density: number;
  // 雪花大小
  size: number;
  // 雪花透明度
  opacity: number;
}

/**
 * 完整天气配置接口
 */
export interface WeatherConfig {
  // 雾效果配置
  fog: FogConfig;
  // 雨效果配置
  rain: RainConfig;
  // 雪效果配置
  snow: SnowConfig;
}

/**
 * 天气配置面板组件属性接口
 */
export interface WeatherConfigPanelProps {
  // 天气配置
  config: WeatherConfig;
  // 配置变更回调函数
  onChange: (config: WeatherConfig) => void;
}
 