import { Input } from 'antd';
import type { InputProps } from 'antd';
import type { FC, ComponentType } from 'react';

interface RecordableInputProps extends InputProps {
  record: (msg: string) => void;
  field: string;
  /** 可替换为 TextArea 等组件 */
  as?: ComponentType<any>;
  /** 行数，仅在 TextArea 时使用 */
  rows?: number;
  /** 列数，仅在 TextArea 时使用 */
  cols?: number;
}

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
      onChange={(e: any) => {
        record(`${field} = ${e.target?.value ?? ''}`);
        onChange?.(e);
      }}
    />
  );
}; 