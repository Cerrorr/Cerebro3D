/**
 * Recordable 组件统一导出
 * @author Cerror
 * @since 2025-07-07
 */

// 导出所有类型
export * from './types/recordable.types';

// 导出所有组件（使用简短别名）
export { RecordableInput as RInput } from './RecordableInput';
export { RecordableSwitch as RSwitch } from './RecordableSwitch';
export { RecordableSelect as RSelect } from './RecordableSelect';
export { RecordableButton as RButton } from './RecordableButton';
export { RecordableInputNumber as RInputNumber } from './RecordableInputNumber';
export { RecordableColorPicker as RColorPicker } from './RecordableColorPicker';
export { RecordableSlider as RSlider } from './RecordableSlider';
export { RecordableCheckbox as RCheckbox } from './RecordableCheckbox'; 