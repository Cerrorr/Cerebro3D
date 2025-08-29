import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PostProcessingConfig } from '@/components/projectEditor/rightPanels/types/PostProcessing.types';
import { DEFAULT_POST_PROCESSING_CONFIG } from '@/components/projectEditor/rightPanels/constants/PostProcessing.constants';

interface PostProcessingState {
  config: PostProcessingConfig;
}

const initialState: PostProcessingState = {
  config: DEFAULT_POST_PROCESSING_CONFIG,
};

const postProcessingSlice = createSlice({
  name: 'postProcessing',
  initialState,
  reducers: {
    updatePostProcessingConfig: (state, action: PayloadAction<PostProcessingConfig>) => {
      state.config = action.payload;
    },
    resetPostProcessingConfig: (state) => {
      state.config = DEFAULT_POST_PROCESSING_CONFIG;
    },
  },
});

export const { 
  updatePostProcessingConfig,
  resetPostProcessingConfig
} = postProcessingSlice.actions;

export default postProcessingSlice.reducer;