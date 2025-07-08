/**
 * 开发环境日志工具
 * 支持函数调用和 log / warn / error 方法，生产环境自动静默
 * @author Cerror
 * @since 2025-07-08
 */
/**
 * 基础日志输出函数
 * 开发环境下输出日志，生产环境静默
 * @param args 要输出的参数列表
 */
const baseLogger = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

/* eslint-disable no-console */
/**
 * 输出普通日志
 * @param args 要输出的参数列表
 */
baseLogger.log = (...args: unknown[]): void => {
  if (import.meta.env.DEV) console.log(...args);
};

/**
 * 输出警告日志
 * @param args 要输出的参数列表
 */
baseLogger.warn = (...args: unknown[]): void => {
  if (import.meta.env.DEV) console.warn(...args);
};

/**
 * 输出错误日志
 * @param args 要输出的参数列表
 */
baseLogger.error = (...args: unknown[]): void => {
  if (import.meta.env.DEV) console.error(...args);
};
/* eslint-enable no-console */

export const devLog = baseLogger as typeof baseLogger & {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}; 