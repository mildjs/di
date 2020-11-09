import {
  Provider,
  ConstructorProvider,
  isConstructorProvider,
  isClassProvider,
  ClassProvider,
  ValueProvider,
  FactoryAsyncProvider,
  FactoryProvider,
  isValueProvider,
  isFactoryAsyncProvider,
  Token,
  isFactoryProvider,
} from "./provider";
import { Constructor, getClassName, isConstructor } from "./types";
import { isInjectable } from "./decorators/injectable";

import { getInjectionToken } from "./decorators/inject";

type InjectableParam = Constructor<any>;

const REFLECT_PARAMS = "design:paramtypes";

interface Injector {
  get: (...args: any[]) => any;
}

export class ReflectiveInjector implements Injector {
  private providers = new Map<any, Provider>();

  static init(providers: Provider[]): ReflectiveInjector {
    const injector = new ReflectiveInjector();

    providers.forEach((provider) => {
      injector.addProvider(provider);
    });

    return injector;
  }

  addProvider(provider: Provider) {
    let parsedProvider: Provider = provider;
    if (isConstructor(provider)) {
      parsedProvider = { provide: provider, useClass: provider };
    }
    this.assertInjectableIfClassProvider(parsedProvider);
    this.providers.set(parsedProvider.provide, parsedProvider);
  }

  public get(type: Token) {
    // Inject the dependencies
    let provider = this.providers.get(type);
    if (provider === undefined && isConstructor(type)) {
      provider = { provide: type, useClass: type };
      this.assertInjectableIfClassProvider(provider);
    }
    return this.injectWithProvider(type, provider);
  }

  private injectWithProvider(type: Token, provider?: Provider) {
    if (provider === undefined) {
      throw new Error(`No provider for type ${this.getTokenName(type)}`);
    }
    if (isClassProvider(provider)) {
      return this.injectClass(provider as ClassProvider);
    } else if (isValueProvider(provider)) {
      return this.injectValue(provider as ValueProvider);
    } else if (isFactoryAsyncProvider(provider)) {
      return this.injectFactoryAsync(provider as FactoryAsyncProvider);
    } else {
      // Factory provider by process of elimination
      return this.injectFactory(provider as FactoryProvider);
    }
  }

  private assertInjectableIfClassProvider(provider: any) {
    if (isClassProvider(provider) && !isInjectable(provider.useClass)) {
      throw new Error(
        `Cannot provide ${this.getTokenName(
          provider.provide
        )} using class ${this.getTokenName(
          provider.useClass
        )}, ${this.getTokenName(provider.useClass)} isn't injectable`
      );
    }
  }

  private injectClass<T>(classProvider: ClassProvider): T {
    const target = classProvider.useClass;
    const params = this.getInjectedParams(target);
    return Reflect.construct(target, params);
  }

  private injectValue(valueProvider: ValueProvider): any {
    return valueProvider.useValue;
  }

  private injectFactory(valueProvider: FactoryProvider) {
    return valueProvider.useFactory();
  }

  private async injectFactoryAsync(valueProvider: FactoryAsyncProvider) {
    const factory = await valueProvider.useFactoryAsync;
    return factory();
  }

  private getInjectedParams<T>(target: Constructor<T>) {
    const argConstructors = Reflect.getMetadata(REFLECT_PARAMS, target) as (
      | InjectableParam
      | undefined
    )[];
    if (argConstructors === undefined) {
      return [];
    }

    return argConstructors.map((argConstructor, index) => {
      // The reflect-metadata API fails on circular dependencies, and will return undefined
      // for the argument instead.
      if (argConstructor === undefined) {
        throw new Error(
          `Injection error. Recursive dependency detected in constructor for type ${target.name} with parameter at index ${index}`
        );
      }

      const injectionTokenHandler = getInjectionToken(target, index);

      const overrideToken = injectionTokenHandler?.token || undefined;
      const actualToken =
        overrideToken === undefined ? argConstructor : overrideToken;

      if (actualToken === undefined) {
        throw new Error('Can\'t resolving the actual token (undefined)');
      }

      let provider: any;
      /**
       * Use value from the decorator, instead of getting from the provider
       */
      if (injectionTokenHandler?.value !== undefined) {
        provider = this.getInjectionTokenProvider(injectionTokenHandler.value);
      } else {
        provider = this.providers.get(actualToken);
      }

      return this.injectWithProvider(actualToken, provider);
    });
  }

  /**
   * Use value from the decorator, instead of getting from the provider
   */

  private getInjectionTokenProvider(value: any): Provider {

    if (typeof value === "function")
      return {
        provide: 'generated_token_from_InjectionTokenHandler_factory',
        useFactory: value
      } as FactoryProvider;
    else
      return {
        provide: 'generated_token_from_InjectionTokenHandler_value',
        useValue: value
      } as ValueProvider;

  }

  private getTokenName(token: Token) {
    return isConstructor(token)
      ? getClassName(token)
      : token;
  }
}
