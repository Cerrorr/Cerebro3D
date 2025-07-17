/**
 * ProjectPage页面常量配置
 * 集中管理项目编辑器页面相关的常量数据
 * @author Cerror
 * @since 2025-06-25
 */

import React from 'react';
import {
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
  SettingOutlined,
} from '@ant-design/icons';
import type { ToolbarAction } from '@/components/projectEditor/topToolbar/types/Toolbar.types';
import type { SceneNode } from '@/components/projectEditor/sceneTree/types/SceneTree.types';

/**
 * 默认画布设置配置
 */
export const DEFAULT_CANVAS_SETTINGS = {
  gridVisible: true,
  axisVisible: true,
  backgroundColor: '#0a0a0a',
  cameraPosition: [5, 5, 5] as [number, number, number],
} as const;

/**
 * 默认面板配置
 */
export const DEFAULT_PANEL_CONFIG = {
  BOTTOM_PANEL_HEIGHT: 220, // 底部面板默认高度
  RIGHT_SIDEBAR_WIDTH: 320,
  RIGHT_SIDEBAR_COLLAPSED: false,
} as const;

/**
 * 工具栏左侧按钮配置
 * 定义编辑器左侧工具栏的所有按钮
 */
export const getLeftToolbarActions = (): ToolbarAction[] => [
  {
    id: 'import',
    label: '导入',
    icon: React.createElement(ImportOutlined),
    onClick: () => console.log('导入文件'),
  },
  // 暂时隐藏撤回和重做按钮
  // {
  //   id: 'undo',
  //   label: '撤回',
  //   icon: React.createElement(UndoOutlined),
  //   onClick: () => console.log('撤回操作'),
  //   disabled: true,
  // },
  // {
  //   id: 'redo',
  //   label: '重做',
  //   icon: React.createElement(RedoOutlined),
  //   onClick: () => console.log('重做操作'),
  //   disabled: true,
  // },
  {
    id: 'delete',
    label: '删除',
    icon: React.createElement(DeleteOutlined),
    onClick: () => console.log('删除选中对象'),
  },
  {
    id: 'clear',
    label: '清空',
    icon: React.createElement(ClearOutlined),
    onClick: () => console.log('清空场景'),
  },
  {
    id: 'copy',
    label: '复制',
    icon: React.createElement(CopyOutlined),
    onClick: () => console.log('复制选中对象'),
  },
];

/**
 * 工具栏右侧按钮配置
 * 定义编辑器右侧工具栏的所有按钮
 */
export const RIGHT_TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    id: 'fullscreen',
    label: '全屏',
    icon: React.createElement(FullscreenOutlined),
    onClick: () => console.log('切换全屏模式'),
  },
  {
    id: 'export',
    label: '导出',
    icon: React.createElement(ExportOutlined),
    onClick: () => console.log('导出项目'),
  },
  {
    id: 'save',
    label: '保存',
    icon: React.createElement(SaveOutlined),
    onClick: () => console.log('保存项目'),
  },
  {
    id: 'preview',
    label: '预览',
    icon: React.createElement(EyeOutlined),
    onClick: () => console.log('预览模式'),
  },
  {
    id: 'settings',
    label: '设置',
    icon: React.createElement(SettingOutlined),
    onClick: () => console.log('打开设置'),
  },
] as const;

/**
 * 模拟场景树数据配置
 * 定义3D场景的层级结构和对象
 */
export const MOCK_SCENE_NODES: readonly SceneNode[] = [
  {
    id: 'scene',
    name: 'Scene',
    type: 'scene',
    expanded: true,
    visible: true,
    children: [
      // 透视相机（二级节点）
      {
        id: 'perspective-camera',
        name: '透视相机',
        type: 'camera',
        visible: true,
      },
      // 环境光（二级节点）
      {
        id: 'ambient-light',
        name: '环境光',
        type: 'light',
        visible: true,
      },
      // 方向光（二级节点）
      {
        id: 'directional-light',
        name: '方向光',
        type: 'light',
        visible: true,
      },
    ],
  },
] as const;
