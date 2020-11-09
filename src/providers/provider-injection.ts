import {
    Provider,
    isClassProvider,
    ClassProvider,
    ValueProvider,
    FactoryProvider,
    isValueProvider,
    Token,
    getTokenName
} from "./provider.interface";
import { ProviderFactory } from './provider-factory';
import { Constructor } from "../types";

import { getInjectionToken, getInjectionTokenProvider } from "../decorators/inject";

type InjectableParam = Constructor<any>;

const REFLECT_PARAMS = "design:paramtypes";


export class ProviderInjection {

    constructor(
        private providers: Map<any, Provider>
    ){}

    public injectWithProvider(type: Token, provider?: Provider): any {
        if (provider === undefined) {
            throw new Error(`No provider for type ${getTokenName(type)}`);
        }
        if (isClassProvider(provider)) {
            const classProvider = provider as ClassProvider;
            return ProviderFactory.injectClass(
                classProvider,
                this.getInjectedParams(classProvider.useClass)
            );
        } else if (isValueProvider(provider)) {
            return ProviderFactory.injectValue(provider as ValueProvider);
        } else {
            return ProviderFactory.injectFactory(provider as FactoryProvider);
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
                provider = getInjectionTokenProvider(injectionTokenHandler.value);
            } else {
                provider = this.providers.get(actualToken);
            }

            return this.injectWithProvider(actualToken, provider);
        });
    }
}