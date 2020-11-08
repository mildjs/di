// import 'reflect-metadata';
import { SomeService } from './some-service';
import { Injectable, InjectionToken, ReflectiveInjector, Inject } from '../../../src';
import { API_TOKEN } from './tokens';

@Injectable()
export class InjectableClass {
    // constructor(public someService: SomeService) { }
    constructor(@Inject(API_TOKEN) public api: string) { }

    public info() {
        return "hey";
    }
}