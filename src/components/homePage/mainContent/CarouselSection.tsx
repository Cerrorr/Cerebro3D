import React from 'react';
import { Carousel } from 'antd';
import { CarouselSectionProps } from './types';
import { 
  DEFAULT_CAROUSEL_ITEMS, 
  CAROUSEL_GRADIENTS, 
  CAROUSEL_ICONS 
} from './constants';
import './styles/CarouselSection.scss';

// 类型声明已移至 @/components/homePage/mainContent/types/MainContent.types.ts

// 使用常量文件中的默认轮播数据

/**
 * 轮播图区域组件
 * 使用 Ant Design Carousel 组件展示3D编辑器特性
 * 
 * @param items - 轮播图数据列表
 * @author Cerror
 * @since 2025-06-25
 */
const CarouselSection: React.FC<CarouselSectionProps> = ({ items = DEFAULT_CAROUSEL_ITEMS }) => {
  /**
   * 获取轮播项的渐变背景样式
   * @param index - 轮播项索引
   */
  const getGradientStyle = (index: number) => {
    return {
      background: CAROUSEL_GRADIENTS[index % CAROUSEL_GRADIENTS.length]
    };
  };

  /**
   * 获取轮播项的装饰图标
   * @param index - 轮播项索引
   */
  const getDecorativeIcon = (index: number) => {
    return CAROUSEL_ICONS[index % CAROUSEL_ICONS.length];
  };

  if (!items || items.length === 0) {
    return (
      <section className="carousel-section">
        <div className="carousel-placeholder">
          <span>暂无轮播内容</span>
        </div>
      </section>
    );
  }

  return (
    <section className="carousel-section">
      <Carousel 
        autoplay
        autoplaySpeed={5000}
        dots={{ className: 'custom-carousel-dots' }}
        dotPosition="bottom"
        effect="fade"
        className="custom-carousel"
      >
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="carousel-slide">
              {/* 使用渐变背景和装饰图标 */}
              <div 
                className="carousel-gradient-bg"
                style={getGradientStyle(index)}
              >
                <div className="carousel-decoration">
                  <span className="decoration-icon">
                    {getDecorativeIcon(index)}
                  </span>
                  <div className="decoration-pattern"></div>
                </div>
              </div>
              
              <div className="carousel-content">
                <h2 className="carousel-title">{item.title}</h2>
                <p className="carousel-description">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default CarouselSection; 