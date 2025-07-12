/**
 * Recordable 组件类型定义
 * @author Cerror
 * @since 2025-07-07
 */

import React from 'react';
import type { 
  ButtonProps, 
  InputProps, 
  SelectProps, 
  CheckboxProps,
  SwitchProps
} from 'antd';
import type { SliderSingleProps } from 'antd/es/slider';
import type { InputNumberProps } from 'antd/es/input-number';
import type { ColorPickerProps } from 'antd/es/color-picker';

/**
 * 记录函数类型
 */
export type RecordFunction = (msg: string) => void;

/**
 * 带记录功能的按钮组件属性
 */
export interface RecordableButtonProps extends ButtonProps {
  // 记录函数
  record: RecordFunction;
  // 操作描述
  desc: string;
}

/**
 * 带记录功能的输入框组件属性
 */
export interface RecordableInputProps extends InputProps {
  // 记录函数
  record: RecordFunction;
  // 字段名称
  field: string;
  // 可替换为 TextArea 等组件
  as?: React.ComponentType<any>;
  // 行数，仅在 TextArea 时使用
  rows?: number;
  // 列数，仅在 TextArea 时使用
  cols?: number;
}

/**
 * 带记录功能的选择框组件属性
 */
export interface RecordableSelectProps<T = any> extends SelectProps<T> {
  // 记录函数
  record: RecordFunction;
  // 字段名称
  field: string;
}

/**
 * 带记录功能的复选框组件属性
 */
export interface RecordableCheckboxProps extends CheckboxProps {
  // 记录函数
  record: RecordFunction;
  // 字段名称
  field: string;
}

/**
 * 带记录功能的开关组件属性
 */
export interface RecordableSwitchProps extends SwitchProps {
  // 记录函数
  record: RecordFunction;
  // 字段名称
  field: string;
}

/**
 * 带记录功能的滑块组件属性
 */
export interface RecordableSliderProps extends SliderSingleProps {
  // 记录函数
  record: RecordFunction;
  // 字段名称
  field: string;
}

/**
 * 带记录功能的数字输入框组件属性
 */
export interface RecordableInputNumberProps extends InputNumberProps {
  // 记录函数
  record: RecordFunction;
  // 字段名称
  field: string;
}

/**
 * 带记录功能的颜色选择器组件属性
 */
export interface RecordableColorPickerProps extends ColorPickerProps {
  // 记录函数
  record: RecordFunction;
  // 字段名称
  field: string;
}

/**
 * 通用记录组件属性基类
 */
export interface BaseRecordableProps {
  // 记录函数
  record: RecordFunction;
  // 字段名称或操作描述
  field?: string;
  // 操作描述
  desc?: string;
}