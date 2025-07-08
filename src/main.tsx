import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.scss'
import App from '@/App.tsx'
import { Provider } from 'react-redux'
import { store } from '@/store'

/**
 * React应用入口文件
 * 负责将App组件挂载到DOM，并启用严格模式进行开发时检查
 * @author Cerror
 * @since 2025-07-08
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)