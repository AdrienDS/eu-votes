'use client';

export function debounce<T extends (...args: unknown[]) => void>(
  func: T, wait: number, immediate?: boolean
) {
  let timeout: number | undefined;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    if (immediate && !timeout) {
      func.apply(this, args);
    }
    timeout = window.setTimeout(() => {
      timeout = undefined;
      if (!immediate) {
        func.apply(this, args);
      }
    }, wait);
  };
}