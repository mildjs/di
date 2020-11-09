import {
    isClassProvider,
    getTokenName
} from "./provider.interface";
import { isPromise } from '../types';
import { isInjectable } from "../decorators/injectable";

export function assertInjectableIfClassProvider(provider: any) {
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

// export function logPromise(func: string, result: any) {
    // console.log(`[${func}] Type: ${typeof result}(${isPromise(result) ? 'Promise' : 'Normal'}) | Data: ${JSON.stringify(result)}`);
// }