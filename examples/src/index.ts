import { Injectable, InjectionToken, ReflectiveInjector, Inject } from '../../src';

const API_TOKEN = new InjectionToken('api-token');

@Injectable()
class SomeService {
    constructor(@Inject(API_TOKEN) public api: string) { }
}

@Injectable()
class InjectableClass {
    constructor(public someService: SomeService) { }

    public info(){
        return "hey";
    }
}

const injector = ReflectiveInjector.init([
    InjectableClass,
    { provide: SomeService, useClass: SomeService },
    { provide: API_TOKEN, useValue: "API_KEY" }
]);

const instance = injector.get(InjectableClass) as InjectableClass;
console.log(instance.info());
