/**
 * Three.js 相关工具函数
 * 提供3D模型处理、场景树解析等功能
 * @author Cerror
 * @since 2025-07-08
 */

import { Object3D, Mesh, Material, MeshStandardMaterial, WebGLRenderer, Box3, Vector3 } from 'three';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types';

/**
 * 诊断模型的UV坐标和材质问题
 * @param object Three.js对象
 * @returns 诊断报告
 */
export const diagnoseModelIssues = (object: Object3D) => {
  const issues: string[] = [];
  const stats = {
    totalMeshes: 0,
    meshesWithUV: 0,
    meshesWithUV1: 0,
    materialsWithTextures: 0,
    materialsWithLightMap: 0,
    materialsWithAoMap: 0,
    fixedMaterials: 0,
  };

  object.traverse((child) => {
    if (child instanceof Mesh && child.material) {
      stats.totalMeshes++;
      
      const geometry = child.geometry;
      const hasUV = !!geometry.attributes.uv;
      const hasUV1 = !!geometry.attributes.uv1;
      
      if (hasUV) stats.meshesWithUV++;
      if (hasUV1) stats.meshesWithUV1++;
      
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((material: Material) => {
        if (material instanceof MeshStandardMaterial) {
          if (material.map || material.normalMap || material.bumpMap) {
            stats.materialsWithTextures++;
          }
          if (material.lightMap) {
            stats.materialsWithLightMap++;
          }
          if (material.aoMap) {
            stats.materialsWithAoMap++;
          }
          
          // 检查潜在问题
          if ((material.map || material.normalMap || material.bumpMap) && !hasUV) {
            issues.push(`Mesh "${child.name || 'unnamed'}" has textures but missing UV coordinates`);
          }
          if (material.lightMap && !hasUV1) {
            issues.push(`Mesh "${child.name || 'unnamed'}" has lightMap but missing UV1 coordinates`);
          }
          if (material.aoMap && !hasUV1) {
            issues.push(`Mesh "${child.name || 'unnamed'}" has aoMap but missing UV1 coordinates`);
          }
        }
      });
    }
  });

  return { issues, stats };
};

/**
 * 修复模型材质兼容性问题
 * 解决导入模型时的着色器错误，特别是UV坐标相关问题
 * @param object Three.js对象
 * @returns 修复报告
 */
export const fixModelMaterials = (object: Object3D) => {
  // 先诊断问题
  const diagnosis = diagnoseModelIssues(object);
  
  console.log(`[Material Fix] 诊断结果:`, {
    总网格数: diagnosis.stats.totalMeshes,
    有UV坐标: diagnosis.stats.meshesWithUV,
    有UV1坐标: diagnosis.stats.meshesWithUV1,
    发现问题: diagnosis.issues.length,
  });
  
  if (diagnosis.issues.length > 0) {
    console.warn(`[Material Fix] 发现的问题:`, diagnosis.issues);
  }
  
  let fixedCount = 0;
  
  object.traverse((child) => {
    if (child instanceof Mesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      
      materials.forEach((material: Material) => {
        // 检查并修复材质的UV坐标问题
        if (material instanceof MeshStandardMaterial) {
          const geometry = child.geometry;
          
          // 检查UV坐标可用性
          const hasUV = !!geometry.attributes.uv;
          const hasUV1 = !!geometry.attributes.uv1;
          let materialFixed = false;
          
          // 如果缺少基本UV坐标，禁用所有需要UV的纹理
          if (!hasUV) {
            const textureCount = [material.map, material.normalMap, material.bumpMap, material.roughnessMap, material.metalnessMap, material.emissiveMap].filter(Boolean).length;
            if (textureCount > 0) {
              console.warn(`[Material Fix] Mesh "${child.name || 'unnamed'}" missing UV coordinates, disabling ${textureCount} textures`);
              material.map = null;
              material.normalMap = null;
              material.bumpMap = null;
              material.roughnessMap = null;
              material.metalnessMap = null;
              material.emissiveMap = null;
              materialFixed = true;
            }
          }
          
          // 处理需要UV1的纹理 - 优先尝试复制UV到UV1
          if (!hasUV1 && hasUV) {
            if (material.lightMap || material.aoMap) {
              console.log(`[Material Fix] Mesh "${child.name || 'unnamed'}" copying UV to UV1 for lightMap/aoMap compatibility`);
              geometry.setAttribute('uv1', geometry.attributes.uv.clone());
              materialFixed = true;
            }
          } else if (!hasUV1 && !hasUV) {
            // 如果完全没有UV坐标，才禁用这些纹理
            if (material.lightMap) {
              console.warn(`[Material Fix] Mesh "${child.name || 'unnamed'}" has lightMap but missing UV coordinates, disabling lightMap`);
              material.lightMap = null;
              materialFixed = true;
            }
            if (material.aoMap) {
              console.warn(`[Material Fix] Mesh "${child.name || 'unnamed'}" has aoMap but missing UV coordinates, disabling aoMap`);
              material.aoMap = null;
              materialFixed = true;
            }
          }
          
          if (materialFixed) {
            fixedCount++;
            material.needsUpdate = true;
          }
        }
      });
    }
  });
  
  console.log(`[Material Fix] 修复完成，共修复 ${fixedCount} 个材质`);
  return { diagnosis, fixedCount };
};

/**
 * 检查浏览器对 DRACO 和 KTX2 压缩格式的支持
 * @param renderer WebGL 渲染器实例
 * @returns 支持的压缩格式信息
 */
export const checkCompressionSupport = (renderer: WebGLRenderer) => {
  const gl = renderer.getContext();
  
  return {
    draco: true, // DRACO 几何体压缩总是支持的
    ktx2: {
      astc: gl.getExtension('WEBGL_compressed_texture_astc'),
      etc1: gl.getExtension('WEBGL_compressed_texture_etc1'),
      etc2: gl.getExtension('WEBGL_compressed_texture_etc'),
      dxt: gl.getExtension('WEBGL_compressed_texture_s3tc'),
      pvrtc: gl.getExtension('WEBGL_compressed_texture_pvrtc'),
      bptc: gl.getExtension('EXT_texture_compression_bptc'),
    },
    // 通用支持信息
    webgl2: renderer.capabilities.isWebGL2,
    maxTextureSize: renderer.capabilities.maxTextureSize,
  };
};

/**
 * 提取3D模型的内部结构树
 * 递归解析Three.js Object3D对象，生成场景树节点
 * @param object Three.js对象
 * @param baseName 基础名称
 * @returns 场景节点数组
 */
export const extractModelStructure = (object: Object3D, baseName: string): SceneNode[] => {
  const children: SceneNode[] = [];
  
  // 遍历模型的子对象
  if (object.children && object.children.length > 0) {
    object.children.forEach((child: any, index: number) => {
      let nodeType: SceneNode['type'] = 'mesh';
      let nodeName = child.name || `${baseName}_${index}`;
      
      // 根据Three.js对象类型确定节点类型
      if (child.isMesh) {
        nodeType = 'mesh';
        const meshChildren: SceneNode[] = [];
        
        // 添加几何体信息
        if (child.geometry) {
          meshChildren.push({
            id: `${child.uuid}_geometry`,
            name: `几何体 (${child.geometry.type})`,
            type: 'geometry',
            visible: true,
          });
        }
        
        // 添加材质信息
        if (child.material) {
          const materialName = child.material.name || '材质';
          meshChildren.push({
            id: `${child.uuid}_material`,
            name: materialName,
            type: 'material',
            visible: true,
          });
        }
        
        // 如果有几何体或材质，添加到子节点
        if (meshChildren.length > 0) {
          children.push(...meshChildren);
        }
      } else if (child.isGroup) {
        nodeType = 'folder';
        nodeName = child.name || `组_${index}`;
      } else if (child.isLight) {
        nodeType = 'light';
      } else if (child.isCamera) {
        nodeType = 'camera';
      }

      const childNode: SceneNode = {
        id: child.uuid || `${baseName}_child_${index}`,
        name: nodeName,
        type: nodeType,
        visible: true,
        children: child.children && child.children.length > 0 
          ? extractModelStructure(child, nodeName)
          : undefined
      };

      children.push(childNode);
    });
  }
  
  return children;
};

/**
 * 获取3D对象的基本信息
 * @param object Three.js对象
 * @returns 对象信息
 */
export const getObjectInfo = (object: Object3D) => {
  return {
    name: object.name,
    uuid: object.uuid,
    type: object.type,
    visible: object.visible,
    position: object.position.toArray(),
    rotation: object.rotation.toArray(),
    scale: object.scale.toArray(),
    childrenCount: object.children.length,
  };
};

/**
 * 递归计算3D对象的统计信息
 * @param object Three.js对象
 * @returns 统计信息
 */
export const calculateObjectStats = (object: Object3D) => {
  let meshCount = 0;
  let geometryCount = 0;
  let materialCount = 0;
  let lightCount = 0;
  let cameraCount = 0;

  const traverse = (obj: any) => {
    if (obj.isMesh) {
      meshCount++;
      if (obj.geometry) geometryCount++;
      if (obj.material) materialCount++;
    } else if (obj.isLight) {
      lightCount++;
    } else if (obj.isCamera) {
      cameraCount++;
    }

    if (obj.children) {
      obj.children.forEach(traverse);
    }
  };

  traverse(object);

  return {
    meshCount,
    geometryCount,
    materialCount,
    lightCount,
    cameraCount,
    totalObjects: meshCount + lightCount + cameraCount,
  };
};

/**
 * 计算3D对象的包围盒
 * @param object Three.js对象
 * @returns 包围盒信息
 */
export const calculateBoundingBox = (object: Object3D) => {
  const box = new Box3().setFromObject(object);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  
  return {
    box,
    size,
    center,
    min: box.min,
    max: box.max,
  };
};

/**
 * 将3D对象居中并放置在网格上
 * @param object Three.js对象
 * @param options 居中选项
 * @returns 调整后的位置信息
 */
export const centerObjectOnGrid = (object: Object3D, options: {
  centerX?: boolean;
  centerZ?: boolean;
  placeOnGround?: boolean;
} = {}) => {
  const { centerX = true, centerZ = true, placeOnGround = true } = options;
  
  // 计算对象的包围盒
  const boundingInfo = calculateBoundingBox(object);
  const { center, size, min } = boundingInfo;
  
  // 计算需要的位置调整
  const offsetX = centerX ? -center.x : 0;
  const offsetZ = centerZ ? -center.z : 0;
  const offsetY = placeOnGround ? -min.y : 0;
  
  // 应用位置调整
  object.position.set(offsetX, offsetY, offsetZ);
  
  console.log(`[CenterObject] 对象居中完成:`, {
    原始中心: center,
    对象尺寸: size,
    位置调整: { x: offsetX, y: offsetY, z: offsetZ },
    最终位置: object.position.toArray(),
  });
  
  return {
    originalCenter: center,
    objectSize: size,
    appliedOffset: { x: offsetX, y: offsetY, z: offsetZ },
    finalPosition: object.position.clone(),
  };
};

/**
 * 智能放置3D对象到网格上
 * 将对象的几何体中心移动到原点(0,0,0)，底部放置在网格平面上
 * @param object Three.js对象
 * @param targetY 目标Y坐标（默认为0，即网格平面）
 * @returns 放置信息
 */
export const placeObjectOnGrid = (object: Object3D, targetY: number = 0) => {
  const boundingInfo = calculateBoundingBox(object);
  const { min, max, size, center } = boundingInfo;
  
  // 计算需要的偏移量，使几何体中心位于原点，底部位于网格平面
  const offsetX = -center.x;  // X轴居中到原点
  const offsetZ = -center.z;  // Z轴居中到原点
  const offsetY = targetY - min.y;  // Y轴：底部放置在目标平面上
  
  // 应用偏移量
  object.position.set(offsetX, offsetY, offsetZ);
  
  console.log(`[PlaceOnGrid] 对象放置完成:`, {
    对象尺寸: size.toArray(),
    包围盒范围: { min: min.toArray(), max: max.toArray() },
    原始中心: center.toArray(),
    目标平面: targetY,
    应用偏移: { x: offsetX, y: offsetY, z: offsetZ },
    最终位置: object.position.toArray(),
  });
  
  return {
    objectSize: size,
    boundingBox: { min, max },
    originalCenter: center,
    targetPlane: targetY,
    appliedOffset: { x: offsetX, y: offsetY, z: offsetZ },
    finalPosition: object.position.clone(),
  };
};