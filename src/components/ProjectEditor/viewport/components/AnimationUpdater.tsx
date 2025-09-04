/**
 * 动画更新器组件
 * 在React Three Fiber Canvas内部更新动画
 * @author Cerror
 * @since 2025-09-04
 */

import { useFrame } from '@react-three/fiber';
import { globalAnimationManager } from '@/hooks/three/services';

/**
 * 动画更新器组件
 * 在每帧更新中调用动画管理器
 */
const AnimationUpdater: React.FC = () => {
  // 每帧更新动画
  useFrame((_, deltaTime) => {
    globalAnimationManager.update(deltaTime);
  });

  return null;
};

export default AnimationUpdater;