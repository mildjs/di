import "reflect-metadata";
import { Injectable, ReflectiveInjector, Inject } from '../../../src';

@Injectable()
export class InjectableClass {
    constructor(@Inject('mock_token') public api: string) { }

}

const asyncFunc = () => new Promise(resolve =>
    setTimeout(() => { resolve("Hello async") }, 100)
);

const injector = ReflectiveInjector.init([
    InjectableClass,
    {
        provide: "mock_token",
        useAsyncFactory: asyncFunc()
    },
]);


async function main() {
    const instance = await injector.get(InjectableClass)
    console.log(instance.api);
}

main();