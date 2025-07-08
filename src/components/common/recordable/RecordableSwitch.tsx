/**
 * RecordableSwitch组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { Switch } from 'antd';
import type { SwitchProps } from 'antd';

interface RecordableSwitchProps extends SwitchProps {
  record: (msg: string) => void;
  field: string;
}

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