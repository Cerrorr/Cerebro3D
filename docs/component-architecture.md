# React 3D Editor 首页组件架构

## 📋 组件拆分概览

根据组件拆分规范，首页被拆分为以下组件层次结构：

```
HomePage (页面组件)
├── Sidebar (侧边栏容器)
│   ├── SidebarHeader (头部：Logo + 应用名)
│   ├── SidebarMenu (菜单列表)
│   └── SidebarFooter (底部：版本、作者、备案号)
└── MainContent (主内容区容器)
    ├── CarouselSection (轮播图区域)
    └── ProjectGrid (项目网格)
        └── ProjectCard (项目卡片)
```

## 🎯 组件职责分离

### 📁 页面层 (`src/pages/`)
- **HomePage**: 整合侧边栏和主内容区，管理页面级状态

### 🧩 容器组件层
- **Sidebar**: 侧边栏容器，负责布局和事件传递
- **MainContent**: 主内容区容器，负责布局和数据传递

### 🔧 功能组件层
- **SidebarHeader**: 展示应用标识
- **SidebarMenu**: 导航菜单交互
- **SidebarFooter**: 应用信息展示
- **CarouselSection**: 轮播图逻辑和交互
- **ProjectGrid**: 项目列表布局和空状态

### 📦 展示组件层
- **ProjectCard**: 单个项目信息展示

## 🏗️ 文件结构

```
src/
├── types/
│   └── index.ts                    # TypeScript 类型定义
├── components/
│   ├── index.ts                    # 组件统一导出
│   ├── Sidebar/
│   │   ├── index.ts               # 侧边栏组件导出
│   │   ├── Sidebar.tsx            # 侧边栏容器
│   │   ├── Sidebar.css            # 侧边栏样式
│   │   ├── SidebarHeader.tsx      # 头部组件
│   │   ├── SidebarMenu.tsx        # 菜单组件
│   │   └── SidebarFooter.tsx      # 底部组件
│   └── MainContent/
│       ├── index.ts               # 主内容区组件导出
│       ├── MainContent.tsx        # 主内容区容器
│       ├── MainContent.css        # 主内容区样式
│       ├── CarouselSection.tsx    # 轮播图组件
│       ├── ProjectGrid.tsx        # 项目网格组件
│       └── ProjectCard.tsx        # 项目卡片组件
└── pages/
    ├── HomePage.tsx               # 首页组件
    └── HomePage.css               # 首页样式
```

## 🎨 设计特点

### 响应式布局
- **桌面端**: 侧边栏固定250px，主内容区自适应
- **平板端**: 网格布局调整为2-3列
- **移动端**: 侧边栏变为水平布局，项目卡片单列显示

### 交互效果
- **轮播图**: 5秒自动切换，支持指示器点击
- **项目卡片**: 悬停效果，缩略图缩放
- **菜单项**: 活跃状态指示，悬停反馈

### 样式特色
- **毛玻璃效果**: 侧边栏和卡片使用backdrop-filter
- **渐变背景**: 紫蓝色渐变主题
- **圆角设计**: 现代化圆角卡片设计
- **阴影层次**: 多层次阴影营造深度感

## 🚀 使用方式

```tsx
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}
```

## 📝 开发注意事项

1. **图片资源**: 需要在 `public/images/` 目录下放置相应的图片文件
2. **类型安全**: 所有组件都使用TypeScript严格类型检查
3. **性能优化**: 轮播图使用useEffect优化，避免内存泄漏
4. **可扩展性**: 组件设计支持轻松添加新功能和样式变更

## 🔧 后续扩展

- [ ] 添加路由导航功能
- [ ] 集成状态管理(Redux/Zustand)
- [ ] 添加项目CRUD操作
- [ ] 实现拖拽排序功能
- [ ] 添加搜索和筛选功能 