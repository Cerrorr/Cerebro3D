/**
 * useTransformControls Hook 类型定义
 * @author Cerror
 * @since 2025-08-22
 */

import { Object3D } from 'three';

export interface UseTransformControlsProps {
  selectedObjects: Object3D[];
  helpersEnabled: boolean;
}

export interface UseTransformControlsReturn {
  transformMode: 'translate' | 'rotate' | 'scale';
  setTransformMode: React.Dispatch<React.SetStateAction<'translate' | 'rotate' | 'scale'>>;
  isEnabled: boolean;
}