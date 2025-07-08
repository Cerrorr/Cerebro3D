import React from 'react';
import { Button } from 'antd';
import type { RecordableButtonProps } from './types/recordable.types';

/**
 * RecordableButton - 带记录功能的按钮组件
 * @param record 记录函数
 * @param desc 操作描述
 * @param onClick 点击事件
 * @param rest 其他 Button 属性
 * @author Cerror
 * @since 2025-07-08 */
export const RecordableButton: React.FC<RecordableButtonProps> = ({ record, desc, onClick, ...rest }) => {
  return (
    <Button
      {...rest}
      onClick={(e) => {
        record(desc);
        onClick?.(e);
      }}
    />
  );
}; 