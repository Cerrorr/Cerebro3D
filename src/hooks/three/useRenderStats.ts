/**
 * 渲染统计Hook
 * 获取导入模型的实时渲染性能数据和统计信息
 * @author Cerror
 * @since 2025-07-17
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Mesh, BufferGeometry, Material, Texture, Object3D } from 'three';
import { useAppSelector } from '@/store';
import type { 
  RenderStatsData, 
  ModelStatistics, 
  UseRenderStatsOptions, 
  UseRenderStatsReturn 
} from './types/useRenderStats.types';
import { Scene3DService } from './services/Scene3DService';

/**
 * 默认配置选项
 */
const DEFAULT_OPTIONS: Required<UseRenderStatsOptions> = {
  enabled: true,
  updateInterval: 1000, // 1秒更新一次
  includeModelStats: true,
};

/**
 * 计算单个模型的统计数据
 */
const calculateModelStats = (object: Object3D, name: string, objectId: string): ModelStatistics => {
  let vertices = 0;
  let triangles = 0;
  const materialSet = new Set<Material>();
  const textureSet = new Set<Texture>();

  object.traverse((child) => {
    if (child instanceof Mesh) {
      const geometry = (child as any).geometry;
      if (geometry instanceof BufferGeometry) {
        const positionAttribute = geometry.getAttribute('position');
        if (positionAttribute) {
          vertices += positionAttribute.count;
        }
        
        const indexAttribute = geometry.getIndex();
        if (indexAttribute) {
          triangles += indexAttribute.count / 3;
        } else if (positionAttribute) {
          triangles += positionAttribute.count / 3;
        }
      }

      // 收集材质
      const childMaterials = Array.isArray(child.material) ? child.material : [child.material];
      childMaterials.forEach(material => {
        if (material) {
          materialSet.add(material);
          // 收集纹理
          Object.values(material).forEach(value => {
            if (value instanceof Texture) {
              textureSet.add(value);
            }
          });
        }
      });
    }
  });

  return {
    name,
    objectId,
    vertices,
    triangles: Math.round(triangles),
    materials: materialSet.size,
    textures: textureSet.size,
    visible: object.visible,
  };
};

/**
 * 渲染统计Hook
 * @param scene3DService 3D场景服务实例
 * @param options 配置选项
 * @returns 渲染统计数据和控制方法
 */
export const useRenderStats = (
  scene3DService?: Scene3DService,
  options: UseRenderStatsOptions = {}
): UseRenderStatsReturn => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // 从Redux获取场景节点数据
  const { nodes } = useAppSelector(state => state.scene);
  
  // 状态管理
  const [stats, setStats] = useState<RenderStatsData>({
    objectCount: 0,
    vertexCount: 0,
    triangleCount: 0,
  });
  
  const [modelStats, setModelStats] = useState<ModelStatistics[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(config.enabled);
  
  // 监控间隔引用
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 计算场景统计数据
   */
  const calculateSceneStats = useCallback((): RenderStatsData => {
    let totalVertices = 0;
    let totalTriangles = 0;
    let objectCount = 0; // 统计所有3D对象数量
    
    // 统计导入的模型数据
    if (scene3DService) {
      const importedObjects = scene3DService.getAllObjects();
      
      importedObjects.forEach(object => {
        object.traverse((child) => {
          // 统计所有3D对象（类似于原代码的逻辑）
          objectCount++;
          
          // 只有Mesh和Points才计算顶点和三角面
          if (child instanceof Mesh || (child as any).isPoints) {
            const geometry = (child as any).geometry;
            if (geometry instanceof BufferGeometry) {
              const positionAttribute = geometry.getAttribute('position');
              if (positionAttribute) {
                totalVertices += positionAttribute.count;
              }
              
              // 只有Mesh才计算三角面
              if (child instanceof Mesh) {
                const indexAttribute = geometry.getIndex();
                if (indexAttribute) {
                  totalTriangles += indexAttribute.count / 3;
                } else if (positionAttribute) {
                  totalTriangles += positionAttribute.count / 3;
                }
              }
            }
          }
        });
      });
    }
    
    return {
      objectCount, // 返回所有3D对象数量
      vertexCount: totalVertices,
      triangleCount: Math.round(totalTriangles),
    };
  }, [scene3DService]);

  /**
   * 计算模型统计数据
   */
  const calculateModelStatistics = useCallback((): ModelStatistics[] => {
    if (!scene3DService || !config.includeModelStats) {
      return [];
    }

    const statistics: ModelStatistics[] = [];
    
    // 遍历Redux中的场景节点，找到有objectId的节点
    const processNodes = (nodes: any[], parentName = '') => {
      nodes.forEach(node => {
        if (node.objectId) {
          const object = scene3DService.getObject(node.objectId);
          if (object) {
            const modelName = parentName ? `${parentName}/${node.name}` : node.name;
            const modelStat = calculateModelStats(object, modelName, node.objectId);
            statistics.push(modelStat);
          }
        }
        
        if (node.children && node.children.length > 0) {
          processNodes(node.children, node.name);
        }
      });
    };

    processNodes(nodes);
    return statistics;
  }, [scene3DService, nodes, config.includeModelStats]);

  /**
   * 更新统计数据
   */
  const updateStats = useCallback(() => {
    if (!isMonitoring) return;

    try {
      const newStats = calculateSceneStats();
      setStats(newStats);

      if (config.includeModelStats) {
        const newModelStats = calculateModelStatistics();
        setModelStats(newModelStats);
      }
    } catch (error) {
      console.error('更新渲染统计失败:', error);
    }
  }, [isMonitoring, calculateSceneStats, calculateModelStatistics, config.includeModelStats]);

  /**
   * 开始监控
   */
  const startMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsMonitoring(true);
    intervalRef.current = setInterval(updateStats, config.updateInterval);
    updateStats(); // 立即更新一次
  }, [updateStats, config.updateInterval]);

  /**
   * 停止监控
   */
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  /**
   * 重置统计数据
   */
  const resetStats = useCallback(() => {
    setStats({
      objectCount: 0,
      vertexCount: 0,
      triangleCount: 0,
    });
    setModelStats([]);
  }, []);

  // 自动开始/停止监控
  useEffect(() => {
    if (config.enabled && scene3DService) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [config.enabled, scene3DService, startMonitoring, stopMonitoring]);

  // 当场景节点变化时更新统计
  useEffect(() => {
    if (isMonitoring) {
      updateStats();
    }
  }, [nodes, isMonitoring, updateStats]);

  return {
    stats,
    modelStats,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetStats,
  };
}; 