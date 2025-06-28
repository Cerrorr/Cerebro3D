# 常量管理规范 📋

## 概述

本项目采用就近原则管理常量数据，避免在组件中硬编码配置信息，提高代码的可维护性和可扩展性。

## 文件组织结构

```
src/
├── constants/                    # 全局常量
│   ├── app.constants.ts         # 应用级常量
│   ├── api.constants.ts         # API相关常量
│   └── theme.constants.ts       # 主题配置常量
├── components/
│   └── ComponentName/
│       ├── constants/           # 组件级常量
│       │   ├── componentName.constants.ts
│       │   └── index.ts
│       ├── ComponentName.tsx
│       └── types/
└── pages/
    └── PageName/
        ├── constants/           # 页面级常量
        └── PageName.tsx
```

## 常量分类

### 1. 🌐 全局常量
- **位置**: `src/constants/`
- **用途**: 整个应用共享的配置
- **示例**: API基础URL、通用配置项、全局枚举

### 2. 🧩 组件级常量  
- **位置**: `src/components/ComponentName/constants/`
- **用途**: 组件特定的配置数据
- **示例**: 菜单项配置、图标映射、默认值

### 3. 📄 页面级常量
- **位置**: `src/pages/PageName/constants/`
- **用途**: 页面特定的配置
- **示例**: 页面布局配置、路由参数

## 命名规范

### 常量命名
- 使用 `SCREAMING_SNAKE_CASE` 命名
- 描述性名称，体现用途和作用域
- 添加类型后缀区分不同类型的常量

```typescript
// ✅ 正确命名
export const TAB_TITLE_MAP = { ... };
export const EMPTY_STATE_ICONS = { ... };
export const DEFAULT_CONFIG = { ... };

// ❌ 错误命名
export const tabMap = { ... };
export const icons = { ... };
export const config = { ... };
```

### 文件命名
- 使用小驼峰命名 + `.constants.ts` 后缀
- 文件名与组件/功能名对应

```
RightSidebar.constants.ts
userManagement.constants.ts
canvas3D.constants.ts
```

## 实施示例

### RightSidebar重构前后对比

#### ❌ 重构前 - 硬编码常量
```typescript
const RightSidebar = () => {
  const tabItems = [
    { id: 'scene', label: '场景配置', icon: <SceneIcon /> },
    { id: 'camera', label: '相机配置', icon: <CameraIcon /> }
  ];
  
  const getTabTitle = (tabId: string) => {
    const tabMap = {
      scene: '场景配置',
      camera: '相机配置'
    };
    return tabMap[tabId];
  };
};
```

#### ✅ 重构后 - 常量分离
```typescript
// constants/RightSidebar.constants.ts
export const TAB_TITLE_MAP = {
  scene: '场景配置',
  camera: '相机配置'
};

export const getTabItems = () => [...];

// RightSidebar.tsx
import { TAB_TITLE_MAP, getTabItems } from './constants';

const RightSidebar = () => {
  const tabItems = getTabItems();
  const getTabTitle = (tabId: string) => TAB_TITLE_MAP[tabId];
};
```

## 最佳实践

### 1. 📝 添加详细注释
```typescript
/**
 * 标签标题映射表
 * 定义每个标签ID对应的中文标题
 */
export const TAB_TITLE_MAP: Record<TabType, string> = {
  scene: '场景配置',
  camera: '相机配置'
};
```

### 2. 🔒 使用as const断言
```typescript
export const DEFAULT_CONFIG = {
  DEFAULT_WIDTH: 300,
  COLLAPSED_WIDTH: 48
} as const;
```

### 3. 📦 统一导出
```typescript
// constants/index.ts
export {
  TAB_TITLE_MAP,
  EMPTY_STATE_ICONS,
  getTabItems
} from './RightSidebar.constants';
```

### 4. 🎯 类型安全
```typescript
import type { RightSidebarTabType } from '../types';

export const TAB_TITLE_MAP: Record<RightSidebarTabType, string> = {
  // 确保类型安全
};
```

## 迁移检查清单

- [ ] 识别组件中的硬编码常量
- [ ] 创建对应的constants文件夹
- [ ] 按功能分类常量数据
- [ ] 添加TypeScript类型约束
- [ ] 更新组件导入常量
- [ ] 验证功能正常运行
- [ ] 添加JSDoc文档注释

## 好处

### 🔧 维护性提升
- 配置集中管理，修改更方便
- 减少重复代码和硬编码
- 统一的命名和组织规范

### 🚀 开发效率
- 新增配置项更容易
- 团队协作更顺畅
- 代码审查更清晰

### 🛡️ 可靠性增强
- TypeScript类型检查
- 避免拼写错误
- 配置一致性保证 