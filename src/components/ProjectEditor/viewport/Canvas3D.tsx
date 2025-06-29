import React, { useRef, useEffect, useState } from 'react';
import { Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import type { Canvas3DProps, ViewType } from './types';
import { 
  HomeOutlined, 
  ExpandOutlined, 
  EyeOutlined,
  EyeInvisibleOutlined,
  BoxPlotOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons';
import './styles/Canvas3D.scss';

const Canvas3D: React.FC<Canvas3DProps> = ({
  settings,
  onSettingsChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('perspective');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 模拟3D场景加载
    const loadScene = () => {
      // 设置画布大小
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // 清空画布
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 绘制网格（如果启用）
      if (settings.gridVisible) {
        drawGrid(ctx, rect.width, rect.height);
      }

      // 绘制坐标轴（如果启用）
      if (settings.axisVisible) {
        drawAxis(ctx, rect.width, rect.height);
      }

      // 绘制一个简单的3D立方体示例
      drawCube(ctx, rect.width, rect.height);

      setIsLoading(false);
    };

    // 网格绘制
    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const gridSize = 20;
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 0.5;

      // 垂直线
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 水平线
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    // 坐标轴绘制
    const drawAxis = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const axisLength = 100;

      // X轴 (红色)
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + axisLength, centerY);
      ctx.stroke();

      // Y轴 (绿色)
      ctx.strokeStyle = '#44ff44';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY - axisLength);
      ctx.stroke();

      // Z轴 (蓝色) - 简化的斜线表示
      ctx.strokeStyle = '#4444ff';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX - axisLength * 0.7, centerY + axisLength * 0.7);
      ctx.stroke();

      // 轴标签
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.fillText('X', centerX + axisLength + 5, centerY + 5);
      ctx.fillText('Y', centerX + 5, centerY - axisLength - 5);
      ctx.fillText('Z', centerX - axisLength * 0.7 - 15, centerY + axisLength * 0.7 + 15);
    };

    // 简单立方体绘制
    const drawCube = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const size = 60;

      // 立方体的八个顶点（简化3D投影）
      const vertices = [
        [centerX - size, centerY - size], // 前左上
        [centerX + size, centerY - size], // 前右上
        [centerX + size, centerY + size], // 前右下
        [centerX - size, centerY + size], // 前左下
        [centerX - size + 30, centerY - size - 30], // 后左上
        [centerX + size + 30, centerY - size - 30], // 后右上
        [centerX + size + 30, centerY + size - 30], // 后右下
        [centerX - size + 30, centerY + size - 30], // 后左下
      ];

      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1.5;

      // 绘制前面
      ctx.beginPath();
      ctx.moveTo(vertices[0][0], vertices[0][1]);
      ctx.lineTo(vertices[1][0], vertices[1][1]);
      ctx.lineTo(vertices[2][0], vertices[2][1]);
      ctx.lineTo(vertices[3][0], vertices[3][1]);
      ctx.closePath();
      ctx.stroke();

      // 绘制后面
      ctx.beginPath();
      ctx.moveTo(vertices[4][0], vertices[4][1]);
      ctx.lineTo(vertices[5][0], vertices[5][1]);
      ctx.lineTo(vertices[6][0], vertices[6][1]);
      ctx.lineTo(vertices[7][0], vertices[7][1]);
      ctx.closePath();
      ctx.stroke();

      // 连接前后面的边
      ctx.beginPath();
      ctx.moveTo(vertices[0][0], vertices[0][1]);
      ctx.lineTo(vertices[4][0], vertices[4][1]);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(vertices[1][0], vertices[1][1]);
      ctx.lineTo(vertices[5][0], vertices[5][1]);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(vertices[2][0], vertices[2][1]);
      ctx.lineTo(vertices[6][0], vertices[6][1]);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(vertices[3][0], vertices[3][1]);
      ctx.lineTo(vertices[7][0], vertices[7][1]);
      ctx.stroke();
    };

    loadScene();

    // 窗口大小变化时重新绘制
    const handleResize = () => {
      setTimeout(loadScene, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings]);

  const handleViewReset = () => {
    setCurrentView('perspective');
    console.log('重置视角');
  };

  const handleZoomExtents = () => {
    console.log('缩放到全部');
  };

  const handleToggleGrid = () => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        gridVisible: !settings.gridVisible
      });
    }
    console.log('切换网格显示:', !settings.gridVisible);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    console.log('切换视图:', view);
  };

  // 六视图选项
  const viewOptions = [
    { value: 'perspective', label: '透视视图', icon: <BoxPlotOutlined /> },
    { value: 'front', label: '前视图', icon: <ArrowUpOutlined /> },
    { value: 'back', label: '后视图', icon: <ArrowDownOutlined /> },
    { value: 'left', label: '左视图', icon: <ArrowLeftOutlined /> },
    { value: 'right', label: '右视图', icon: <ArrowRightOutlined /> },
    { value: 'top', label: '顶视图', icon: <UpOutlined /> },
    { value: 'bottom', label: '底视图', icon: <DownOutlined /> }
  ];

  const getCurrentViewOption = () => {
    return viewOptions.find(option => option.value === currentView) || viewOptions[0];
  };

  // 构建下拉菜单项
  const menuItems: MenuProps['items'] = viewOptions.map((option) => ({
    key: option.value,
    label: (
      <div className="view-menu-item">
        {option.icon}
        <span>{option.label}</span>
      </div>
    ),
    onClick: () => handleViewChange(option.value as ViewType)
  }));

  return (
    <div className={`canvas-3d`}>
      {isLoading && (
        <div className="canvas-loading">
          <div className="loading-spinner"></div>
          <span>获取场景数据中...</span>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        className="main-canvas"
      />
      
      {/* 画布控制器 - 左上角 */}
      <div className="canvas-controls">
        <div className="view-controls">
          {/* 控制按钮 */}
          <div className="control-buttons">
            {/* 六视图选择下拉菜单 */}
            <Dropdown
              menu={{ items: menuItems }}
              placement="bottomLeft"
              trigger={['click']}
            >
              <Tooltip 
                title={`当前: ${getCurrentViewOption().label}，点击选择视图`} 
                placement="bottom"
              >
                <button className="control-btn view-cycle-btn">
                  {getCurrentViewOption().icon}
                </button>
              </Tooltip>
            </Dropdown>
            <Tooltip title="重置视角 (Home)" placement="bottom">
              <button className="control-btn" onClick={handleViewReset}>
                <HomeOutlined />
              </button>
            </Tooltip>
            
            <Tooltip title="缩放到全部 (F)" placement="bottom">
              <button className="control-btn" onClick={handleZoomExtents}>
                <ExpandOutlined />
              </button>
            </Tooltip>
            
            <Tooltip 
              title={settings.gridVisible ? "隐藏网格 (G)" : "显示网格 (G)"} 
              placement="bottom"
            >
              <button 
                className={`control-btn ${settings.gridVisible ? 'active' : ''}`} 
                onClick={handleToggleGrid}
              >
                {settings.gridVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      
      {/* 渲染信息 - 右下角 */}
      <div className="render-info">
        <Tooltip title="实时渲染性能统计" placement="left">
          <div className="render-stats">
            <span>渲染时间: 16ms</span>
            <span>物体: 3</span>
            <span>顶点: 8</span>
            <span>三角面: 12</span>
            <span>视图: {viewOptions.find(v => v.value === currentView)?.label}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default Canvas3D; 