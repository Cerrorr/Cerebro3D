/**
 * NativeOutlineEffect 组件类型定义
 * @author Cerror
 * @since 2025-08-20
 */

import { Object3D } from 'three';

export interface NativeOutlineEffectProps {
  selectedObjects?: Object3D[];
  edgeColor?: number;
  edgeStrength?: number;
  edgeThickness?: number;
  pulsePeriod?: number;
}