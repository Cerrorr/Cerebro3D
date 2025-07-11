/**
 * index工具模块
 * @author Cerror
 * @since 2025-07-08
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import historyReducer from './slices/historySlice';
import sceneReducer from './slices/sceneSlice';

export const store = configureStore({
  reducer: {
    history: historyReducer,
    scene: sceneReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.importedObject', 'payload.node.importedObject'],
        // Ignore these paths in the state
        ignoredPaths: ['scene.nodes'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 