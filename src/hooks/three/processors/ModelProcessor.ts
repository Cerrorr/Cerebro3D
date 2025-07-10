/**
 * 模型处理器
 * 处理模型的后处理操作，如材质修复和定位
 * @author Cerror
 * @since 2025-07-10
 */

import { Object3D, Vector3 } from 'three';
import { fixModelMaterials, placeObjectOnGrid } from '@/utils/threeUtils';
import type { SupportedFileType } from '../types';

/**
 * 模型处理结果接口
 */
export interface ModelProcessResult {
  object: Object3D;
  position: Vector3;
}

// 模型处理器类
export class ModelProcessor {
  /**
   * 处理加载的模型结果
   * @param result 加载器返回的原始结果
   * @param fileType 文件类型
   * @returns 处理后的3D对象
   */
  extractObject(result: { scene?: Object3D } | Object3D, fileType: SupportedFileType): Object3D {
    return fileType === 'gltf' || fileType === 'glb' 
      ? (result as { scene: Object3D }).scene 
      : result as Object3D;
  }

  /**
   * 对模型进行后处理
   * @param object 3D对象
   * @returns 处理结果
   */
  processModel(object: Object3D): ModelProcessResult {
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

    return {
      object,
      position: finalPosition,
    };
  }
}