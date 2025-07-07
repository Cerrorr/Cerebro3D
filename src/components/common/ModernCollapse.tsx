import React from 'react';
import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import type { PanelProps } from './types/ModernCollapse.types';

/**
 * ModernCollapse
 * @param children Panel 子组件
 * @param rest 其他 Collapse 属性
 */
const ModernCollapse: React.FC<CollapseProps> & { Panel: React.FC<PanelProps> } = ({ children, ...rest }) => {
  // 若调用方已经使用 items API，直接透传
  if ('items' in rest && rest.items) {
    return <Collapse {...rest} />;
  }

  // 将子 Panel 节点映射为 items 数组
  const items = React.Children.toArray(children).map(child => {
    const el = child as React.ReactElement<PanelProps>;
    return {
      key: el.key as string,
      label: el.props.header,
      children: el.props.children,
    };
  });

  return <Collapse {...rest} items={items} />;
};

// 提供占位 Panel 组件，使旧代码无需修改 Panel JSX，只需更换导入
ModernCollapse.Panel = () => null;

export default ModernCollapse; 