import {
    isClassProvider,
    ClassProvider,
    ValueProvider,
    FactoryProvider,
    isValueProvider,
    Token,
    getTokenName
} from "./provider.interface";
import { getClassName, isConstructor } from "../types";
import { isInjectable } from "../decorators/injectable";

export class ProviderFactory {

    static injectClass<T>(classProvider: ClassProvider, parameters: any[]): T {
        const target = classProvider.useClass;
        return Reflect.construct(target, parameters);
    }

    static injectValue(valueProvider: ValueProvider): any {
        return valueProvider.useValue;
    }

    static injectFactory(valueProvider: FactoryProvider) {
        return valueProvider.useFactory();
    }

    static assertInjectableIfClassProvider(provider: any) {
        if (isClassProvider(provider) && !isInjectable(provider.useClass)) {
            throw new Error(
                `Cannot provide ${getTokenName(
                    provider.provide
                )} using class ${getTokenName(
                    provider.useClass
                )}, ${getTokenName(provider.useClass)} isn't injectable`
            );
        }
    }

}

