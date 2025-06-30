import React from 'react';
import { InputNumber } from 'antd';
import type { InputNumberProps } from 'antd';

interface RecordableInputNumberProps extends InputNumberProps {
  record: (msg: string) => void;
  field: string;
}

export const RecordableInputNumber: React.FC<RecordableInputNumberProps> = ({ record, field, onChange, ...rest }) => {
  return (
    <InputNumber
      {...rest}
      onChange={(value) => {
        record(`${field} = ${value}`);
        onChange?.(value);
      }}
    />
  );
}; 