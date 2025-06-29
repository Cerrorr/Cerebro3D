import {
  FolderOpenOutlined,
  PlayCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type {
  LogEntry,
  AssetCategory,
  AssetTab,
  MockAssetDataType,
  BottomPanelOption
} from '../types';

/**
 * 底部面板常量配置
 * @author Cerror
 * @since 2025-06-25
 */

/** 模拟日志数据 */
export const MOCK_LOG_DATA: LogEntry[] = [
  {
    time: '2025/6/25 17:09:56',
    level: 'info',
    message: '[WebSocket] 连接成功'
  },
  {
    time: '2025/6/25 17:09:45',
    level: 'info', 
    message: '3D场景初始化完成'
  },
  {
    time: '2025/6/25 17:09:32',
    level: 'warn',
    message: '材质加载缓慢，建议优化纹理大小'
  },
  {
    time: '2025/6/25 17:09:28',
    level: 'info',
    message: '模型文件加载成功: character.fbx'
  },
  {
    time: '2025/6/25 17:09:15',
    level: 'error',
    message: '纹理文件丢失: textures/metal_01.jpg'
  },
  {
    time: '2025/6/25 17:09:12',
    level: 'info',
    message: '项目文件读取完成'
  },
  {
    time: '2025/6/25 17:09:08',
    level: 'info',
    message: '编辑器启动成功'
  }
];

/** 资源分类配置 */
export const ASSET_CATEGORIES: AssetCategory[] = [
  {
    key: 'model',
    label: '模型',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-10-5z"/>
      </svg>
    )
  },
  {
    key: 'particle',
    label: '粒子',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <circle cx="12" cy="12" r="3"/>
        <circle cx="6" cy="6" r="2"/>
        <circle cx="18" cy="6" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
      </svg>
    )
  },
  {
    key: 'billboard',
    label: '广告牌',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    )
  },
  {
    key: 'panel',
    label: '面板',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
      </svg>
    )
  }
];

/** 资源标签页配置 */
export const ASSET_TABS: AssetTab[] = [
  { key: 'icon', label: '图标' },
  { key: 'text', label: '文本' }
];

/** 模拟资源数据 */
export const MOCK_ASSET_DATA: MockAssetDataType = {
  model: {
    icon: [
      { id: '1', name: '角色模型', color: '#FF6B6B' },
      { id: '2', name: '建筑模型', color: '#4ECDC4' },
      { id: '3', name: '车辆模型', color: '#45B7D1' },
      { id: '4', name: '植物模型', color: '#96CEB4' },
      { id: '5', name: '家具模型', color: '#FFEAA7' },
      { id: '6', name: '道具模型', color: '#DDA0DD' }
    ],
    text: [
      { id: '1', name: 'character.fbx', color: '#FF6B6B' },
      { id: '2', name: 'building.obj', color: '#4ECDC4' },
      { id: '3', name: 'car.glb', color: '#45B7D1' },
      { id: '4', name: 'tree.fbx', color: '#96CEB4' }
    ]
  },
  particle: {
    icon: [
      { id: '1', name: '火焰特效', color: '#FF4757' },
      { id: '2', name: '烟雾特效', color: '#747D8C' },
      { id: '3', name: '爆炸特效', color: '#FF6348' },
      { id: '4', name: '星光特效', color: '#FFD700' }
    ],
    text: [
      { id: '1', name: 'fire_effect.json', color: '#FF4757' },
      { id: '2', name: 'smoke_system.json', color: '#747D8C' },
      { id: '3', name: 'explosion.json', color: '#FF6348' }
    ]
  },
  billboard: {
    icon: [
      { id: '1', name: '标识牌', color: '#5F27CD' },
      { id: '2', name: '广告板', color: '#00D2D3' },
      { id: '3', name: '指示牌', color: '#FF9FF3' }
    ],
    text: [
      { id: '1', name: 'sign_board.png', color: '#5F27CD' },
      { id: '2', name: 'ad_banner.jpg', color: '#00D2D3' }
    ]
  },
  panel: {
    icon: [
      { id: '1', name: '控制面板', color: '#2ED573' },
      { id: '2', name: '信息面板', color: '#1E90FF' },
      { id: '3', name: '设置面板', color: '#FFA502' }
    ],
    text: [
      { id: '1', name: 'control_ui.json', color: '#2ED573' },
      { id: '2', name: 'info_panel.xml', color: '#1E90FF' }
    ]
  }
};

/** 面板类型选项配置 */
export const PANEL_OPTIONS: readonly BottomPanelOption[] = [
  {
    value: 'assets',
    label: '资源中心',
    icon: <FolderOpenOutlined />,
    description: '项目资源管理'
  },
  {
    value: 'animation',
    label: '动画编辑器',
    icon: <PlayCircleOutlined />,
    description: '动画时间轴和关键帧编辑'
  },
  {
    value: 'console',
    label: '日志',
    icon: <FileTextOutlined />,
    description: '系统日志和调试信息'
  }
] as const; 