/**
 * 通用事件处理器类型定义
 * @author Cerror
 * @since 2025-07-07
 */

import React from 'react';

/**
 * 基础输入框变化事件处理器
 */
export type InputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * 文本域变化事件处理器
 */
export type TextAreaChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

/**
 * 选择框变化事件处理器
 */
export type SelectChangeHandler<T = string> = (value: T, option: any) => void;

/**
 * 按钮点击事件处理器
 */
export type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void;

/**
 * 复选框变化事件处理器
 */
export type CheckboxChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * 单选框变化事件处理器
 */
export type RadioChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;

/**
 * 表单提交事件处理器
 */
export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;

/**
 * 键盘事件处理器
 */
export type KeyboardEventHandler = (e: React.KeyboardEvent) => void;

/**
 * 鼠标事件处理器
 */
export type MouseEventHandler = (e: React.MouseEvent) => void;

/**
 * 滚动事件处理器
 */
export type ScrollEventHandler = (e: React.UIEvent) => void;

/**
 * 拖拽事件处理器
 */
export type DragEventHandler = (e: React.DragEvent) => void;

/**
 * 通用异步事件处理器
 */
export type AsyncEventHandler<T = void> = () => Promise<T>;

/**
 * 带参数的异步事件处理器
 */
export type AsyncEventHandlerWithParams<P = any, T = void> = (params: P) => Promise<T>;

/**
 * 可选事件处理器
 */
export type OptionalEventHandler<T extends (...args: any[]) => any> = T | undefined;

/**
 * 事件处理器工厂类型
 */
export type EventHandlerFactory<T extends (...args: any[]) => any> = (...args: Parameters<T>) => T;

/**
 * 组合事件处理器
 */
export type CombinedEventHandler<T extends (...args: any[]) => any> = T | T[];

/**
 * 节流事件处理器
 */
export type ThrottledEventHandler<T extends (...args: any[]) => any> = T & { cancel: () => void };

/**
 * 防抖事件处理器
 */
export type DebouncedEventHandler<T extends (...args: any[]) => any> = T & { cancel: () => void };