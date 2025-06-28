# Cerebro3D 🧠✨

智能化Web3D编辑器 - 让3D创作更简单

## ✨ 产品特色

- 🧠 **智能化编辑** - AI辅助的3D建模和场景构建
- 🎨 **可视化操作** - 拖拽式界面，所见即所得
- 🚀 **实时预览** - 高性能WebGL渲染引擎
- 📱 **跨平台访问** - 支持桌面端和移动端浏览器
- 🔗 **一键发布** - 快速部署到Web，随时随地分享

## 🛠️ 技术栈

基于现代前端技术栈，打造高性能3D编辑器：

- **React 18** + **TypeScript** - 核心UI框架与类型安全
- **React Three Fiber** - 声明式3D场景管理
- **Three.js** - 强大的WebGL 3D库
- **TailwindCSS** + **SCSS** - 灵活的样式系统
- **Ant Design** - 企业级UI组件库
- **Vite** - 极速构建工具
- **百度统计** - 用户行为分析

## 📁 项目结构

```
src/
├── components/           # React 组件
│   ├── MainContent/     # 主内容区域
│   │   ├── CarouselSection.tsx    # 轮播图展示
│   │   ├── ProjectGrid.tsx        # 项目网格
│   │   ├── ProjectCard.tsx        # 项目卡片
│   │   ├── NewProjectModal.tsx    # 新建项目弹窗
│   │   └── types/                 # 组件类型定义
│   └── Sidebar/         # 侧边栏组件
│       ├── Sidebar.tsx            # 侧边栏主体
│       ├── SidebarHeader.tsx      # 头部Logo区域
│       ├── SidebarMenu.tsx        # 导航菜单
│       ├── SidebarFooter.tsx      # 底部信息
│       └── types/                 # 组件类型定义
├── pages/               # 页面组件
│   ├── HomePage.tsx     # 首页
│   └── types/           # 页面类型定义
├── hooks/               # 自定义 Hooks
│   ├── business/        # 业务逻辑钩子
│   └── three/           # 3D相关钩子
├── types/               # 全局类型定义
│   ├── Common.types.ts  # 通用类型
│   └── index.ts         # 类型导出
├── styles/              # 全局样式
│   ├── globals.scss     # 全局样式
│   ├── variables.scss   # SCSS变量
│   └── mixins.scss      # SCSS混入
├── utils/               # 工具函数
│   └── analytics.ts     # 百度统计工具
└── routes/              # 路由配置
    └── route.tsx        # 路由定义
```

## 🎯 功能特性

### ✅ 已完成功能
- 🎨 **响应式首页界面** - 支持桌面端和移动端
- 🖼️ **轮播图展示** - 基于Ant Design Carousel的产品介绍
- 📁 **项目管理中心** - 项目展示、创建和管理
- 🔍 **智能搜索和筛选** - 多维度项目筛选功能
- 📊 **数据统计分析** - 集成百度统计用户行为分析
- 🎭 **品牌视觉系统** - Cerebro3D品牌标识和视觉设计

### 🚧 开发中功能
- 🛠️ **3D编辑器核心** - Three.js场景编辑器
- ⚡ **实时渲染引擎** - 高性能WebGL渲染
- 🎯 **智能建模助手** - AI辅助3D建模
- 🌐 **云端同步** - 项目云存储和协作

### 📋 规划中功能
- 🔮 **VR/AR支持** - 沉浸式3D编辑体验
- 🤖 **AI场景生成** - 智能场景自动生成
- 🔗 **API开放平台** - 第三方插件生态
- 📱 **移动端App** - 原生移动应用

## 🏗️ 架构设计

### 设计原则
- 🎯 **组件化架构** - 模块化设计，易于维护
- 🔄 **响应式设计** - 适配多种设备和屏幕尺寸
- ⚡ **性能优化** - 代码分离、懒加载、缓存策略
- 🛡️ **类型安全** - 严格的TypeScript类型系统
- 🎨 **设计系统** - 统一的视觉语言和交互规范

### 代码规范
- ✅ **TypeScript** - 严格类型检查，提升代码质量
- ✅ **路径别名** - @/统一路径导入，提升开发效率  
- ✅ **SCSS + Tailwind** - 灵活的样式系统
- ✅ **组件类型分离** - 类型定义独立管理
- ✅ **Ant Design集成** - 企业级UI组件库

## 🚀 快速开始

### 环境要求
- Node.js >= 20.0.0
- npm >= 10.0.0 或 yarn >= 1.22.0

### 安装与运行
```bash
# 克隆项目
git clone https://github.com/cerror/cerebro3d.git
cd cerebro3d

# 安装依赖
npm install

# 配置环境变量（可选）
cp .env.example .env

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 环境变量配置
```bash
# .env
VITE_BAIDU_ANALYTICS_ID=your_baidu_analytics_id
```

## 📊 项目状态

### 开发进度 (35%)
- ✅ **项目架构设计** - 完整的组件化架构
- ✅ **首页界面开发** - 响应式设计，多设备适配
- ✅ **品牌系统建设** - Cerebro3D视觉标识
- ✅ **数据分析集成** - 百度统计用户行为追踪
- 🚧 **3D编辑器核心** - 进行中
- 📋 **用户系统** - 规划中
- 📋 **云端服务** - 规划中

### 技术指标
- 📱 **响应式支持** - 768px、480px、360px断点适配
- ⚡ **构建性能** - ~3.5s构建时间，~481kB总包体积
- 🗜️ **代码压缩** - Gzip压缩率 ~68%
- 🎯 **代码质量** - TypeScript严格模式，零技术债务




## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下规范：

### 提交规范
```bash
feat: 新增功能
fix: 修复bug  
docs: 文档更新
style: 样式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
```

### 开发流程
1. Fork 项目仓库
2. 创建功能分支 `git checkout -b feature/amazing-feature`
3. 提交变更 `git commit -m 'feat: add amazing feature'`
4. 推送分支 `git push origin feature/amazing-feature`  
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 🌐 **官网**: [cerebro3d.com](https://cerebro3d.com)
- 🐙 **GitHub**: [github.com/cerror/cerebro3d](https://github.com/cerror/cerebro3d)

---

**© 2025 Cerebro3D. 让3D创作更智能！** 🧠✨ 