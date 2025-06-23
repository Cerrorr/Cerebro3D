# React Three Editor 🎨✨

一个强大的基于 React Three Fiber 的在线 3D 编辑器

## 🚀 技术栈

基于团队规范，我们使用以下最新技术栈：

- **React 18** + **TypeScript** - 核心UI框架与类型安全
- **React Three Fiber** - 声明式3D场景管理
- **TailwindCSS** - 实用优先的样式系统
- **Ant Design** - 企业级UI组件库
- **Redux Toolkit** - 可预测的状态管理
- **Jest + RTL** - 全面的测试覆盖(85%+)

## 📁 项目结构

```
src/
├── components/           # React 组件
│   ├── Editor/          # 编辑器核心组件
│   │   ├── Editor.tsx
│   │   └── Editor.types.ts
│   ├── Toolbar/         # 工具栏组件
│   ├── Viewport/        # 3D视口组件
│   ├── Properties/      # 属性面板组件
│   └── Hierarchy/       # 层级面板组件
├── hooks/               # 自定义 Hooks
│   ├── useR3FScene.ts
│   ├── useR3FScene.types.ts
│   ├── useSelection.ts
│   └── useGizmo.ts
├── store/               # Redux 状态管理
│   ├── slices/
│   │   ├── editorSlice.ts
│   │   ├── editorSlice.types.ts
│   │   ├── sceneSlice.ts
│   │   └── sceneSlice.types.ts
│   └── store.ts
├── types/               # 公共类型定义
│   ├── common.types.ts
│   ├── three.types.ts
│   └── api.types.ts
├── services/            # API 服务
│   ├── sceneService.ts
│   └── sceneService.types.ts
└── utils/               # 工具函数
    ├── threeHelpers.ts
    └── geometry.ts
```

## 🎯 核心功能规划

### 1. 基础编辑器
- [x] 3D视口渲染
- [x] 基础几何体创建
- [x] 对象选择与变换
- [x] 相机控制

### 2. 高级功能
- [ ] 材质编辑器
- [ ] 光照系统
- [ ] 动画时间线
- [ ] 场景导入/导出

### 3. 用户体验
- [ ] 撤销/重做系统
- [ ] 快捷键支持
- [ ] 响应式设计
- [ ] 性能优化

## 🛠️ 开发规范

### 代码质量
- ✅ **TypeScript** - 严格类型检查
- ✅ **Prettier** - 自动代码格式化
- ✅ **ESLint** - 代码质量检查
- ✅ **单元测试** - 85%+ 覆盖率要求

### 架构原则
- ✅ **业务3D分离** - 业务逻辑与3D渲染分离
- ✅ **单一职责** - 每个函数/组件职责单一
- ✅ **Hook封装** - 所有3D功能封装为Hook
- ✅ **类型文件分离** - 类型定义独立文件管理

### 工作流程
- ✅ **Code Review** - 强制代码审查
- ✅ **分支保护** - 主分支保护规则
- ✅ **CI/CD** - 自动化测试和部署
- ✅ **Git Hooks** - 提交前质量检查

## 🚦 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

## 📊 开发进度

- [x] 项目初始化和配置
- [x] 核心类型定义
- [ ] Redux Store 配置
- [ ] 基础组件开发
- [ ] 3D Hook 实现
- [ ] 编辑器核心功能
- [ ] 测试用例编写
- [ ] 性能优化

## 🤝 团队协作

### 提交规范
```bash
feat: 添加新功能
fix: 修复bug
refactor: 代码重构
test: 添加测试
docs: 文档更新
```

### 分支策略
- `main` - 主分支 (受保护)
- `feature/功能名` - 功能开发分支
- `fix/问题描述` - 问题修复分支

---

**让我们一起构建一个出色的 3D 编辑器！** 🎉 