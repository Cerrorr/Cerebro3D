/**
 * RecordableCheckbox组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { Checkbox } from 'antd';
import type { RecordableCheckboxProps } from './types/recordable.types';

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