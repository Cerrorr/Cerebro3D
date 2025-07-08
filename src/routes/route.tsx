import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ProjectEditorPage from '@/pages/ProjectEditorPage';

/**
 * 路由配置
 * 定义应用的所有路由规则
 * @author Cerror
 * @since 2025-07-08 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/project/:projectId?',
    element: <ProjectEditorPage />,
  },
  {
    path: '/home',
    element: <Navigate to="/" replace />,
  },
  // 404页面重定向到首页
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

/**
 * 路由提供者组件
 * 为整个应用提供路由功能
 * @returns 路由提供者React组件
 */
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;  