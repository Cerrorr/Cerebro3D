/**
 * devLog
 * 开发环境日志工具，支持函数调用和 log / warn / error 方法
 * 生产环境自动静默
 * @author Cerror
 * @since 2025-06-29
 */
// 基础输出函数
function baseLogger(...args: unknown[]): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

/* eslint-disable no-console */
baseLogger.log = (...args: unknown[]): void => {
  if (import.meta.env.DEV) console.log(...args);
};

baseLogger.warn = (...args: unknown[]): void => {
  if (import.meta.env.DEV) console.warn(...args);
};

baseLogger.error = (...args: unknown[]): void => {
  if (import.meta.env.DEV) console.error(...args);
};
/* eslint-enable no-console */

export const devLog = baseLogger as typeof baseLogger & {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}; 