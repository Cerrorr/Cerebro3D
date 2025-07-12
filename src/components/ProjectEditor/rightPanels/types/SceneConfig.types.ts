/**
 * 场景配置相关类型定义
 * @author Cerror
 * @since 2025-06-25
 */

/**
 * 项目信息配置接口
 */
export interface ProjectInfo {
  // 场景名称
  sceneName: string;
  // 场景分类
  sceneCategory: string;
  // 场景说明
  sceneDescription: string;
  // 项目类型
  projectType: string;
  // 封面图片
  coverImage?: string;
}

/**
 * 场景配置接口
 */
export interface SceneConfiguration {
  // 背景设置
  background: {
    type: 'color' | 'texture' | 'skybox';
    value: string;
  };
  // 环境设置
  environment: {
    type: 'none' | 'equirect' | 'cube';
    map?: string;
    intensity: number;
  };
  // 辅助显示
  helpers: {
    enabled: boolean;
    axes: boolean;
    cameraHelper: boolean;
    lightHelper: boolean;
  };
}

/**
 * 场景配置组件属性接口
 */
export interface SceneConfigPanelProps {
  // 项目信息
  projectInfo: ProjectInfo;
  // 场景配置
  sceneConfig: SceneConfiguration;
  // 项目信息变更回调
  onProjectInfoChange: (info: Partial<ProjectInfo>) => void;
  // 场景配置变更回调
  onSceneConfigChange: (config: Partial<SceneConfiguration>) => void;
}

/**
 * 场景分类选项
 */
export interface SceneCategoryOption {
  value: string;
  label: string;
}

/**
 * 项目类型选项
 */
export interface ProjectTypeOption {
  value: string;
  label: string;
  color?: string;
}

/**
 * 背景类型选项
 */
export interface BackgroundTypeOption {
  value: 'color' | 'texture' | 'skybox';
  label: string;
} 