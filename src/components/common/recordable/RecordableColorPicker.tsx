import React from 'react';
import { ColorPicker } from 'antd';
import type { ColorPickerProps } from 'antd/es/color-picker';
import type { Color } from 'antd/es/color-picker';

interface RecordableColorPickerProps extends ColorPickerProps {
  record: (msg: string) => void;
  field: string;
}

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