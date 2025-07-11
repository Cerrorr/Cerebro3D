import React from 'react';
import AppRouter from '@/routes/route';
import './App.css';

/**
 * 应用根组件
 * 整合路由和全局状态管理
 * @author Cerror
 * @since 2025-07-08
 */
const App: React.FC = () => {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
};

export default App;
