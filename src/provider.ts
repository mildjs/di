import { Constructor, isConstructor, isPromise } from "./types";

export type Factory<T> = () => T;

/**
 * Support Constructor, string and Symbol
 */
export type Token = Constructor<any> | string;

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

export interface FactoryAsyncProvider {
  provide: any;
  useFactoryAsync: Promise<Factory<any>>;
}

export interface ConstructorProvider extends Constructor<any> {
  provide?: any;
}

export type Provider =
  | ConstructorProvider
  | ClassProvider
  | ValueProvider
  | FactoryProvider
  | FactoryAsyncProvider ;
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

export function isFactoryAsyncProvider(provider: any): provider is FactoryAsyncProvider {
  return (provider as any).useFactoryAsync !== undefined;
}
