import { Input } from 'antd';
import type { FC } from 'react';
import type { RecordableInputProps } from './types/recordable.types';
import type { InputChangeHandler } from '@/types/events.types';

/**
 * RecordableInput - 带记录功能的输入框组件
 * @param record 记录函数
 * @param field 字段名称
 * @param onChange 变化事件
 * @param as 组件类型
 * @param rest 其他属性
 */
export const RecordableInput: FC<RecordableInputProps> = ({
  record,
  field,
  onChange,
  as: Component = Input,
  ...rest
}) => {
  return (
    <Component
      {...rest}
      onChange={(e: Parameters<InputChangeHandler>[0]) => {
        record(`${field} = ${e.target?.value ?? ''}`);
        onChange?.(e);
      }}
    />
  );
}; 