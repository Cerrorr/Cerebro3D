/**
 * 资源面板组件类型定义
 * @author Cerror
 * @since 2025-06-25
 */

import type { AssetItem } from './BottomPanel.types';

/**
 * 资源面板组件属性接口
 */
export interface AssetsPanelProps {
  // 搜索关键词
  searchKeyword?: string;
  // 资源选择回调
  onAssetSelect?: (asset: AssetItem) => void;
} 