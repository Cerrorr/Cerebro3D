/**
 * 相机配置Redux slice
 * @author Cerror
 * @since 2025-08-26
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  CameraConfiguration, 
  CameraType, 
  PerspectiveCameraConfig,
  OrthographicCameraConfig,
  CameraTransform
} from '@/components/projectEditor/rightPanels/types/CameraConfig.types';
import { 
  DEFAULT_CAMERA_CONFIG,
  DEFAULT_CAMERA_TRANSFORM,
  CAMERA_PRESETS
} from '@/components/projectEditor/rightPanels/constants/CameraConfig.constants';
import type { CameraState } from '@/store/types/cameraSlice.types';


const initialState: CameraState = {
  config: DEFAULT_CAMERA_CONFIG,
  activePreset: '默认视角',
  isDirty: false,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setCameraType: (state, action: PayloadAction<CameraType>) => {
      state.config.type = action.payload;
      state.isDirty = true;
      state.activePreset = null;
    },
    
    setPerspectiveConfig: (state, action: PayloadAction<Partial<PerspectiveCameraConfig>>) => {
      state.config.perspective = {
        ...state.config.perspective,
        ...action.payload,
      };
      state.isDirty = true;
      state.activePreset = null;
    },
    
    setOrthographicConfig: (state, action: PayloadAction<Partial<OrthographicCameraConfig>>) => {
      state.config.orthographic = {
        ...state.config.orthographic,
        ...action.payload,
      };
      state.isDirty = true;
      state.activePreset = null;
    },
    
    
    setCameraTransform: (state, action: PayloadAction<Partial<CameraTransform>>) => {
      state.config.transform = {
        ...state.config.transform,
        ...action.payload,
      };
      state.isDirty = true;
      state.activePreset = null;
    },
    
    setCameraPosition: (state, action: PayloadAction<{ x?: number; y?: number; z?: number }>) => {
      state.config.transform.position = {
        ...state.config.transform.position,
        ...action.payload,
      };
      state.isDirty = true;
      state.activePreset = null;
    },
    
    setCameraRotation: (state, action: PayloadAction<{ x?: number; y?: number; z?: number }>) => {
      state.config.transform.rotation = {
        ...state.config.transform.rotation,
        ...action.payload,
      };
      state.isDirty = true;
      state.activePreset = null;
    },
    
    setCameraTarget: (state, action: PayloadAction<{ x?: number; y?: number; z?: number }>) => {
      state.config.transform.target = {
        ...state.config.transform.target,
        ...action.payload,
      };
      state.isDirty = true;
      state.activePreset = null;
    },
    
    updateCameraConfig: (state, action: PayloadAction<Partial<CameraConfiguration>>) => {
      if (action.payload.type !== undefined) {
        state.config.type = action.payload.type;
      }
      if (action.payload.perspective) {
        state.config.perspective = {
          ...state.config.perspective,
          ...action.payload.perspective,
        };
      }
      if (action.payload.orthographic) {
        state.config.orthographic = {
          ...state.config.orthographic,
          ...action.payload.orthographic,
        };
      }
      if (action.payload.transform) {
        state.config.transform = {
          ...state.config.transform,
          ...action.payload.transform,
        };
      }
      state.isDirty = true;
      state.activePreset = null;
    },
    
    applyPreset: (state, action: PayloadAction<string>) => {
      const preset = CAMERA_PRESETS.find(p => p.name === action.payload);
      if (preset) {
        if (preset.config.type) {
          state.config.type = preset.config.type;
        }
        if (preset.config.perspective) {
          state.config.perspective = {
            ...state.config.perspective,
            ...preset.config.perspective,
          };
        }
        if (preset.config.orthographic) {
          state.config.orthographic = {
            ...state.config.orthographic,
            ...preset.config.orthographic,
          };
        }
        if (preset.config.transform) {
          state.config.transform = preset.config.transform;
        }
        state.activePreset = action.payload;
        state.isDirty = false;
      }
    },
    
    resetCamera: (state) => {
      state.config.transform = DEFAULT_CAMERA_TRANSFORM;
      state.isDirty = true;
      state.activePreset = null;
    },
    
    resetToDefaults: (state) => {
      state.config = DEFAULT_CAMERA_CONFIG;
      state.activePreset = '默认视角';
      state.isDirty = false;
    },
    
    focusOrigin: (state) => {
      state.config.transform.target = { x: 0, y: 0, z: 0 };
      state.isDirty = true;
      state.activePreset = null;
    },
    
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
  },
});

export const {
  setCameraType,
  setPerspectiveConfig,
  setOrthographicConfig,
  setCameraTransform,
  setCameraPosition,
  setCameraRotation,
  setCameraTarget,
  updateCameraConfig,
  applyPreset,
  resetCamera,
  resetToDefaults,
  focusOrigin,
  setIsDirty,
} = cameraSlice.actions;

export default cameraSlice.reducer;