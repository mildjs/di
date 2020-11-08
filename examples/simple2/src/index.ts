import "reflect-metadata";
import { Injectable, InjectionToken, ReflectiveInjector, Inject } from '../../../src';
import { SomeService } from './some-service';
import { InjectableClass } from './injectable-class';
import { API_TOKEN } from './tokens';

const injector = ReflectiveInjector.init([
    InjectableClass,
    { provide: SomeService, useClass: SomeService },
    { provide: API_TOKEN, useValue: "API_KEY" }
]);

const instance = injector.get(InjectableClass) as InjectableClass;
console.log(instance.someService.api);
