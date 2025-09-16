/**
 * 剖切管理器
 * 负责管理3D对象的剖切平面功能
 * @author Cerror
 * @since 2025-09-06
 */

import { 
  Object3D, 
  Mesh, 
  Material,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Plane, 
  Vector3,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Group
} from 'three';

/**
 * 剖切配置接口
 */
export interface ClippingConfig {
  enabled: boolean;
  planeNormal: { x: number; y: number; z: number };
  planeDistance: number;
  side: 'front' | 'back' | 'double';
  showEdges: boolean;
  edgeColor: string;
  edgeThickness: number;
}

/**
 * 剖切状态接口
 */
export interface ClippingState {
  objectId: string;
  config: ClippingConfig;
  clippingPlanes: Plane[];
  edgeLines?: LineSegments;
  originalMaterials?: Material[];
}

/**
 * 剖切管理器类
 */
export class ClippingManager {
  private clippingStates = new Map<string, ClippingState>();

  /**
   * 启用对象的剖切功能
   * @param objectId 对象ID
   * @param object 3D对象
   * @param config 剖切配置
   */
  enableClipping(objectId: string, object: Object3D, config: ClippingConfig): boolean {
    try {
      // 如果已存在，先清除
      if (this.clippingStates.has(objectId)) {
        this.disableClipping(objectId, object);
      }

      // 创建剖切平面
      const normal = new Vector3(config.planeNormal.x, config.planeNormal.y, config.planeNormal.z);
      normal.normalize();
      const plane = new Plane(normal, config.planeDistance);
      
      const clippingPlanes = [plane];
      
      // 应用剖切平面到所有材质
      const originalMaterials: Material[] = [];
      this.applyClippingToObject(object, clippingPlanes, originalMaterials, config);

      // 创建边缘线条（如果启用）
      let edgeLines: LineSegments | undefined;
      if (config.showEdges) {
        edgeLines = this.createEdgeLines(object, config);
      }

      // 保存状态
      const state: ClippingState = {
        objectId,
        config,
        clippingPlanes,
        edgeLines,
        originalMaterials
      };
      this.clippingStates.set(objectId, state);

      return true;
    } catch (error) {
      console.error('启用剖切失败:', error);
      return false;
    }
  }

  /**
   * 禁用对象的剖切功能
   * @param objectId 对象ID
   * @param object 3D对象
   */
  disableClipping(objectId: string, object: Object3D): boolean {
    try {
      const state = this.clippingStates.get(objectId);
      if (!state) return false;

      // 恢复原始材质
      this.restoreOriginalMaterials(object, state.originalMaterials || []);

      // 移除边缘线条
      if (state.edgeLines) {
        object.parent?.remove(state.edgeLines);
        state.edgeLines.geometry.dispose();
        (state.edgeLines.material as LineBasicMaterial).dispose();
      }

      // 清除状态
      this.clippingStates.delete(objectId);

      return true;
    } catch (error) {
      console.error('禁用剖切失败:', error);
      return false;
    }
  }

  /**
   * 更新剖切配置
   * @param objectId 对象ID
   * @param object 3D对象
   * @param config 新的剖切配置
   */
  updateClipping(objectId: string, object: Object3D, config: ClippingConfig): boolean {
    const state = this.clippingStates.get(objectId);
    if (!state || !config.enabled) return false;

    return this.enableClipping(objectId, object, config);
  }

  /**
   * 获取剖切状态
   * @param objectId 对象ID
   */
  getClippingState(objectId: string): ClippingState | undefined {
    return this.clippingStates.get(objectId);
  }

  /**
   * 应用剖切平面到对象
   * @param object 3D对象
   * @param clippingPlanes 剖切平面数组
   * @param originalMaterials 原始材质数组（用于恢复）
   * @param config 剖切配置
   */
  private applyClippingToObject(
    object: Object3D, 
    clippingPlanes: Plane[], 
    originalMaterials: Material[],
    config: ClippingConfig
  ): void {
    object.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        // 保存原始材质
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        originalMaterials.push(...materials);

        // 克隆材质并应用剖切
        const clonedMaterials = materials.map(mat => {
          const clonedMat = mat.clone();
          
          // 设置剖切平面
          if (clonedMat instanceof MeshBasicMaterial || 
              clonedMat instanceof MeshStandardMaterial || 
              clonedMat instanceof MeshPhongMaterial) {
            clonedMat.clippingPlanes = clippingPlanes;
            clonedMat.clipShadows = true;
            
            // 设置剖切面
            switch (config.side) {
              case 'front':
                clonedMat.side = 0; // FrontSide
                break;
              case 'back':
                clonedMat.side = 1; // BackSide
                break;
              case 'double':
                clonedMat.side = 2; // DoubleSide
                break;
            }
          }
          
          return clonedMat;
        });

        // 应用克隆的材质
        child.material = clonedMaterials.length === 1 ? clonedMaterials[0] : clonedMaterials;
      }
    });
  }

  /**
   * 恢复对象的原始材质
   * @param object 3D对象
   * @param originalMaterials 原始材质数组
   */
  private restoreOriginalMaterials(object: Object3D, originalMaterials: Material[]): void {
    let materialIndex = 0;
    
    object.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const materialCount = Array.isArray(child.material) ? child.material.length : 1;
        
        if (materialIndex + materialCount <= originalMaterials.length) {
          const restored = originalMaterials.slice(materialIndex, materialIndex + materialCount);
          child.material = restored.length === 1 ? restored[0] : restored;
          materialIndex += materialCount;
        }
      }
    });
  }

  /**
   * 创建剖切边缘线条
   * @param object 3D对象
   * @param config 剖切配置
   */
  private createEdgeLines(object: Object3D, config: ClippingConfig): LineSegments | undefined {
    try {
      const group = new Group();
      
      object.traverse((child) => {
        if (child instanceof Mesh && child.geometry) {
          const edges = new EdgesGeometry(child.geometry);
          const lineMaterial = new LineBasicMaterial({
            color: config.edgeColor,
            linewidth: config.edgeThickness
          });
          const edgeLines = new LineSegments(edges, lineMaterial);
          
          // 复制变换矩阵
          edgeLines.matrix.copy(child.matrixWorld);
          edgeLines.matrixAutoUpdate = false;
          
          group.add(edgeLines);
        }
      });

      if (group.children.length > 0) {
        object.parent?.add(group);
        return group as any;
      }
      
      return undefined;
    } catch (error) {
      console.error('创建边缘线条失败:', error);
      return undefined;
    }
  }

  /**
   * 清除所有剖切状态
   */
  clearAll(): void {
    this.clippingStates.clear();
  }

  /**
   * 获取所有剖切状态
   */
  getAllStates(): Map<string, ClippingState> {
    return new Map(this.clippingStates);
  }
}