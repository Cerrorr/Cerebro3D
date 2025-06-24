import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.scss'
import App from '@/App.tsx'

/**
 * React应用入口文件
 * 负责将App组件挂载到DOM，并启用严格模式进行开发时检查
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)