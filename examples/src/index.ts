import { Injectable, InjectionToken, ReflectiveInjector, Inject } from '../../src';

const API_TOKEN = new InjectionToken('api-token');

@Injectable()
class SomeService {
    constructor(@Inject(API_TOKEN) public aaa: string) { }
}

@Injectable()
class InjectableClass {
    constructor(public someService: SomeService) { }
}

const injector = ReflectiveInjector.init([
    InjectableClass,
    { provide: SomeService, useClass: SomeService },
    { provide: API_TOKEN, useValue: 9999 }
]);

const instance = injector.get(InjectableClass);
console.log(instance.someService.aaa);
