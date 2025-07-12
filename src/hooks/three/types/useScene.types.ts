/**
 * useScene Hook 类型定义
 * @author Cerror
 * @since 2025-07-11
 */

/**
 * useScene Hook 返回值类型
 */
export interface UseSceneResult {
  // 场景实例
  scene: THREE.Scene;
  // 更新背景颜色
  updateBackgroundColor: (color: string) => void;
  // 重置场景
  resetScene: () => void;
  // 场景信息
  sceneInfo: {
    // 对象数量
    objectCount: number;
    // 三角形数量
    triangleCount: number;
  };
}