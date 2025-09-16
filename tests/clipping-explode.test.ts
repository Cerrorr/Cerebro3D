/**
 * 剖切和爆炸功能测试
 * @author Cerror
 * @since 2025-09-06
 */

import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three';
import { ClippingManager } from '../src/hooks/three/services/ClippingManager';
import { ExplodeManager } from '../src/hooks/three/services/ExplodeManager';

describe('剖切和爆炸功能测试', () => {
  let clippingManager: ClippingManager;
  let explodeManager: ExplodeManager;
  let testObject: Object3D;

  beforeEach(() => {
    clippingManager = new ClippingManager();
    explodeManager = new ExplodeManager();
    
    // 创建测试对象
    testObject = new Object3D();
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    
    // 添加几个子对象
    for (let i = 0; i < 3; i++) {
      const mesh = new Mesh(geometry, material.clone());
      mesh.position.set(i * 2, 0, 0);
      testObject.add(mesh);
    }
  });

  afterEach(() => {
    clippingManager.clearAll();
    explodeManager.clearAll();
  });

  describe('剖切功能', () => {
    test('应该能够启用剖切', () => {
      const config = {
        enabled: true,
        planeNormal: { x: 1, y: 0, z: 0 },
        planeDistance: 0,
        side: 'front' as const,
        showEdges: true,
        edgeColor: '#ffffff',
        edgeThickness: 1
      };

      const result = clippingManager.enableClipping('test1', testObject, config);
      expect(result).toBe(true);
      
      const state = clippingManager.getClippingState('test1');
      expect(state).toBeDefined();
      expect(state!.config.enabled).toBe(true);
    });

    test('应该能够禁用剖切', () => {
      const config = {
        enabled: true,
        planeNormal: { x: 1, y: 0, z: 0 },
        planeDistance: 0,
        side: 'front' as const,
        showEdges: false,
        edgeColor: '#ffffff',
        edgeThickness: 1
      };

      clippingManager.enableClipping('test1', testObject, config);
      const result = clippingManager.disableClipping('test1', testObject);
      
      expect(result).toBe(true);
      const state = clippingManager.getClippingState('test1');
      expect(state).toBeUndefined();
    });
  });

  describe('爆炸功能', () => {
    test('应该能够启用爆炸视图', () => {
      const config = {
        enabled: true,
        intensity: 2.0,
        center: { x: 0, y: 0, z: 0 },
        direction: 'radial' as const,
        duration: 1000,
        easing: 'easeOut' as const
      };

      const result = explodeManager.enableExplode('test1', testObject, config);
      expect(result).toBe(true);
      
      const state = explodeManager.getExplodeState('test1');
      expect(state).toBeDefined();
      expect(state!.config.enabled).toBe(true);
    });

    test('应该能够禁用爆炸视图', () => {
      const config = {
        enabled: true,
        intensity: 1.5,
        center: { x: 0, y: 0, z: 0 },
        direction: 'x' as const,
        duration: 1500,
        easing: 'linear' as const
      };

      explodeManager.enableExplode('test1', testObject, config);
      const result = explodeManager.disableExplode('test1', testObject);
      
      expect(result).toBe(true);
      const state = explodeManager.getExplodeState('test1');
      expect(state).toBeUndefined();
    });

    test('应该能够切换爆炸状态', () => {
      const config = {
        enabled: true,
        intensity: 1.0,
        center: { x: 0, y: 0, z: 0 },
        direction: 'y' as const,
        duration: 800,
        easing: 'easeInOut' as const
      };

      explodeManager.enableExplode('test1', testObject, config);
      
      // 第一次切换
      const result1 = explodeManager.toggleExplode('test1', testObject);
      expect(result1).toBe(true);
      
      // 第二次切换
      const result2 = explodeManager.toggleExplode('test1', testObject);
      expect(result2).toBe(true);
    });

    test('应该正确计算不同方向的爆炸', () => {
      const configs = [
        {
          enabled: true,
          intensity: 1.0,
          center: { x: 0, y: 0, z: 0 },
          direction: 'x' as const,
          duration: 1000,
          easing: 'linear' as const
        },
        {
          enabled: true,
          intensity: 1.0,
          center: { x: 0, y: 0, z: 0 },
          direction: 'y' as const,
          duration: 1000,
          easing: 'linear' as const
        },
        {
          enabled: true,
          intensity: 1.0,
          center: { x: 0, y: 0, z: 0 },
          direction: 'z' as const,
          duration: 1000,
          easing: 'linear' as const
        }
      ];

      configs.forEach((config, index) => {
        const objectId = `test${index}`;
        const result = explodeManager.enableExplode(objectId, testObject, config);
        expect(result).toBe(true);
        
        const state = explodeManager.getExplodeState(objectId);
        expect(state).toBeDefined();
        expect(state!.explodedPositions.size).toBeGreaterThan(0);
      });
    });
  });
});