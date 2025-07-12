/**
 * RecordableSwitch组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { Switch } from 'antd';
import type { RecordableSwitchProps } from './types/recordable.types';

export const RecordableSwitch: React.FC<RecordableSwitchProps> = ({ record, field, onChange, ...rest }) => {
  return (
    <Switch
      {...rest}
      onChange={(checked, event) => {
        record(`${field} → ${checked}`);
        onChange?.(checked, event);
      }}
    />
  );
}; 