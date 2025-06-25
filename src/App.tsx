import React, { useEffect } from 'react';
import AppRouter from '@/routes/route';
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
      <AppRouter />
    </div>
  );
};

export default App;
