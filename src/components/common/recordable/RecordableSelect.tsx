import { Select } from 'antd';
import type { SelectProps } from 'antd';

interface RecordableSelectProps<ValueType> extends SelectProps<ValueType> {
  record: (msg: string) => void;
  field: string;
}

export const RecordableSelect = <T extends unknown = any,>(props: RecordableSelectProps<T>) => {
  const { record, field, onChange, ...rest } = props as any;
  return (
    <Select
      {...rest}
      onChange={(value: T, option: any) => {
        record(`${field} 选择 ${value}`);
        onChange?.(value, option);
      }}
    />
  );
}; 