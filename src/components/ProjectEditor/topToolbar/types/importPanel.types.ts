import type { FileImportResult } from '@/hooks/three';

/**
 * 导入面板组件属性接口
 */
export interface ImportPanelProps {
  /** 面板是否可见 */
  visible: boolean;
  /** 关闭面板回调函数 */
  onClose: () => void;
  /** 导入成功回调函数 */
  onImportSuccess?: (results: FileImportResult[]) => void;
  /** 导入错误回调函数 */
  onImportError?: (error: string) => void;
}