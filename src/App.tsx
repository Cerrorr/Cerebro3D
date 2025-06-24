import React, { useEffect } from 'react';
import HomePage from '@/pages/HomePage';
import { BaiduAnalytics } from '@/utils/analytics';
import './App.css';

/**
 * 应用根组件
 * 整合路由和全局状态管理
 */
const App: React.FC = () => {
  // 初始化百度统计
  useEffect(() => {
    BaiduAnalytics.init();
  }, []);

  return (
    <div className="App">
      <HomePage />
    </div>
  );
};

export default App;
