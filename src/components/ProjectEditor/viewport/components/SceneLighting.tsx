/**
 * 光照设置组件 - 使用Redux配置
 * @author Cerror
 * @since 2025-08-22
 */

import React, { memo, useMemo } from 'react';
import { useAppSelector } from '@/store';

export interface SceneLightingProps {
  sceneNodes?: any[];
}

const SceneLighting: React.FC<SceneLightingProps> = memo(() => {
  const lightingConfig = useAppSelector(state => state.lighting.config);
  
  // 使用 useMemo 缓存灯光组件，避免不必要的重新创建
  const ambientLightElement = useMemo(() => {
    if (!lightingConfig.ambient.enabled) return null;
    return (
      <ambientLight
        key="ambient"
        color={lightingConfig.ambient.color}
        intensity={lightingConfig.ambient.intensity}
      />
    );
  }, [lightingConfig.ambient.enabled, lightingConfig.ambient.color, lightingConfig.ambient.intensity]);

  const directionalLightElement = useMemo(() => {
    if (!lightingConfig.directional.enabled) return null;
    return (
      <directionalLight
        key="directional"
        color={lightingConfig.directional.color}
        intensity={lightingConfig.directional.intensity}
        position={[
          lightingConfig.directional.position.x,
          lightingConfig.directional.position.y,
          lightingConfig.directional.position.z
        ]}
        castShadow={lightingConfig.directional.castShadow}
        shadow-mapSize={[lightingConfig.directional.shadowMapSize, lightingConfig.directional.shadowMapSize]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    );
  }, [
    lightingConfig.directional.enabled,
    lightingConfig.directional.color,
    lightingConfig.directional.intensity,
    lightingConfig.directional.position.x,
    lightingConfig.directional.position.y,
    lightingConfig.directional.position.z,
    lightingConfig.directional.castShadow,
    lightingConfig.directional.shadowMapSize
  ]);

  const hemisphereLightElement = useMemo(() => {
    if (!lightingConfig.hemisphere.enabled) return null;
    return (
      <hemisphereLight
        key="hemisphere"
        color={lightingConfig.hemisphere.skyColor}
        groundColor={lightingConfig.hemisphere.groundColor}
        intensity={lightingConfig.hemisphere.intensity}
        position={[
          lightingConfig.hemisphere.position.x,
          lightingConfig.hemisphere.position.y,
          lightingConfig.hemisphere.position.z
        ]}
      />
    );
  }, [
    lightingConfig.hemisphere.enabled,
    lightingConfig.hemisphere.skyColor,
    lightingConfig.hemisphere.groundColor,
    lightingConfig.hemisphere.intensity,
    lightingConfig.hemisphere.position.x,
    lightingConfig.hemisphere.position.y,
    lightingConfig.hemisphere.position.z
  ]);

  const pointLightElement = useMemo(() => {
    if (!lightingConfig.point.enabled) return null;
    return (
      <pointLight
        key="point"
        color={lightingConfig.point.color}
        intensity={lightingConfig.point.intensity}
        position={[
          lightingConfig.point.position.x,
          lightingConfig.point.position.y,
          lightingConfig.point.position.z
        ]}
        distance={lightingConfig.point.distance}
        decay={lightingConfig.point.decay}
        castShadow={lightingConfig.point.castShadow}
        shadow-mapSize={[lightingConfig.point.shadowMapSize, lightingConfig.point.shadowMapSize]}
      />
    );
  }, [
    lightingConfig.point.enabled,
    lightingConfig.point.color,
    lightingConfig.point.intensity,
    lightingConfig.point.position.x,
    lightingConfig.point.position.y,
    lightingConfig.point.position.z,
    lightingConfig.point.distance,
    lightingConfig.point.decay,
    lightingConfig.point.castShadow,
    lightingConfig.point.shadowMapSize
  ]);

  const spotLightElement = useMemo(() => {
    if (!lightingConfig.spot.enabled) return null;
    return (
      <spotLight
        key="spot"
        color={lightingConfig.spot.color}
        intensity={lightingConfig.spot.intensity}
        position={[
          lightingConfig.spot.position.x,
          lightingConfig.spot.position.y,
          lightingConfig.spot.position.z
        ]}
        target-position={[
          lightingConfig.spot.target.x,
          lightingConfig.spot.target.y,
          lightingConfig.spot.target.z
        ]}
        angle={lightingConfig.spot.angle}
        penumbra={lightingConfig.spot.penumbra}
        distance={lightingConfig.spot.distance}
        decay={lightingConfig.spot.decay}
        castShadow={lightingConfig.spot.castShadow}
        shadow-mapSize={[lightingConfig.spot.shadowMapSize, lightingConfig.spot.shadowMapSize]}
      />
    );
  }, [
    lightingConfig.spot.enabled,
    lightingConfig.spot.color,
    lightingConfig.spot.intensity,
    lightingConfig.spot.position.x,
    lightingConfig.spot.position.y,
    lightingConfig.spot.position.z,
    lightingConfig.spot.target.x,
    lightingConfig.spot.target.y,
    lightingConfig.spot.target.z,
    lightingConfig.spot.angle,
    lightingConfig.spot.penumbra,
    lightingConfig.spot.distance,
    lightingConfig.spot.decay,
    lightingConfig.spot.castShadow,
    lightingConfig.spot.shadowMapSize
  ]);

  return (
    <>
      {ambientLightElement}
      {directionalLightElement}
      {hemisphereLightElement}
      {pointLightElement}
      {spotLightElement}
    </>
  );
});

SceneLighting.displayName = 'SceneLighting';

export default SceneLighting;