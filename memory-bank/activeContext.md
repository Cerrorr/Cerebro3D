# React Three Editor - 活跃上下文

## 🎯 当前工作状态
**状态**: 代码结构重置 - 规范化重建阶段  
**最后更新**: 2025-06-23  
**重大变更**: 用户删除所有代码，只保留项目结构，准备按新规范重建

## 📋 **重建背景和目标**

### 🔄 重置原因
- 按照新建立的16个开发规范重新构建
- 确保100%符合小驼峰命名规范
- 实施类型文件就近管理策略
- 严格执行组件职责分离原则

### 🎯 重建目标
- **代码质量**: 从零开始确保高质量代码
- **规范一致性**: 严格遵循已建立的16个开发规范
- **架构清晰**: 完全按照新架构设计实现
- **类型安全**: 100%的TypeScript类型覆盖

## 📋 已建立的开发规范体系 (16个) ✅

### 核心架构规范
1. **箭头函数优先规范** - `ts-rules/arrow-functions-auto.mdc`
2. **单一职责原则规范** - `core-rules/single-responsibility-principle-agent.mdc`
3. **业务3D代码分离规范** - `core-rules/business-3d-separation-agent.mdc`
4. **React Three Fiber Hook封装规范** - `core-rules/react-three-fiber-hooks-auto.mdc`

### 技术栈与工具规范
5. **技术栈标准规范** - `global-rules/tech-stack-standards-always.mdc`
6. **Redux状态管理规范** - `global-rules/redux-state-management-always.mdc`
7. **Ant Design UI规范** - `ui-rules/antdesign-ui-standards-auto.mdc`
8. **Prettier代码格式化规范** - `tool-rules/prettier-formatting-auto.mdc`
9. **Git提交推送规范** - `tool-rules/git-commit-push-agent.mdc`

### 代码质量规范
10. **TypeScript最佳实践规范** - `ts-rules/typescript-best-practices-agent.mdc`
11. **中文注释规范** - `ts-rules/chinese-comments-auto.mdc`
12. **单元测试覆盖率规范** - `testing-rules/unit-testing-coverage-agent.mdc`
13. **Code Review工作流程规范** - `tool-rules/code-review-workflow-agent.mdc`

### 项目组织规范 (最新制定)
14. **小驼峰文件命名规范** - `core-rules/file-naming-camelcase-auto.mdc`
15. **项目结构组织规范** - `core-rules/project-structure-organization-agent.mdc`
16. **类型声明组织管理规范** - `ts-rules/type-declaration-organization-auto.mdc`

## 🏗️ 标准项目架构 (重建目标)

### 技术栈配置 ✅
- **前端框架**: React 18 + TypeScript
- **3D引擎**: React Three Fiber + Three.js
- **状态管理**: Redux Toolkit
- **UI组件库**: Ant Design
- **样式方案**: TailwindCSS + CSS Modules
- **构建工具**: Vite
- **测试框架**: Jest + React Testing Library
- **代码格式**: Prettier

### 标准目录结构 (重建模板)
```
src/
├── components/           # 📁 公共组件
│   ├── ui/              # 基础UI组件 + types/
│   ├── layout/          # 布局组件 + types/
│   ├── editor/          # 编辑器公共组件 + types/
│   └── common/          # 通用业务组件 + types/
├── pages/               # 📁 业务页面
│   ├── editor/          # 编辑器相关页面 + types/
│   ├── project/         # 项目管理相关页面 + types/
│   ├── settings/        # 设置相关页面 + types/
│   └── auth/            # 认证相关页面 + types/
├── hooks/               # 📁 自定义Hook
│   ├── business/        # 业务逻辑Hook + types/
│   └── three/           # Three.js相关Hook + types/
├── routes/              # 📁 路由配置
├── store/               # 📁 状态管理
│   ├── types/           # Redux类型定义
│   └── slices/          # 状态切片
├── types/               # 📁 全局类型定义
├── utils/               # 📁 工具函数
└── services/            # 📁 服务层
```

## 📋 重建任务清单

### 🚀 第一阶段: 核心架构 (进行中)
- [ ] `src/main.tsx` - 应用入口 (小驼峰命名)
- [ ] `src/app.tsx` - 主应用组件 (小驼峰命名)
- [ ] `src/types/common.types.ts` - 全局通用类型
- [ ] `src/types/api.types.ts` - API接口类型

### 🎯 第二阶段: 状态管理
- [ ] `src/store/store.ts` - Redux配置
- [ ] `src/store/types/editorSlice.types.ts` - 编辑器状态类型
- [ ] `src/store/types/sceneSlice.types.ts` - 场景状态类型
- [ ] `src/store/slices/editorSlice.ts` - 编辑器状态切片
- [ ] `src/store/slices/sceneSlice.ts` - 场景状态切片

### 🛣️ 第三阶段: 路由系统
- [ ] `src/types/router.types.ts` - 路由类型定义 (小驼峰)
- [ ] `src/routes/appRoutes.tsx` - 路由配置 (小驼峰)

### 🧩 第四阶段: 组件系统
- [ ] `src/components/layout/appLayout.tsx` - 应用布局 (小驼峰)
- [ ] `src/components/layout/types/appLayout.types.ts` - 布局类型 (就近管理)
- [ ] `src/components/editor/mainEditor.tsx` - 主编辑器 (小驼峰)
- [ ] `src/components/editor/types/mainEditor.types.ts` - 编辑器类型 (就近管理)

### 📄 第五阶段: 业务页面
- [ ] `src/pages/editor/editorPage.tsx` - 编辑器页面 (小驼峰)
- [ ] `src/pages/project/projectListPage.tsx` - 项目列表页面 (小驼峰)
- [ ] `src/pages/settings/settingsPage.tsx` - 设置页面 (小驼峰)

## 🎯 重建核心原则

### 命名规范要求 (严格执行)
- **文件命名**: 严格使用小驼峰 (camelCase)
- **类型文件**: `moduleName.types.ts` 格式
- **Hook文件**: `useFeatureName.ts` 格式
- **组件文件**: `componentName.tsx` 格式

### 类型管理策略 (新规范)
- **就近原则**: 类型定义放在使用模块的 `types/` 子目录
- **模块化管理**: 每个功能模块独立管理自己的类型
- **统一导出**: 通过 `index.ts` 统一导出模块类型

### 代码质量要求
1. **所有方法必须JSDoc中文注释** [按规范][[memory:374298545736366999]]
2. **测试覆盖率85%以上** [按规范][[memory:5770836149392216384]]
3. **业务逻辑与3D代码分离**
4. **Hook功能明确分类** (business vs three)
5. **组件职责明确分离** (components vs pages)

## 🎨 重建优势和价值

### 📈 质量提升
1. **规范化程度**: 100%符合已建立的开发规范
2. **代码质量**: 从头开始保证高质量代码
3. **架构清晰**: 严格按照新架构分层实现
4. **类型安全**: 完整的TypeScript类型系统

### 🚀 长期价值
1. **可维护性**: 模块化设计便于扩展和维护
2. **团队协作**: 统一规范降低协作成本
3. **代码一致性**: 所有文件遵循相同的组织原则
4. **扩展性**: 清晰的架构便于功能扩展

---

**当前重点**: 🔄 准备开始第一阶段核心架构重建  
**下一步行动**: 重建 `main.tsx` 和 `app.tsx` 核心入口文件  
**预期成果**: 完全符合16个开发规范的高质量React Three Editor项目 🚀  
**最后更新**: 2025-06-23 