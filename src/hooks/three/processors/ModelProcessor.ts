/**
 * 模型处理器
 * 处理模型的后处理操作，如材质修复和定位
 * @author Cerror
 * @since 2025-07-10
 */

import { Object3D, Vector3, AnimationClip } from 'three';
import { fixModelMaterials, placeObjectOnGrid } from '../utils/threeUtils';
import type { SupportedFileType } from '../types';
import type { AnimationItem, AnimationType } from '@/components/projectEditor/rightPanels/types/AnimationPanel.types';

/**
 * 模型处理结果接口
 */
export interface ModelProcessResult {
  object: Object3D;
  position: Vector3;
  animations?: AnimationItem[];
  animationClips?: AnimationClip[];
}

// 模型处理器类
export class ModelProcessor {
  /**
   * 处理加载的模型结果
   * @param result 加载器返回的原始结果
   * @param fileType 文件类型
   * @returns 处理后的3D对象
   */
  extractObject(result: { scene?: Object3D; animations?: AnimationClip[] } | Object3D, fileType: SupportedFileType): Object3D {
    return fileType === 'gltf' || fileType === 'glb' 
      ? (result as { scene: Object3D }).scene 
      : result as Object3D;
  }

  /**
   * 从加载器结果中提取动画剪辑
   * @param result 加载器返回的原始结果
   * @param fileType 文件类型
   * @returns 动画剪辑数组
   */
  extractAnimations(result: { scene?: Object3D; animations?: AnimationClip[] } | Object3D, fileType: SupportedFileType): AnimationClip[] {
    
    if (fileType === 'gltf' || fileType === 'glb') {
      const animations = (result as { animations?: AnimationClip[] }).animations || [];
      return animations;
    } else if (fileType === 'fbx') {
      const fbxResult = result as any;
      const animations = fbxResult.animations || [];
      return animations;
    }
    return [];
  }

  /**
   * 将Three.js动画剪辑转换为动画面板可用的格式
   * @param animationClips Three.js动画剪辑
   * @param targetObject 目标对象
   * @returns 动画项数组
   */
  convertAnimationsToItems(animationClips: AnimationClip[], targetObject: Object3D): AnimationItem[] {
    
    const animationItems = animationClips.map((clip, index) => {
      const animationType = this.determineAnimationType(clip);
      
      return {
        id: `animation_${index}_${Date.now()}`,
        name: clip.name || `动画 ${index + 1}`,
        type: animationType,
        targetId: targetObject.uuid,
        targetName: targetObject.name || '未命名对象',
        duration: clip.duration * 1000, // 转换为毫秒
        progress: 0,
        status: 'stopped' as const,
        easing: 'linear' as const,
        loop: false,
        delay: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        enabled: true
      };
    });
    
    return animationItems;
  }

  /**
   * 根据动画剪辑的轨道确定动画类型
   * @param clip 动画剪辑
   * @returns 动画类型
   */
  private determineAnimationType(clip: AnimationClip): AnimationType {
    // 检查轨道名称来确定动画类型
    for (const track of clip.tracks) {
      const propertyName = track.name.split('.').pop()?.toLowerCase() || '';
      
      if (propertyName.includes('position') || propertyName.includes('translation')) {
        return 'position';
      } else if (propertyName.includes('rotation') || propertyName.includes('quaternion')) {
        return 'rotation';
      } else if (propertyName.includes('scale')) {
        return 'scale';
      } else if (propertyName.includes('material') || propertyName.includes('color')) {
        return 'material';
      } else if (propertyName.includes('morph')) {
        return 'morph';
      }
    }
    
    // 如果包含多种类型的轨道，归类为关键帧动画
    if (clip.tracks.length > 1) {
      return 'keyframe';
    }
    
    // 默认为自定义动画
    return 'custom';
  }

  /**
   * 对模型进行后处理
   * @param object 3D对象
   * @param animationClips 可选的动画剪辑
   * @returns 处理结果
   */
  processModel(object: Object3D, animationClips?: AnimationClip[]): ModelProcessResult {
    
    // 修复材质问题
    fixModelMaterials(object);

    // 计算居中位置
    placeObjectOnGrid(object, 0);

    // 保存计算的位置
    const finalPosition = object.position.clone();

    // 重置对象的transform，让React Three Fiber的primitive组件来处理位置
    object.position.set(0, 0, 0);
    object.rotation.set(0, 0, 0);
    object.scale.set(1, 1, 1);

    // 处理动画数据
    let animations: AnimationItem[] | undefined;
    if (animationClips && animationClips.length > 0) {
      animations = this.convertAnimationsToItems(animationClips, object);
    } else {
    }

    const result = {
      object,
      position: finalPosition,
      animations,
      animationClips, // 保存原始剪辑引用
    };
    
    
    return result;
  }
}