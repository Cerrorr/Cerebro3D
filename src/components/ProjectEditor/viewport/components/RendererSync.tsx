/**
 * 渲染器配置同步组件 - 将Redux配置应用到Three.js渲染器（性能优化版）
 * @author Cerror  
 * @since 2025-08-28
 */

import React, { useEffect, useRef, useMemo, memo } from 'react';
import { useThree } from '@react-three/fiber';
import { useAppSelector } from '@/store';
import * as THREE from 'three';

export interface RendererSyncProps {
  // 可选的额外配置
}

const RendererSync: React.FC<RendererSyncProps> = memo(() => {
  const { gl, scene, camera } = useThree();
  const rendererConfig = useAppSelector(state => state.renderer.config);
  
  // 使用ref来跟踪上次的配置，避免不必要的更新
  const lastConfigRef = useRef<typeof rendererConfig | null>(null);
  const compilePendingRef = useRef(false);

  // 分离不同类型的配置更新，减少批量重渲染
  const toneMappingConfig = useMemo(() => ({
    type: rendererConfig.toneMapping.type
  }), [rendererConfig.toneMapping.type]);

  const shadowConfig = useMemo(() => ({
    enabled: rendererConfig.shadow.enabled,
    type: rendererConfig.shadow.type
  }), [rendererConfig.shadow.enabled, rendererConfig.shadow.type]);

  const frameRateConfig = useMemo(() => ({
    type: rendererConfig.frameRate.type
  }), [rendererConfig.frameRate.type]);

  const globalIlluminationConfig = useMemo(() => ({
    enabled: rendererConfig.globalIllumination.enabled
  }), [rendererConfig.globalIllumination.enabled]);

  // 色调映射更新（独立处理）
  useEffect(() => {
    if (!gl) return;
    
    const lastConfig = lastConfigRef.current;
    if (lastConfig && lastConfig.toneMapping.type === toneMappingConfig.type) return;

    let needsCompile = false;
    const currentToneMapping = gl.toneMapping;

    switch (toneMappingConfig.type) {
      case 'No':
        if (currentToneMapping !== THREE.NoToneMapping) {
          gl.toneMapping = THREE.NoToneMapping;
          needsCompile = true;
        }
        break;
      case 'Linear':
        if (currentToneMapping !== THREE.LinearToneMapping) {
          gl.toneMapping = THREE.LinearToneMapping;
          needsCompile = true;
        }
        break;
      case 'Reinhard':
        if (currentToneMapping !== THREE.ReinhardToneMapping) {
          gl.toneMapping = THREE.ReinhardToneMapping;
          needsCompile = true;
        }
        break;
      case 'Cineon':
        if (currentToneMapping !== THREE.CineonToneMapping) {
          gl.toneMapping = THREE.CineonToneMapping;
          needsCompile = true;
        }
        break;
      case 'ACESFilmic':
        if (currentToneMapping !== THREE.ACESFilmicToneMapping) {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          needsCompile = true;
        }
        break;
    }

    if (needsCompile && !compilePendingRef.current) {
      compilePendingRef.current = true;
      // 使用 requestAnimationFrame 来延迟编译，避免阻塞UI
      requestAnimationFrame(() => {
        if (scene && camera) {
          gl.compile(scene, camera);
        }
        compilePendingRef.current = false;
      });
    }

  }, [gl, scene, camera, toneMappingConfig.type]);

  // 阴影配置更新（独立处理）
  useEffect(() => {
    if (!gl) return;
    
    const lastConfig = lastConfigRef.current;
    if (lastConfig && 
        lastConfig.shadow.enabled === shadowConfig.enabled && 
        lastConfig.shadow.type === shadowConfig.type) return;

    // 只有在实际状态改变时才更新
    if (gl.shadowMap.enabled !== shadowConfig.enabled) {
      gl.shadowMap.enabled = shadowConfig.enabled;
    }
    
    if (shadowConfig.enabled) {
      let newShadowType: THREE.ShadowMapType;
      
      switch (shadowConfig.type) {
        case 'Basic':
          newShadowType = THREE.BasicShadowMap;
          break;
        case 'PCF':
          newShadowType = THREE.PCFShadowMap;
          break;
        case 'PCF Soft':
          newShadowType = THREE.PCFSoftShadowMap;
          break;
        case 'VSM':
          newShadowType = THREE.VSMShadowMap;
          break;
        default:
          newShadowType = THREE.PCFSoftShadowMap;
      }

      if (gl.shadowMap.type !== newShadowType) {
        gl.shadowMap.type = newShadowType;
        // 阴影类型变化需要重新渲染所有阴影
        gl.shadowMap.needsUpdate = true;
      }
    }

  }, [gl, shadowConfig.enabled, shadowConfig.type]);

  // 帧率配置更新（独立处理，避免频繁调用setPixelRatio）
  useEffect(() => {
    if (!gl) return;
    
    const lastConfig = lastConfigRef.current;
    if (lastConfig && lastConfig.frameRate.type === frameRateConfig.type) return;

    let targetPixelRatio: number;
    
    switch (frameRateConfig.type) {
      case '高帧率':
        targetPixelRatio = Math.min(window.devicePixelRatio, 2);
        break;
      case '中帧率':
        targetPixelRatio = Math.min(window.devicePixelRatio, 1.5);
        break;
      case '低帧率':
        targetPixelRatio = 1;
        break;
      case '自适应':
        targetPixelRatio = Math.min(window.devicePixelRatio, 1.5);
        break;
      default:
        targetPixelRatio = Math.min(window.devicePixelRatio, 1.5);
    }

    // 只有在像素比实际改变时才更新
    const currentPixelRatio = gl.getPixelRatio();
    if (Math.abs(currentPixelRatio - targetPixelRatio) > 0.01) {
      gl.setPixelRatio(targetPixelRatio);
    }

  }, [gl, frameRateConfig.type]);

  // 全局光影配置更新（独立处理）
  useEffect(() => {
    if (!gl) return;
    
    const lastConfig = lastConfigRef.current;
    if (lastConfig && lastConfig.globalIllumination.enabled === globalIlluminationConfig.enabled) return;

    if (globalIlluminationConfig.enabled) {
      // 检查当前颜色空间设置
      if (gl.outputColorSpace !== THREE.SRGBColorSpace) {
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }
    }

  }, [gl, globalIlluminationConfig.enabled]);

  // 抗锯齿提示（不需要频繁检查）
  useEffect(() => {
    const lastConfig = lastConfigRef.current;
    if (!lastConfig || lastConfig.antialiasing.enabled !== rendererConfig.antialiasing.enabled) {
      if (rendererConfig.antialiasing.enabled) {
        console.info('抗锯齿配置已更新');
      }
    }
  }, [rendererConfig.antialiasing.enabled]);

  // 更新配置引用
  useEffect(() => {
    lastConfigRef.current = rendererConfig;
  }, [rendererConfig]);

  // 这个组件不需要渲染任何内容，只负责配置同步
  return null;
});

RendererSync.displayName = 'RendererSync';

export default RendererSync;