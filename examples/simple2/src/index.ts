import "reflect-metadata";
import { Injectable, ReflectiveInjector, Inject , GlobalStore } from '../../../src';
import { SomeService } from './some-service';
import { InjectableClass } from './injectable-class';
// import { API_TOKEN } from './tokens';

const injector = ReflectiveInjector.init([
    InjectableClass,
    { provide: SomeService, useClass: SomeService },
    { provide: 'API_TOKEN', useValue: "API_KEY" }
]);

const instance = injector.get(InjectableClass) as InjectableClass;
console.log(instance.someService.api);


// GlobalStore.set('mykey', 'hello');
// console.log(GlobalStore.get('mykey'));
// GlobalStore.set('mykey', 'world');
// console.log(GlobalStore.get('mykey'));

GlobalStore.set('mykey', 'set Const');
// console.log(GlobalStore.get('mykey'));

GlobalStore.set('mykey', 'hey');
// console.log(GlobalStore.get('mykey'));