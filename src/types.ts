/**
 * Constructor type
 */

export type Constructor<T> = {
  // tslint:disable-next-line:callable-types
  new(...args: any[]): T;
};

export function isConstructor(value: any): value is Constructor<any> {
  return typeof value === "function";
}

export function getClassName(value: Constructor<any>) {
  return Object.create(value.prototype).constructor.name;
}

/**
 * Dictionary type
 */

export type Dictionary<T> = {
  [key: string]: T;
};

/**
 * Promise type
 * https://gist.github.com/mildronize/5f73230c8e2d692770d2a9326faefe2b
 */

export function isPromise(p: any) {
  return p && Object.prototype.toString.call(p) === "[object Promise]";
}