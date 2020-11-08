
import { Injectable, InjectionToken, ReflectiveInjector, Inject } from '../../../src';
import {API_TOKEN} from './tokens';

@Injectable()
export class SomeService {
    constructor(@Inject(API_TOKEN) public api: string) { }

    info(){
        return "some service";
    }
}
