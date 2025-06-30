import React from 'react';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';

interface RecordableCheckboxProps extends CheckboxProps {
  record: (msg: string) => void;
  field: string;
}

export const RecordableCheckbox: React.FC<RecordableCheckboxProps> = ({ record, field, onChange, ...rest }) => {
  return (
    <Checkbox
      {...rest}
      onChange={(e) => {
        record(`${field} → ${e.target.checked}`);
        onChange?.(e);
      }}
    />
  );
}; 