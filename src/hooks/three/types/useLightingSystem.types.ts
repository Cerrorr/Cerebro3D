/**
 * @author Claude
 * @createTime 2025-07-15
 * @description useLightingSystem Hook 类型定义
 */

import { Vector3, AmbientLight, DirectionalLight } from 'three';

export interface UseLightingSystemOptions {
  enableAmbientLight?: boolean;
  ambientIntensity?: number;
  ambientColor?: string;
  enableDirectionalLight?: boolean;
  directionalIntensity?: number;
  directionalPosition?: Vector3;
  enableShadows?: boolean;
}

export interface UseLightingSystemResult {
  ambientLight: AmbientLight | null;
  directionalLight: DirectionalLight | null;
  addAmbientLight: (intensity?: number, color?: string) => AmbientLight;
  removeAmbientLight: () => void;
  addDirectionalLight: (position?: Vector3, intensity?: number) => DirectionalLight;
  removeDirectionalLight: () => void;
  updateAmbientIntensity: (intensity: number) => void;
  updateDirectionalIntensity: (intensity: number) => void;
  updateDirectionalPosition: (position: Vector3) => void;
}