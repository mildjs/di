import {
    Provider,
    isClassProvider,
    ClassProvider,
    ValueProvider,
    FactoryProvider,
    isValueProvider,
    Token,
    getTokenName,
    isAsyncFactoryProvider,
    AsyncFactoryProvider
} from "./provider.interface";
import { Constructor } from "../types";

import { getInjectionToken, getInjectionTokenProvider } from "../decorators/inject";
type InjectableParam = Constructor<any>;

const REFLECT_PARAMS = "design:paramtypes";

export class ProviderFactory {

    constructor(
        private providers: Map<any, Provider>
    ) { }


    private async injectClassAsync<T>(classProvider: ClassProvider): Promise<T> {
        const target = classProvider.useClass;
        const params = this.getInjectedParams(target);
        const resolvedParams = await Promise.all(params);
        return Reflect.construct(target, resolvedParams);
    }

    private injectValue(valueProvider: ValueProvider): any {
        return valueProvider.useValue;
    }

    private injectFactory(valueProvider: FactoryProvider) {
        return valueProvider.useFactory();
    }

    private injectAsyncFactory(valueProvider: AsyncFactoryProvider) {
        return valueProvider.useAsyncFactory;
    }


    public async injectAsync(type: Token, provider?: Provider) {

        if (provider === undefined) {
            throw new Error(`No provider for type ${getTokenName(type)}`);
        }
        if (isClassProvider(provider)) {
            return this.injectClassAsync( provider as ClassProvider );
        } else if (isValueProvider(provider)) {
            return this.injectValue(provider as ValueProvider);
        } else if (isAsyncFactoryProvider(provider)) {
            return this.injectAsyncFactory(provider as AsyncFactoryProvider)
        } else {
            return this.injectFactory(provider as FactoryProvider);
        }
    }

    private getInjectedParams<T>(target: Constructor<T>) {
        const argConstructors = Reflect.getMetadata(REFLECT_PARAMS, target) as (
            | InjectableParam
            | undefined
        )[];
        if (argConstructors === undefined) {
            return [];
        }

        return argConstructors.map( (argConstructor, index) => {
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
                provider = getInjectionTokenProvider(injectionTokenHandler.value);
            } else {
                provider = this.providers.get(actualToken);
            }
            
            return this.injectAsync(actualToken, provider);
        });
    }

}

