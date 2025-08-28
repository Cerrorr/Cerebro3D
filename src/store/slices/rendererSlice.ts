/**
 * 渲染器配置Redux slice
 * @author Cerror
 * @since 2025-08-28
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  RendererConfig,
  RendererAntialiasingConfig,
  ToneMappingConfig,
  FrameRateConfig,
  RendererShadowConfig,
  GlobalIlluminationConfig,
} from '@/components/projectEditor/rightPanels/types/RendererConfig.types';
import { DEFAULT_RENDERER_CONFIG } from '@/components/projectEditor/rightPanels/constants/RendererConfig.constants';

interface RendererState {
  config: RendererConfig;
  activePreset: string | null;
}

const initialState: RendererState = {
  config: DEFAULT_RENDERER_CONFIG,
  activePreset: '标准渲染',
};

const rendererSlice = createSlice({
  name: 'renderer',
  initialState,
  reducers: {
    // 抗锯齿配置
    setAntialiasingConfig: (
      state,
      action: PayloadAction<Partial<RendererAntialiasingConfig>>
    ) => {
      Object.assign(state.config.antialiasing, action.payload);
      state.activePreset = null;
    },

    // 色调映射配置
    setToneMappingConfig: (
      state,
      action: PayloadAction<Partial<ToneMappingConfig>>
    ) => {
      Object.assign(state.config.toneMapping, action.payload);
      state.activePreset = null;
    },

    // 帧率配置
    setFrameRateConfig: (
      state,
      action: PayloadAction<Partial<FrameRateConfig>>
    ) => {
      Object.assign(state.config.frameRate, action.payload);
      state.activePreset = null;
    },

    // 阴影配置
    setShadowConfig: (
      state,
      action: PayloadAction<Partial<RendererShadowConfig>>
    ) => {
      Object.assign(state.config.shadow, action.payload);
      state.activePreset = null;
    },

    // 全局光影配置
    setGlobalIlluminationConfig: (
      state,
      action: PayloadAction<Partial<GlobalIlluminationConfig>>
    ) => {
      Object.assign(state.config.globalIllumination, action.payload);
      state.activePreset = null;
    },

    // 更新整体渲染器配置
    updateRendererConfig: (
      state,
      action: PayloadAction<Partial<RendererConfig>>
    ) => {
      Object.assign(state.config, action.payload);
      state.activePreset = null;
    },

    // 重置到默认配置
    resetRendererToDefaults: (state) => {
      state.config = DEFAULT_RENDERER_CONFIG;
      state.activePreset = '标准渲染';
    },

    // 应用预设
    applyRendererPreset: (
      state,
      action: PayloadAction<{ name: string; config: Partial<RendererConfig> }>
    ) => {
      const { name, config } = action.payload;
      Object.assign(state.config, config);
      state.activePreset = name;
    },
  },
});

export const {
  setAntialiasingConfig,
  setToneMappingConfig,
  setFrameRateConfig,
  setShadowConfig,
  setGlobalIlluminationConfig,
  updateRendererConfig,
  resetRendererToDefaults,
  applyRendererPreset,
} = rendererSlice.actions;

export default rendererSlice.reducer;