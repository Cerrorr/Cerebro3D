/**
 * RecordableSlider组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { Slider } from 'antd';
import type { SliderSingleProps } from 'antd/es/slider';

interface RecordableSliderProps extends SliderSingleProps {
  record: (msg: string) => void;
  field: string;
}

export const RecordableSlider: React.FC<RecordableSliderProps> = ({ record, field, onChange, ...rest }) => {
  return (
    <Slider
      {...rest}
      onChange={(value) => {
        record(`${field} = ${value}`);
        // @ts-ignore
        onChange?.(value);
      }}
    />
  );
}; 