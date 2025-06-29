import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { ResizablePanelProps } from './types';
import './styles/ResizablePanel.scss';

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  initialHeight = 120,
  minHeight = 0,
  maxHeight = 300,
  position = 'bottom',
  onHeightChange
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaY = position === 'bottom' 
      ? startPosRef.current - e.clientY  // 底部面板：向上拖拽增加高度
      : e.clientY - startPosRef.current; // 顶部面板：向下拖拽增加高度

    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, startHeightRef.current + deltaY)
    );


    setHeight(newHeight);
    onHeightChange?.(newHeight);
  }, [position, minHeight, maxHeight, onHeightChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.classList.remove('resizing');
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {

    setIsDragging(true);
    startPosRef.current = e.clientY;
    startHeightRef.current = height;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.classList.add('resizing');
    
    // 防止文本选择
    e.preventDefault();
  }, [height, handleMouseMove, handleMouseUp]);

  // 双击重置高度
  const handleDoubleClick = useCallback(() => {
    setHeight(initialHeight);
    onHeightChange?.(initialHeight);
  }, [initialHeight, onHeightChange]);

  // 组件卸载时清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizing');
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={panelRef}
      className={`resizable-panel resizable-panel--${position} ${isDragging ? 'dragging' : ''}`}
      style={{ height: `${height}px` }}
    >
      <div 
        className="resizer"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title="拖拽调整高度，双击重置"
      >
        <div className="resizer-handle">
          <div className="resizer-line"></div>
          <div className="resizer-line"></div>
          <div className="resizer-line"></div>
        </div>
      </div>
      
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
};

export default ResizablePanel; 