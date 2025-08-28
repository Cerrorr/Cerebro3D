/**
 * 灯光配置Redux slice
 * @author Cerror
 * @since 2025-08-26
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  LightingConfig,
  AmbientLightConfig,
  DirectionalLightConfig,
  HemisphereLightConfig,
  PointLightConfig,
  SpotLightConfig,
  Vector3,
} from '@/components/projectEditor/rightPanels/types/LightingConfig.types';
import { DEFAULT_LIGHTING_CONFIG } from '@/components/projectEditor/rightPanels/constants/LightingConfig.constants';

interface LightingState {
  config: LightingConfig;
  activePreset: string | null;
}

const initialState: LightingState = {
  config: DEFAULT_LIGHTING_CONFIG,
  activePreset: '标准照明',
};

const lightingSlice = createSlice({
  name: 'lighting',
  initialState,
  reducers: {
    // 环境光配置 - 优化为直接修改状态
    setAmbientLight: (
      state,
      action: PayloadAction<Partial<AmbientLightConfig>>
    ) => {
      Object.assign(state.config.ambient, action.payload);
      state.activePreset = null;
    },

    // 平行光配置
    setDirectionalLight: (
      state,
      action: PayloadAction<Partial<DirectionalLightConfig>>
    ) => {
      Object.assign(state.config.directional, action.payload);
      state.activePreset = null;
    },

    setDirectionalLightPosition: (
      state,
      action: PayloadAction<Partial<Vector3>>
    ) => {
      Object.assign(state.config.directional.position, action.payload);
      state.activePreset = null;
    },

    // 半球光配置
    setHemisphereLight: (
      state,
      action: PayloadAction<Partial<HemisphereLightConfig>>
    ) => {
      Object.assign(state.config.hemisphere, action.payload);
      state.activePreset = null;
    },

    // 点光源配置
    setPointLight: (
      state,
      action: PayloadAction<Partial<PointLightConfig>>
    ) => {
      Object.assign(state.config.point, action.payload);
      state.activePreset = null;
    },

    setPointLightPosition: (state, action: PayloadAction<Partial<Vector3>>) => {
      Object.assign(state.config.point.position, action.payload);
      state.activePreset = null;
    },

    // 聚光灯配置
    setSpotLight: (state, action: PayloadAction<Partial<SpotLightConfig>>) => {
      Object.assign(state.config.spot, action.payload);
      state.activePreset = null;
    },

    setSpotLightPosition: (state, action: PayloadAction<Partial<Vector3>>) => {
      Object.assign(state.config.spot.position, action.payload);
      state.activePreset = null;
    },

    setSpotLightTarget: (state, action: PayloadAction<Partial<Vector3>>) => {
      Object.assign(state.config.spot.target, action.payload);
      state.activePreset = null;
    },

    // 启用/禁用灯光 - 仅更新enabled字段
    toggleLight: (state, action: PayloadAction<keyof LightingConfig>) => {
      const lightType = action.payload;
      state.config[lightType].enabled = !state.config[lightType].enabled;
      state.activePreset = null;
    },

    // 更新整体配置
    updateLightingConfig: (
      state,
      action: PayloadAction<Partial<LightingConfig>>
    ) => {
      Object.assign(state.config, action.payload);
      state.activePreset = null;
    },

    // 重置到默认配置
    resetToDefaults: state => {
      state.config = DEFAULT_LIGHTING_CONFIG;
      state.activePreset = '标准照明';
    },

    // 应用预设
    applyPreset: (
      state,
      action: PayloadAction<{ name: string; config: Partial<LightingConfig> }>
    ) => {
      const { name, config } = action.payload;
      Object.assign(state.config, config);
      state.activePreset = name;
    },
  },
});

export const {
  setAmbientLight,
  setDirectionalLight,
  setDirectionalLightPosition,
  setHemisphereLight,
  setPointLight,
  setPointLightPosition,
  setSpotLight,
  setSpotLightPosition,
  setSpotLightTarget,
  toggleLight,
  updateLightingConfig,
  resetToDefaults,
  applyPreset,
} = lightingSlice.actions;

export default lightingSlice.reducer;
