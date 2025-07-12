/**
 * RecordableColorPicker组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { RecordableColorPickerProps } from './types/recordable.types';

export const RecordableColorPicker: React.FC<RecordableColorPickerProps> = ({ record, field, onChange, ...rest }) => {
  return (
    <ColorPicker
      {...rest}
      onChange={(color: Color, hex: string) => {
        const { h, s, b, a } = color.toHsb();
        const hsvInfo = `h:${Math.round(h)} s:${Math.round(s * 100)} v:${Math.round(b * 100)} a:${a?.toFixed(2)}`;
        record(`${field} = ${hex} (${hsvInfo})`);
        onChange?.(color, hex);
      }}
    />
  );
}; 