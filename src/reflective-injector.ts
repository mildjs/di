import { Provider, Token, assertInjectableIfClassProvider, ProviderFactory } from "./providers";
import { isConstructor, isPromise } from "./types";

export interface Injector {
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
    assertInjectableIfClassProvider(parsedProvider);
    this.providers.set(parsedProvider.provide, parsedProvider);
  }


  public async get(type: Token) {
    let provider = this.providers.get(type);
    if (provider === undefined && isConstructor(type)) {
      provider = { provide: type, useClass: type };
      assertInjectableIfClassProvider(provider);
    }

    const injection = new ProviderFactory(this.providers);
    return await injection.injectAsync(type, provider);
  }

}
