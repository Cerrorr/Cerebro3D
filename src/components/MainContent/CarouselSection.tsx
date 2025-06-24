import React from 'react';
import { Carousel } from 'antd';
import { CarouselItem } from '@/types';
import { CarouselSectionProps } from '@/components/MainContent/types';
import './styles/CarouselSection.scss';

// 类型声明已移至 @/components/MainContent/types/mainContent.types.ts

/**
 * 默认轮播项数据，使用CSS渐变背景
 */
const defaultCarouselItems: CarouselItem[] = [
  {
    id: '1',
    title: '欢迎使用 Cerebro3D',
    description: '智能化Web3D编辑器，让创作更简单',
    image: '' // 使用CSS渐变替代
  },
  {
    id: '2', 
    title: '创建精美的3D场景',
    description: '拖拽式操作，所见即所得',
    image: '' // 使用CSS渐变替代
  },
  {
    id: '3',
    title: '实时预览与发布',
    description: '一键发布到Web，随时随地访问',
    image: '' // 使用CSS渐变替代
  }
];

/**
 * 轮播图区域组件
 * 使用 Ant Design Carousel 组件展示3D编辑器特性
 * 
 * @param items - 轮播图数据列表
 * @author Cerror
 * @since 2025-06-24
 */
const CarouselSection: React.FC<CarouselSectionProps> = ({ items = defaultCarouselItems }) => {
  /**
   * 获取轮播项的渐变背景样式
   * @param index - 轮播项索引
   */
  const getGradientStyle = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 蓝紫渐变
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // 粉红渐变  
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'  // 蓝青渐变
    ];
    return {
      background: gradients[index % gradients.length]
    };
  };

  /**
   * 获取轮播项的装饰图标
   * @param index - 轮播项索引
   */
  const getDecorativeIcon = (index: number) => {
    const icons = ['🚀', '✨', '🌟'];
    return icons[index % icons.length];
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