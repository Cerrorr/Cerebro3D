/**
 * ProjectPage页面常量配置
 * 集中管理项目编辑器页面相关的常量数据
 * @author Cerror
 * @since 2025-06-25
 */

import React from 'react';
import {
  ArrowLeftOutlined,
  ImportOutlined,
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  ClearOutlined,
  CopyOutlined,
  FullscreenOutlined,
  ExportOutlined,
  SaveOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { ToolbarAction, SceneNode } from '@/components/ProjectEditor/types';

/**
 * 默认画布设置配置
 */
export const DEFAULT_CANVAS_SETTINGS = {
  gridVisible: true,
  axisVisible: true,
  backgroundColor: '#0a0a0a',
  cameraPosition: [5, 5, 5] as [number, number, number]
} as const;

/**
 * 默认面板配置
 */
export const DEFAULT_PANEL_CONFIG = {
  BOTTOM_PANEL_HEIGHT: 120,
  RIGHT_SIDEBAR_WIDTH: 320,
  RIGHT_SIDEBAR_COLLAPSED: false
} as const;

/**
 * 工具栏左侧按钮配置
 * 定义编辑器左侧工具栏的所有按钮
 */
export const getLeftToolbarActions = (navigate: (path: string) => void): ToolbarAction[] => [
  {
    id: 'home',
    label: '返回首页',
    icon: React.createElement(ArrowLeftOutlined),
    onClick: () => navigate('/')
  },
  {
    id: 'import',
    label: '导入',
    icon: React.createElement(ImportOutlined),
    onClick: () => console.log('导入文件')
  },
  {
    id: 'undo',
    label: '撤回',
    icon: React.createElement(UndoOutlined),
    onClick: () => console.log('撤回操作'),
    disabled: true
  },
  {
    id: 'redo',
    label: '重做',
    icon: React.createElement(RedoOutlined),
    onClick: () => console.log('重做操作'),
    disabled: true
  },
  {
    id: 'delete',
    label: '删除',
    icon: React.createElement(DeleteOutlined),
    onClick: () => console.log('删除选中对象')
  },
  {
    id: 'clear',
    label: '清空',
    icon: React.createElement(ClearOutlined),
    onClick: () => console.log('清空场景')
  },
  {
    id: 'copy',
    label: '复制',
    icon: React.createElement(CopyOutlined),
    onClick: () => console.log('复制选中对象')
  },
  {
    id: 'fullscreen',
    label: '全屏',
    icon: React.createElement(FullscreenOutlined),
    onClick: () => console.log('切换全屏模式')
  }
];

/**
 * 工具栏右侧按钮配置
 * 定义编辑器右侧工具栏的所有按钮
 */
export const RIGHT_TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    id: 'export',
    label: '导出',
    icon: React.createElement(ExportOutlined),
    onClick: () => console.log('导出项目')
  },
  {
    id: 'save',
    label: '保存',
    icon: React.createElement(SaveOutlined),
    onClick: () => console.log('保存项目')
  },
  {
    id: 'preview',
    label: '预览',
    icon: React.createElement(EyeOutlined),
    onClick: () => console.log('预览模式')
  },
  {
    id: 'settings',
    label: '设置',
    icon: React.createElement(SettingOutlined),
    onClick: () => console.log('打开设置')
  }
] as const;

/**
 * 模拟场景树数据配置
 * 定义3D场景的层级结构和对象
 */
export const MOCK_SCENE_NODES: readonly SceneNode[] = [
  {
    id: 'scene',
    name: '特效材质贴图',
    type: 'folder',
    expanded: true,
    visible: true,
    children: [
      {
        id: 'cameras',
        name: '默认相机',
        type: 'folder',
        expanded: true,
        visible: true,
        children: [
          {
            id: 'camera1',
            name: '正交视图',
            type: 'camera',
            visible: true
          },
          {
            id: 'camera2', 
            name: '透视视图',
            type: 'camera',
            visible: true
          }
        ]
      },
      {
        id: 'lights',
        name: '灯光',
        type: 'folder',
        expanded: true,
        visible: true,
        children: [
          {
            id: 'light1',
            name: '环境光',
            type: 'light',
            visible: true
          },
          {
            id: 'light2',
            name: '方向光',
            type: 'light',
            visible: true
          }
        ]
      },
      {
        id: 'meshes',
        name: '模型',
        type: 'folder',
        expanded: true,
        visible: true,
        children: [
          {
            id: 'cube1',
            name: '立方体',
            type: 'mesh',
            visible: true
          },
          {
            id: 'materials',
            name: '材质',
            type: 'folder',
            expanded: false,
            visible: true,
            children: [
              {
                id: 'material1',
                name: '默认材质',
                type: 'material',
                visible: true
              }
            ]
          }
        ]
      }
    ]
  }
] as const; 