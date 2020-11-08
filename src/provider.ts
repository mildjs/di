import { Constructor } from "./types";
import { InjectionToken } from './injection-token';

export type Factory<T> = () => T;
export type Token = Constructor<any> | InjectionToken<any>;

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

export interface ConstructorProvider extends Constructor<any> {
  provide?: any;
}

export type Provider =
  | ConstructorProvider
  | ClassProvider
  | ValueProvider
  | FactoryProvider;
/**
 * Utils functions
 * @param provider
 */

export function isConstructorProvider(provider: any) {
  return provider.prototype !== undefined;
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
