/// <reference types="vite/client" />

/**
 * Vite环境变量类型定义
 */
interface ImportMetaEnv {
  // 应用名称
  readonly VITE_APP_NAME: string
  // 应用版本
  readonly VITE_APP_VERSION: string
}

/**
 * 导入元数据接口
 */
interface ImportMeta {
  // 环境变量
  readonly env: ImportMetaEnv
} 