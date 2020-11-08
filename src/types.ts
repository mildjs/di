/**
 * Constructor type
 */

export type Constructor<T> = {
  // tslint:disable-next-line:callable-types
  new (...args: any[]): T;
};

export function isConstructor(value: any): value is Constructor<any> {
  return typeof value === "function";
}

/**
 * Dictionary type
 */

export type Dictionary<T> = {
  [key: string]: T;
};
