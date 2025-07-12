import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { store } from '@/store'
import antdTheme from '@/theme/antd-theme'
import './styles/globals.scss'
import App from '@/App.tsx'

/**
 * React应用入口文件
 * 负责将App组件挂载到DOM，并启用严格模式进行开发时检查
 * 配置 Ant Design 主题和 Redux store
 * @author Cerror
 * @since 2025-07-08
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)