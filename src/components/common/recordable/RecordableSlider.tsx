/**
 * RecordableSlider组件
 * @author Cerror
 * @since 2025-07-08
 */

import React from 'react';
import { Slider } from 'antd';
import type { RecordableSliderProps } from './types/recordable.types';

export const RecordableSlider: React.FC<RecordableSliderProps> = ({ record, field, onChange, onAfterChange, onChangeComplete, ...rest }) => {
  return (
    <Slider
      {...rest}
      onChange={onChange}
      onChangeComplete={(value) => {
        record(`${field} = ${value}`);
        // Support both old and new API for backward compatibility
        onAfterChange?.(value);
        onChangeComplete?.(value);
      }}
    />
  );
}; 