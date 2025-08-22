/**
 * 场景设置组件 - 使用useThreeScene Hook
 * @author Cerror
 * @since 2025-08-22
 */

import React, { useEffect } from 'react';
import { useThreeScene } from '@/hooks/three';

export interface SceneSetupProps {
  backgroundColor: string;
  enableFog: boolean;
  fogNear: number;
  fogFar: number;
  backgroundConfig?: {
    type: 'color' | 'texture' | 'skybox';
    color?: string;
    texture?: string;
    skybox?: string;
  };
  environmentConfig?: {
    type: 'none' | 'equirect' | 'cube';
    map?: string;
    intensity: number;
  };
}

const SceneSetup: React.FC<SceneSetupProps> = ({ 
  backgroundColor, 
  enableFog, 
  fogNear, 
  fogFar, 
  backgroundConfig, 
  environmentConfig 
}) => {
  const {
    setBackgroundColor,
    setBackground,
    setEnvironmentMap,
    enableFog: setFog,
    disableFog,
    enableShadows,
  } = useThreeScene({
    backgroundColor,
    enableShadows: true,
    fog: enableFog
      ? {
          color: '#cccccc',
          near: fogNear,
          far: fogFar,
        }
      : undefined,
  });

  useEffect(() => {
    // 应用背景配置
    if (backgroundConfig) {
      switch (backgroundConfig.type) {
        case 'color':
          if (backgroundConfig.color) {
            setBackground('color', backgroundConfig.color);
          } else {
            setBackgroundColor(backgroundColor);
          }
          break;
        case 'texture':
          if (backgroundConfig.texture) {
            setBackground('texture', backgroundConfig.texture);
          } else {
            setBackgroundColor(backgroundColor);
          }
          break;
        case 'skybox':
          if (backgroundConfig.skybox) {
            setBackground('skybox', backgroundConfig.skybox);
          } else {
            setBackgroundColor(backgroundColor);
          }
          break;
        default:
          setBackgroundColor(backgroundColor);
      }
    } else {
      setBackgroundColor(backgroundColor);
    }

    // 应用环境配置
    if (environmentConfig) {
      setEnvironmentMap(
        environmentConfig.type,
        environmentConfig.map,
        environmentConfig.intensity
      );
    }
    
    enableShadows();

    if (enableFog) {
      setFog('#cccccc', fogNear, fogFar);
    } else {
      disableFog();
    }
  }, [
    backgroundColor,
    backgroundConfig,
    environmentConfig,
    enableFog,
    fogNear,
    fogFar,
    setBackgroundColor,
    setBackground,
    setEnvironmentMap,
    setFog,
    disableFog,
    enableShadows,
  ]);

  return null;
};

export default SceneSetup;