import { Type } from "./type";

export class InjectionToken {
  constructor(public injectionIdentifier: string) {}

  toString(){
    return `InjectionToken '${this.injectionIdentifier}'`;
  }  
}

export type Factory<T> = () => T;

export type Token = Type<any> | InjectionToken;

export interface ClassProvider {
  provide: any;
  useClass: Type<any>;
}

export interface ValueProvider {
  provide: any;
  useValue: any;
}

export interface FactoryProvider {
  provide: any;
  useFactory: Factory<any>;
}

export interface TypeProvider extends Type<any> {
  provide?: any;
}

export type Provider =
  | TypeProvider
  | ClassProvider
  | ValueProvider
  | FactoryProvider;

/**
 * Utils functions
 * @param provider
 */

export function isTypeProvider(provider: any) {
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
