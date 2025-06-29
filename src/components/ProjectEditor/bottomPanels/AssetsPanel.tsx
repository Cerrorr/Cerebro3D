import React, { useState, useCallback } from 'react';
import type { 
  AssetCategory,
  AssetTab,
  AssetItem,
  AssetsPanelProps
} from './types';
import {
  ASSET_CATEGORIES,
  ASSET_TABS,
  MOCK_ASSET_DATA
} from './constants/BottomPanel.constants';

/**
 * 资源面板组件
 * 提供项目资源的分类浏览和管理功能
 * @author Cerror
 * @since 2025-06-25
 */
const AssetsPanel: React.FC<AssetsPanelProps> = ({
  onAssetSelect
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('model');
  const [activeAssetTab, setActiveAssetTab] = useState<string>('icon');

  /**
   * 处理资源分类切换
   * @param categoryKey 分类key
   */
  const handleCategoryChange = useCallback((categoryKey: string) => {
    setActiveCategory(categoryKey);
  }, []);

  /**
   * 处理资源标签页切换
   * @param tabKey 标签页key
   */
  const handleAssetTabChange = useCallback((tabKey: string) => {
    setActiveAssetTab(tabKey);
  }, []);

  /**
   * 处理资源点击
   * @param asset 资源数据
   */
  const handleAssetClick = useCallback((asset: AssetItem) => {
    onAssetSelect?.(asset);
  }, [onAssetSelect]);

  /**
   * 渲染资源图标
   * @param category 分类key
   * @returns 对应的图标元素
   */
  const renderAssetIcon = (category: string) => {
    switch (category) {
      case 'model':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7l-10-5z"/>
          </svg>
        );
      case 'particle':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <circle cx="12" cy="12" r="3"/>
            <circle cx="6" cy="6" r="2"/>
            <circle cx="18" cy="6" r="2"/>
            <circle cx="6" cy="18" r="2"/>
            <circle cx="18" cy="18" r="2"/>
          </svg>
        );
      case 'billboard':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'panel':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // 获取当前分类和标签页的资源数据
  const currentAssets = MOCK_ASSET_DATA[activeCategory as keyof typeof MOCK_ASSET_DATA]?.[activeAssetTab as keyof typeof MOCK_ASSET_DATA.model] || [];

  return (
    <div className="assets-content">
      <div className="assets-sidebar">
        <div className="asset-categories">
          {ASSET_CATEGORIES.map((category: AssetCategory) => (
            <div 
              key={category.key}
              className={`category-item ${activeCategory === category.key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.key)}
            >
              <div className="category-icon">
                {category.icon}
              </div>
              <span className="category-label">{category.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="assets-main">
        <div className="assets-toolbar">
          <div className="asset-tabs">
            {ASSET_TABS.map((tab: AssetTab) => (
              <div 
                key={tab.key}
                className={`asset-tab ${activeAssetTab === tab.key ? 'active' : ''}`}
                onClick={() => handleAssetTabChange(tab.key)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="assets-grid">
          {currentAssets.map((asset: AssetItem) => (
            <div 
              key={asset.id} 
              className="asset-item"
              onClick={() => handleAssetClick(asset)}
            >
              <div className="asset-preview">
                <div className="asset-icon" style={{ 
                  backgroundColor: asset.color 
                }}>
                  {renderAssetIcon(activeCategory)}
                </div>
              </div>
              <div className="asset-name">{asset.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetsPanel; 