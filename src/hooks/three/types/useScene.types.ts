/**
 * useScene Hook 类型定义
 * @author Cerror
 * @since 2025-07-11
 */

/**
 * useScene Hook 返回值类型
 */
export interface UseSceneResult {
  scene: THREE.Scene;
  updateBackgroundColor: (color: string) => void;
  resetScene: () => void;
  sceneInfo: {
    objectCount: number;
    triangleCount: number;
  };
}