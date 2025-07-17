/**
 * @author Cerror
 * @createTime 2025-07-15
 * @description useObjectControl Hook 类型定义
 */

import React from 'react';
import { Vector3, Euler, Mesh, Group } from 'three';

export interface UseObjectControlOptions {
  autoRotate?: boolean;
  rotationSpeed?: number;
  rotationAxis?: 'x' | 'y' | 'z';
  enableHover?: boolean;
  hoverScale?: number;
}

export interface UseObjectControlResult {
  meshRef: React.RefObject<Mesh>;
  groupRef: React.RefObject<Group>;
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  isHovered: boolean;
  isRotating: boolean;
  setPosition: (position: Vector3) => void;
  setRotation: (rotation: Euler) => void;
  setScale: (scale: Vector3) => void;
  startRotation: () => void;
  stopRotation: () => void;
  toggleRotation: () => void;
  animateToPosition: (targetPosition: Vector3, duration?: number) => void;
  animateToScale: (targetScale: Vector3, duration?: number) => void;
  hoverHandlers: {
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  };
}