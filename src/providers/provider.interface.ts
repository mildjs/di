import { Constructor, isConstructor, isPromise, getClassName } from "../types";

export type Factory<T> = () => T;
export type AsyncFactory<T> = Promise<T>;

/**
 * Support Constructor, string
 */
export type Token = Constructor<any> | string;

export function getTokenName(token: Token) {
  return isConstructor(token)
      ? getClassName(token)
      : token;
}

export interface ClassProvider {
  provide: any;
  useClass: Constructor<any>;
}

export interface ValueProvider {
  provide: any;
  useValue: any;
}

export interface FactoryProvider {
  provide: any;
  useFactory: Factory<any>;
}

export interface AsyncFactoryProvider {
  provide: any;
  useAsyncFactory: AsyncFactory<any>;
}

export interface ConstructorProvider extends Constructor<any> {
  provide?: any;
}

export type Provider =
  | ConstructorProvider
  | ClassProvider
  | ValueProvider
  | FactoryProvider
  | AsyncFactoryProvider;


/**
 * Utils functions
 * @param provider
 */

export function isConstructorProvider(provider: any) {
  // return provider.prototype !== undefined;
  return isConstructor(provider);
}

export function isClassProvider(provider: any): provider is ClassProvider {
  return (provider as any).useClass !== undefined;
}

export function isValueProvider(provider: any): provider is ValueProvider {
  return (provider as any).useValue !== undefined;
}

export function isFactoryProvider(provider: any): provider is FactoryProvider {
  return (provider as any).useFactory !== undefined;
}

export function isAsyncFactoryProvider(provider: any): provider is AsyncFactoryProvider {
  return (provider as any).useAsyncFactory !== undefined;
}