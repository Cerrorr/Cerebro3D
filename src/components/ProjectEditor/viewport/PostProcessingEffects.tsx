/**
 * 综合后期处理效果组件
 * 支持抗锯齿、描边、辉光、LUT、运动残影、变焦、像素风、半色调等效果
 * @author Cerror  
 * @since 2025-08-29
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { 
  EffectComposer, 
  RenderPass, 
  OutlinePass,
  UnrealBloomPass,
  SMAAPass,
  DotScreenPass,
  HalftonePass,
  ShaderPass
} from 'three-stdlib';
import { 
  OutputPass
} from 'three/examples/jsm/postprocessing/OutputPass.js';
import { 
  AfterimagePass
} from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { 
  BokehPass
} from 'three/examples/jsm/postprocessing/BokehPass.js';
import { Vector2, ShaderMaterial } from 'three';
import type { PostProcessingConfig } from '@/components/projectEditor/rightPanels/types/PostProcessing.types';
import { LUTManager, type LUTType } from './LUTManager';
import { LUTShader } from './LUTShader';

// 扩展Three.js类到R3F
extend({ 
  EffectComposer, 
  RenderPass, 
  OutlinePass, 
  UnrealBloomPass,
  SMAAPass,
  DotScreenPass,
  HalftonePass,
  OutputPass,
  AfterimagePass,
  BokehPass,
  ShaderPass
});

interface PostProcessingEffectsProps {
  selectedObjects?: any[];
  config: PostProcessingConfig;
}

const PostProcessingEffects: React.FC<PostProcessingEffectsProps> = ({ 
  selectedObjects = [],
  config
}) => {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<any>(null);
  const [lutTextures, setLutTextures] = useState<Map<LUTType, any>>(new Map());

  // 加载LUT纹理
  useEffect(() => {
    const loadLUTTexture = async () => {
      if (config.lut.enabled && config.lut.lutType) {
        const lutManager = LUTManager.getInstance();
        try {
          const texture = await lutManager.getLUTTexture(config.lut.lutType as LUTType);
          setLutTextures(prev => new Map(prev.set(config.lut.lutType as LUTType, texture)));
        } catch (error) {
          console.warn('Failed to load LUT texture:', error);
        }
      }
    };

    loadLUTTexture();
  }, [config.lut.enabled, config.lut.lutType]);

  // 创建EffectComposer和各种Pass
  const composer = useMemo(() => {
    const effectComposer = new EffectComposer(gl);
    
    // 基础渲染通道 - 总是需要
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    // 抗锯齿 - SMAA Pass
    if (config.antialiasing.enabled) {
      try {
        const smaaPass = new SMAAPass(size.width, size.height);
        effectComposer.addPass(smaaPass);
      } catch (error) {
        console.warn('SMAA Pass initialization failed:', error);
      }
    }

    // 描边效果 - Outline Pass  
    if (config.outline.enabled && selectedObjects.length > 0) {
      try {
        const outlinePass = new OutlinePass(
          new Vector2(size.width, size.height),
          scene,
          camera
        );
        
        outlinePass.edgeStrength = config.outline.edgeStrength;
        outlinePass.edgeGlow = config.outline.edgeGlow;
        outlinePass.edgeThickness = config.outline.edgeThickness;
        
        // 安全解析颜色
        try {
          const visibleColor = config.outline.visibleEdgeColor.startsWith('#') 
            ? config.outline.visibleEdgeColor.replace('#', '0x')
            : `0x${config.outline.visibleEdgeColor}`;
          
          outlinePass.visibleEdgeColor.setHex(parseInt(visibleColor));
          
          // 根据showHiddenEdges开关控制不可见边缘
          if (config.outline.showHiddenEdges) {
            const hiddenColor = config.outline.hiddenEdgeColor.startsWith('#')
              ? config.outline.hiddenEdgeColor.replace('#', '0x')  
              : `0x${config.outline.hiddenEdgeColor}`;
            outlinePass.hiddenEdgeColor.setHex(parseInt(hiddenColor));
          } else {
            // 如果关闭不可见边缘，设置为透明黑色
            outlinePass.hiddenEdgeColor.setRGB(0, 0, 0);
          }
        } catch (error) {
          console.warn('Failed to parse outline colors:', error);
        }
        
        outlinePass.selectedObjects = selectedObjects;
        effectComposer.addPass(outlinePass);
      } catch (error) {
        console.warn('Outline Pass initialization failed:', error);
      }
    }

    // 辉光效果 - Bloom Pass
    if (config.bloom.enabled) {
      try {
        const bloomPass = new UnrealBloomPass(
          new Vector2(size.width, size.height),
          config.bloom.strength,
          config.bloom.radius,
          config.bloom.threshold
        );
        effectComposer.addPass(bloomPass);
      } catch (error) {
        console.warn('Bloom Pass initialization failed:', error);
      }
    }

    // LUT 颜色滤镜 - LUT Pass
    if (config.lut.enabled && config.lut.lutType && lutTextures.has(config.lut.lutType as LUTType)) {
      try {
        const lutTexture = lutTextures.get(config.lut.lutType as LUTType);
        
        const lutMaterial = new ShaderMaterial({
          uniforms: {
            tDiffuse: { value: null },
            lut: { value: lutTexture },
            lutSize: { value: 32 },
            intensity: { value: config.lut.intensity }
          },
          vertexShader: LUTShader.vertexShader,
          fragmentShader: LUTShader.fragmentShader
        });

        const lutPass = new ShaderPass(lutMaterial);
        effectComposer.addPass(lutPass);
      } catch (error) {
        console.warn('LUT Pass initialization failed:', error);
      }
    }

    // 运动残影 - Afterimage Pass
    if (config.motionBlur.enabled) {
      try {
        const afterimagePass = new AfterimagePass(config.motionBlur.decay);
        effectComposer.addPass(afterimagePass);
      } catch (error) {
        console.warn('Afterimage Pass initialization failed:', error);
      }
    }

    // 变焦模糊 - Bokeh Pass (景深效果)
    if (config.zoom.enabled) {
      try {
        const bokehPass = new BokehPass(scene, camera, {
          focus: config.zoom.focus,
          aperture: config.zoom.aperture,
          maxblur: config.zoom.maxBlur,
        });
        effectComposer.addPass(bokehPass);
      } catch (error) {
        console.warn('Bokeh Pass initialization failed:', error);
      }
    }

    // 像素风 - Dot Screen Pass
    if (config.pixel.enabled) {
      try {
        const dotScreenPass = new DotScreenPass(
          new Vector2(0, 0), // 屏幕中心点坐标
          config.pixel.normalEdgeStrength * 0.5, // 角度 - 法向边缘强度控制点阵角度（0-1.5范围，影响点阵旋转）
          config.pixel.pixelSize * 0.1 * (1 + config.pixel.depthEdgeStrength) // 缩放 - 像素大小与深度边缘强度的复合效果（深度强度0-2，影响点阵密集程度）
        );
        effectComposer.addPass(dotScreenPass);
      } catch (error) {
        console.warn('DotScreen Pass initialization failed:', error);
      }
    }

    // 半色调效果 - Halftone Pass
    if (config.halftone.enabled) {
      try {
        const halftonePass = new HalftonePass(
          size.width, 
          size.height, 
          {
            shape: config.halftone.shape === 'dot' ? 1 : 
                   config.halftone.shape === 'line' ? 2 :
                   config.halftone.shape === 'cross' ? 3 : 4,
            radius: config.halftone.radius,
            rotateR: (config.halftone.rotateR * Math.PI) / 180,
            rotateG: (config.halftone.rotateG * Math.PI) / 180,  
            rotateB: (config.halftone.rotateB * Math.PI) / 180,
            scatter: config.halftone.scatter,
            blending: config.halftone.blending,
            blendingMode: config.halftone.blendingMode === 'linear' ? 1 :
                          config.halftone.blendingMode === 'multiply' ? 2 :
                          config.halftone.blendingMode === 'add' ? 3 :
                          config.halftone.blendingMode === 'lighter' ? 4 : 5,
            greyscale: config.halftone.greyscale ? 1 : 0
          }
        );
        effectComposer.addPass(halftonePass);
      } catch (error) {
        console.warn('Halftone Pass initialization failed:', error);
      }
    }

    // 输出通道 - 必须是最后一个
    const outputPass = new OutputPass();
    effectComposer.addPass(outputPass);
    
    composerRef.current = effectComposer;
    return effectComposer;
  }, [
    gl, scene, camera, size.width, size.height, 
    config, selectedObjects, lutTextures
  ]);

  // 更新尺寸
  useEffect(() => {
    if (composer) {
      composer.setSize(size.width, size.height);
    }
  }, [size.width, size.height, composer]);

  // 在每帧渲染时使用composer
  useFrame(() => {
    if (composer) {
      composer.render();
    }
  }, 1); // 优先级为1，在默认渲染之后执行

  return null;
};

export default PostProcessingEffects;