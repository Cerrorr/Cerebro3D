/**
 * RecordableInputNumber组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { InputNumber } from 'antd';
import type { RecordableInputNumberProps } from './types/recordable.types';

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