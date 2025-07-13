/**
 * Ant Design 主题配置
 * 统一管理项目中所有 Ant Design 组件的样式主题
 * @author Cerror
 * @since 2025-07-12
 */

import type { ThemeConfig } from 'antd';

// 项目主色调配置
const colors = {
  primary: '#4facfe',
  primaryHover: '#6db8ff',
  primaryActive: '#2e8ce6',
  
  background: {
    primary: '#1e2328',
    secondary: '#252a31',
    tertiary: '#2a2f36',
  },
  
  text: {
    primary: '#e1e8f0',
    secondary: '#8892a0',
    disabled: '#5a626c',
  },
  
  border: {
    primary: 'rgba(79, 172, 254, 0.4)',
    secondary: 'rgba(79, 172, 254, 0.2)',
    hover: 'rgba(79, 172, 254, 0.6)',
  },
  
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
};

// Ant Design 主题配置
export const antdTheme: ThemeConfig = {
  token: {
    // 基础色彩
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    
    // 背景色
    colorBgContainer: colors.background.secondary,
    colorBgElevated: colors.background.secondary,
    colorBgLayout: colors.background.primary,
    colorBgSpotlight: colors.background.secondary,
    
    // 文字色
    colorText: colors.text.primary,
    colorTextSecondary: colors.text.secondary,
    colorTextTertiary: colors.text.disabled,
    colorTextQuaternary: colors.text.disabled,
    
    // 边框色
    colorBorder: colors.border.primary,
    colorBorderSecondary: colors.border.secondary,
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 阴影
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.4)',
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // 全局token增强 - 确保focus状态统一
    colorPrimaryBorder: colors.primary,
    colorPrimaryBorderHover: colors.primaryHover,
    controlOutline: `2px solid ${colors.primary}20`, // 20为透明度
    controlOutlineWidth: 2,
    
    // hover状态统一配置
    controlItemBgHover: colors.background.tertiary,
    controlItemBgActive: colors.background.tertiary,
    
    // 边框配置增强
    lineWidth: 1,
    lineWidthBold: 2,
  },
  
  components: {
    // Modal 组件主题
    Modal: {
      contentBg: colors.background.primary,
      headerBg: 'transparent',
      titleColor: colors.text.primary,
      colorIcon: colors.text.secondary,
      colorIconHover: colors.text.primary,
    },
    
    // Tabs 组件主题
    Tabs: {
      cardBg: colors.background.secondary,
      itemColor: colors.text.secondary,
      itemSelectedColor: colors.primary,
      itemHoverColor: colors.primaryHover,
      itemActiveColor: colors.primaryActive,
      inkBarColor: colors.primary,
      cardHeight: 40,
    },
    
    // Button 组件主题
    Button: {
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorPrimaryActive: colors.primaryActive,
      defaultBg: colors.background.secondary,
      defaultColor: colors.text.primary,
      defaultBorderColor: colors.border.primary,
      defaultHoverBg: colors.background.tertiary,
      defaultHoverColor: colors.text.primary,
      defaultHoverBorderColor: colors.border.hover,
      // 确保按钮文字颜色可见
      colorText: colors.text.primary,
      colorTextLightSolid: colors.text.primary,
    },
    
    // Input 组件主题
    Input: {
      colorBgContainer: colors.background.secondary,
      colorText: colors.text.primary,
      colorTextPlaceholder: colors.text.disabled,
      colorBorder: colors.border.primary,
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.border.hover,
      // 确保背景色始终是深色 - 增强配置
      colorBgElevated: colors.background.secondary,
      colorBgSpotlight: colors.background.secondary,
      // focus状态样式修复 - 使用正确的token名称
      colorPrimaryBorder: colors.primary,
      colorPrimaryBorderHover: colors.primaryHover,
      colorPrimaryActive: colors.primaryActive,
      // 确保focus和active状态都使用主题色
      colorPrimaryHover: colors.primaryHover,
    },
    
    // Select 组件主题
    Select: {
      colorBgContainer: colors.background.secondary,
      colorText: colors.text.primary,
      colorTextPlaceholder: colors.text.disabled,
      colorBorder: colors.border.primary,
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.border.hover,
      optionSelectedBg: colors.background.tertiary,
      optionActiveBg: colors.background.tertiary,
      // focus状态样式修复
      colorPrimaryBorder: colors.primary,
      colorPrimaryBorderHover: colors.primaryHover,
      colorPrimaryActive: colors.primaryActive,
      selectorBg: colors.background.secondary,
    },
    
    // Tree 组件主题
    Tree: {
      colorBgContainer: 'transparent',
      colorText: colors.text.primary,
      colorTextLightSolid: colors.text.secondary,
      nodeSelectedBg: colors.background.tertiary,
      nodeHoverBg: colors.background.secondary,
    },
    
    // Collapse 组件主题
    Collapse: {
      colorBgContainer: colors.background.secondary,
      colorText: colors.text.primary,
      colorTextHeading: colors.text.primary,
      colorBorder: colors.border.primary,
      headerBg: colors.background.tertiary,
      contentBg: colors.background.primary,
      colorIcon: colors.primary,
      colorIconHover: colors.primaryHover,
      marginSM: 8,
    },
    
    // Upload 组件主题
    Upload: {
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorText: colors.text.primary,
      colorTextDescription: colors.text.secondary,
    },
    
    // Progress 组件主题
    Progress: {
      colorSuccess: colors.success,
      colorInfo: colors.primary,
      colorText: colors.text.primary,
    },
    
    // Switch 组件主题
    Switch: {
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorTextQuaternary: colors.text.disabled,
    },
    
    // Typography 组件主题
    Typography: {
      colorText: colors.text.primary,
      colorTextSecondary: colors.text.secondary,
      colorTextDescription: colors.text.secondary,
    },
    
    // Badge 组件主题
    Badge: {
      colorPrimary: colors.primary,
      colorError: colors.error,
      colorSuccess: colors.success,
    },
    
    // List 组件主题
    List: {
      colorText: colors.text.primary,
      colorTextDescription: colors.text.secondary,
      colorBorderSecondary: colors.border.secondary,
    },
    
    // Tooltip 组件主题
    Tooltip: {
      colorBgSpotlight: colors.background.tertiary,
      colorTextLightSolid: colors.text.primary,
    },
    
    // Popconfirm 组件主题
    Popconfirm: {
      colorBgElevated: colors.background.secondary,
      colorText: colors.text.primary,
      colorWarning: colors.warning,
    },
    
    // Divider 组件主题
    Divider: {
      colorSplit: colors.border.secondary,
      colorText: colors.text.secondary,
    },
    
    // Space 组件主题
    Space: {
      // Space 组件主要通过 token 控制
    },
    
    // Checkbox 组件主题
    Checkbox: {
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorBgContainer: colors.background.secondary,
      colorBorder: colors.border.primary,
    },
    
    // Radio 组件主题
    Radio: {
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorBgContainer: colors.background.secondary,
      colorBorder: colors.border.primary,
    },
    
    // Slider 组件主题
    Slider: {
      colorPrimary: colors.primary,
      colorPrimaryBorderHover: colors.primaryHover,
      trackBg: colors.background.tertiary,
      trackHoverBg: colors.background.tertiary,
      railBg: colors.background.secondary,
      railHoverBg: colors.background.secondary,
    },
    
    // InputNumber 组件主题
    InputNumber: {
      colorBgContainer: colors.background.secondary,
      colorText: colors.text.primary,
      colorBorder: colors.border.primary,
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.border.hover,
      // focus状态样式修复
      colorPrimaryBorder: colors.primary,
      colorPrimaryBorderHover: colors.primaryHover,
      colorPrimaryActive: colors.primaryActive,
      // 控制按钮样式
      handleHoverColor: colors.primaryHover,
      handleBorderColor: colors.border.primary,
      colorTextPlaceholder: colors.text.disabled,
    },
    
    // ColorPicker 组件主题
    ColorPicker: {
      colorBgElevated: colors.background.secondary,
      colorText: colors.text.primary,
      colorBorder: colors.border.primary,
    },
  },
  
  // 算法配置 - 使用暗色主题算法
  algorithm: [],
};

export default antdTheme;