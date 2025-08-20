/**
 * 原生Three.js后期处理OutlinePass组件
 * 直接在R3F中使用Three.js的EffectComposer和OutlinePass
 * @author Cerror
 * @since 2025-08-20
 */

import React, { useEffect, useMemo } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { EffectComposer, RenderPass, OutlinePass } from 'three-stdlib';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Vector2 } from 'three';
import type { NativeOutlineEffectProps } from './types/NativeOutlineEffect.types';

// 扩展Three.js类到R3F
extend({ EffectComposer, RenderPass, OutlinePass, OutputPass });

const NativeOutlineEffect: React.FC<NativeOutlineEffectProps> = ({
  selectedObjects = [],
  edgeColor = 0x00ff00,
  edgeStrength = 3.0,
  edgeThickness = 1.0,
  pulsePeriod = 0,
}) => {
  const { gl, scene, camera, size } = useThree();

  // 创建EffectComposer和各种Pass
  const composer = useMemo(() => {
    const effectComposer = new EffectComposer(gl);
    
    // 基础渲染通道
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    
    // 描边通道
    const outlinePass = new OutlinePass(
      new Vector2(size.width, size.height),
      scene,
      camera
    );
    
    // 配置描边效果
    outlinePass.edgeStrength = edgeStrength;
    outlinePass.edgeGlow = 0;
    outlinePass.edgeThickness = edgeThickness;
    outlinePass.pulsePeriod = pulsePeriod;
    outlinePass.usePatternTexture = false;
    outlinePass.visibleEdgeColor.setHex(edgeColor);
    outlinePass.hiddenEdgeColor.setHex(edgeColor);
    
    effectComposer.addPass(outlinePass);
    
    // 输出通道
    const outputPass = new OutputPass();
    effectComposer.addPass(outputPass);
    
    return { effectComposer, outlinePass };
  }, [gl, scene, camera, size.width, size.height, edgeColor, edgeStrength, edgeThickness, pulsePeriod]);

  // 更新选中对象
  useEffect(() => {
    if (composer.outlinePass) {
      composer.outlinePass.selectedObjects = selectedObjects;
    }
  }, [selectedObjects, composer.outlinePass]);

  // 更新尺寸
  useEffect(() => {
    if (composer.outlinePass) {
      composer.outlinePass.resolution.set(size.width, size.height);
    }
    composer.effectComposer.setSize(size.width, size.height);
  }, [size.width, size.height, composer]);

  // 在每帧渲染时使用composer
  useFrame(() => {
    composer.effectComposer.render();
  }, 1); // 优先级为1，在默认渲染之后执行

  return null;
};

export default NativeOutlineEffect;