import {
  Provider,
  TypeProvider,
  isTypeProvider,
  isClassProvider,
  ClassProvider,
  ValueProvider,
  FactoryProvider,
  isValueProvider,
  Token,
  InjectionToken
} from "./provider";
import { Type } from "./type";
import { isInjectable } from "./injectable";
import "reflect-metadata";
import { getInjectionToken } from "./inject";

type InjectableParam = Type<any>;

const REFLECT_PARAMS = "design:paramtypes";

interface Injector {
  get: (...args: any[]) => any;
}

export class ReflectiveInjector implements Injector{
  private providers = new Map<any, Provider>();

  static init(providers: Provider[]) : ReflectiveInjector{
    const injector = new ReflectiveInjector();

    providers.forEach( provider => {
      injector.addProvider(provider);
    });

    return injector;
}

  addProvider(provider: Provider) {
    this.assertInjectableIfClassProvider(provider);
    this.providers.set(provider.provide, provider);
  }

  public get(type: Token) {
    // Inject the dependencies
    let provider = this.providers.get(type);
    if (provider === undefined && !(type instanceof InjectionToken)) {
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

  private getInjectedParams<T>(target: Type<T>) {
    const argTypes = Reflect.getMetadata(REFLECT_PARAMS, target) as (
      | InjectableParam
      | undefined)[];
    if (argTypes === undefined) {
      return [];
    }
    return argTypes.map((argType, index) => {
      // The reflect-metadata API fails on circular dependencies, and will return undefined
      // for the argument instead.
      if (argType === undefined) {
        throw new Error(
          `Injection error. Recursive dependency detected in constructor for type ${target.name
          } with parameter at index ${index}`
        );
      }
      const overrideToken = getInjectionToken(target, index);
      const actualToken = overrideToken === undefined ? argType : overrideToken;
      let provider = this.providers.get(actualToken);
      return this.injectWithProvider(actualToken, provider);
    });
  }

  private getTokenName(token: Token) {
    return token instanceof InjectionToken
      ? token.injectionIdentifier
      : token.name;
  }
}
