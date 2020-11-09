import { Provider, Token } from "./providers/provider.interface";
import { ProviderFactory } from './providers/provider-factory';
import { isConstructor } from "./types";
import { ProviderInjection } from './providers/provider-injection';

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
    ProviderFactory.assertInjectableIfClassProvider(parsedProvider);
    this.providers.set(parsedProvider.provide, parsedProvider);
  }

  public get(type: Token) {
    // Inject the dependencies
    let provider = this.providers.get(type);
    if (provider === undefined && isConstructor(type)) {
      provider = { provide: type, useClass: type };
      ProviderFactory.assertInjectableIfClassProvider(provider);
    }

    const injection = new ProviderInjection(this.providers);
    return injection.injectWithProvider(type, provider);
  }

}
