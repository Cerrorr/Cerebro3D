import { Select } from 'antd';
import type { RecordableSelectProps } from './types/recordable.types';

/**
 * RecordableSelect - 带记录功能的选择框组件
 * @param record 记录函数
 * @param field 字段名称
 * @param onChange 变化事件
 * @param rest 其他属性
 */
export const RecordableSelect = <T extends unknown = string>(props: RecordableSelectProps<T>) => {
  const { record, field, onChange, ...rest } = props;
  return (
    <Select<T>
      {...rest}
      onChange={(value: T, option: any) => {
        record(`${field} 选择 ${value}`);
        onChange?.(value, option);
      }}
    />
  );
}; 