/**
 * Constructor type
 */

export type Constructor<T> = {
  new(...args: any[]): T;
};

/**
 * Dictionary type
 */

export type Dictionary<T> = {
  [key: string]: T;
};