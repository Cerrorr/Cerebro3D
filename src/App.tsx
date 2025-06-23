import React from 'react';
import HomePage from './pages/HomePage';
import './App.css';

/**
 * 应用根组件
 * 整合路由和全局状态管理
 */
const App: React.FC = () => {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
};

export default App;
