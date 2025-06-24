/**
 * 类型定义统一导出模块
 * 遵循类型声明组织管理规范，按模块就近管理类型
 * 
 * 本文件仅用于向后兼容，建议直接从对应模块导入类型：
 * - 页面类型：从 '../pages/types' 导入
 * - 组件类型：从具体组件的 types 目录导入
 * - 通用类型：从 './common.types' 导入
 * 
 * @author Cerror
 * @since 2025-06-24
 * @deprecated 推荐使用模块化类型导入
 */

// 全局通用类型（推荐直接从 './common.types' 导入）
export * from './common.types';

// 页面类型（推荐直接从 '@/pages/types' 导入）
export * from '@/pages/types';

// 组件类型（推荐直接从对应组件types目录导入）
export * from '@/components/Sidebar/types';
// 注意：MainContent types中的NewProjectFormData与common.types重复，暂时注释避免冲突
// export * from '@/components/MainContent/types'; 