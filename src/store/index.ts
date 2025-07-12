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
        // 在所有操作中忽略这些字段路径
        ignoredActionsPaths: ['payload.importedObject', 'payload.node.importedObject'],
        // 在状态中忽略这些路径
        ignoredPaths: ['scene.nodes'],
      },
    }),
});

/** Redux store的根状态类型 */
export type RootState = ReturnType<typeof store.getState>;

/** Redux store的dispatch类型 */
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 