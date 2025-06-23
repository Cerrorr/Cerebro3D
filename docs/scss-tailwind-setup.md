# 🎨 SCSS + Tailwind CSS 安装配置指南

## 📦 安装依赖

### 1. 安装Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. 安装SCSS支持
```bash
npm install -D sass
```

### 3. 安装Tailwind插件
```bash
npm install -D @tailwindcss/forms @tailwindcss/typography
```

## ⚙️ 配置文件设置

### 1. Tailwind配置 (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 自定义颜色系统 - 与项目主题保持一致
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#667eea',  // 主色调
          600: '#5a67d8',
          700: '#4c51bf',
          800: '#434190',
          900: '#3c366b',
        },
        secondary: {
          500: '#764ba2',
          600: '#6b46c1',
          700: '#553c9a',
        },
        // 中性色彩
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      // 自定义字体
      fontFamily: {
        'sans': [
          'Inter', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'sans-serif'
        ],
        'mono': ['Fira Code', 'monospace'],
      },
      // 自定义圆角
      borderRadius: {
        '4xl': '2rem',
      },
      // 自定义动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            transform: 'translateY(10px)', 
            opacity: '0' 
          },
          '100%': { 
            transform: 'translateY(0)', 
            opacity: '1' 
          },
        },
        bounceGentle: {
          '0%, 100%': { 
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': { 
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        }
      },
      // 自定义阴影
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
        'strong': '0 10px 40px 0 rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 2. PostCSS配置 (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Vite配置更新 (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "src/styles/variables.scss";
          @import "src/styles/mixins.scss";
        `
      }
    }
  }
})
```

## 🗂️ 创建样式文件结构

### 1. 创建SCSS基础文件
```bash
mkdir -p src/styles
```

### 2. 变量文件 (`src/styles/variables.scss`)
```scss
// 设计token变量 - 与Tailwind配置同步
$primary-colors: (
  50: #eff6ff,
  100: #dbeafe,
  500: #667eea,
  600: #5a67d8,
  700: #4c51bf,
  900: #3c366b
);

$secondary-colors: (
  500: #764ba2,
  600: #6b46c1,
  700: #553c9a
);

$gray-colors: (
  50: #f9fafb,
  100: #f3f4f6,
  200: #e5e7eb,
  500: #6b7280,
  800: #1f2937,
  900: #111827
);

// 间距系统
$spacing: (
  xs: 0.25rem,   // 4px
  sm: 0.5rem,    // 8px  
  md: 1rem,      // 16px
  lg: 1.5rem,    // 24px
  xl: 2rem,      // 32px
  2xl: 3rem,     // 48px
  3xl: 4rem,     // 64px
);

// 断点系统
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  2xl: 1536px
);

// Z-index层级
$z-indexes: (
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal-backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
);
```

### 3. 混入文件 (`src/styles/mixins.scss`)
```scss
// 响应式混入
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "Invalid breakpoint: #{$breakpoint}";
  }
}

// 按钮样式混入
@mixin button-base {
  @apply inline-flex items-center justify-center;
  @apply font-medium rounded-lg;
  @apply transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

@mixin button-size($size: md) {
  @if $size == sm {
    @apply px-3 py-1.5 text-sm;
  } @else if $size == md {
    @apply px-4 py-2 text-base;
  } @else if $size == lg {
    @apply px-6 py-3 text-lg;
  }
}

// 卡片样式混入
@mixin card-base {
  @apply bg-white rounded-xl border;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

// 渐变背景混入
@mixin gradient-primary {
  background: linear-gradient(135deg, 
    map-get($primary-colors, 500) 0%, 
    map-get($secondary-colors, 500) 100%
  );
}

// 文本截断混入
@mixin text-ellipsis($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

// 居中混入
@mixin center($direction: both) {
  @if $direction == both {
    @apply flex items-center justify-center;
  } @else if $direction == horizontal {
    @apply flex justify-center;
  } @else if $direction == vertical {
    @apply flex items-center;
  }
}
```

### 4. 全局样式文件 (`src/styles/globals.scss`)
```scss
// 导入Tailwind基础样式
@tailwind base;
@tailwind components;
@tailwind utilities;

// 自定义基础样式
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply text-gray-900 antialiased;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  }
  
  // 选中文本样式
  ::selection {
    @apply bg-primary-100 text-primary-900;
  }
}

// 自定义组件样式层
@layer components {
  // 自定义按钮组件
  .btn {
    @include button-base;
    
    &.btn-primary {
      @apply bg-primary-500 text-white;
      @apply hover:bg-primary-600;
      @apply focus:ring-primary-500;
    }
    
    &.btn-secondary {
      @apply bg-gray-200 text-gray-900;
      @apply hover:bg-gray-300;
      @apply focus:ring-gray-500;
    }
    
    &.btn-sm {
      @include button-size(sm);
    }
    
    &.btn-lg {
      @include button-size(lg);
    }
  }
  
  // 自定义卡片组件
  .card {
    @include card-base;
    @apply p-6;
  }
  
  // 自定义输入框
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
    @apply placeholder-gray-400;
  }
}

// 自定义工具类
@layer utilities {
  // 渐变文本
  .gradient-text {
    @include gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  // 毛玻璃效果
  .glass {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
  
  // 文本截断工具类
  .text-ellipsis-1 { @include text-ellipsis(1); }
  .text-ellipsis-2 { @include text-ellipsis(2); }
  .text-ellipsis-3 { @include text-ellipsis(3); }
}
```

## 🔧 更新现有文件

### 1. 更新 `src/index.css` → `src/styles/globals.scss`
将原来的`index.css`重命名并转换为SCSS格式，保留所有现有样式。

### 2. 更新 `src/main.tsx`
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.scss'  // 更新导入路径

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 🎯 使用示例

### 组件样式示例
```tsx
// src/components/Button/Button.tsx
import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children,
  onClick 
}) => {
  return (
    <button 
      className={`
        btn btn-${variant} btn-${size}
        ${styles.customButton}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
```

```scss
// src/components/Button/Button.module.scss
.customButton {
  // 复杂的自定义样式，Tailwind无法处理的
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}
```

## 🚀 开发工作流

1. **优先使用Tailwind**: 对于常见样式，首先考虑Tailwind工具类
2. **SCSS补充**: 处理复杂样式、动画、伪元素等
3. **模块化**: 组件样式使用`.module.scss`文件
4. **全局样式**: 仅在`globals.scss`中定义真正的全局样式
5. **变量同步**: 保持SCSS变量与Tailwind配置的一致性

这样的配置让您既能享受Tailwind的快速开发体验，又能利用SCSS的强大功能处理复杂样式需求！🎨 