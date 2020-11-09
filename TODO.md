# TODO
- [ ] `InjectionToken`  support generic type checking

## Warning

- Can't create the new instance of `InjectionToken` before class import with `ReflectiveInjector.init`, the token will be undefined

    ```typescript
    // index.ts
    export const API_TOKEN = new InjectionToken('api-token');
    import { SomeService } from './some-service';

    // some-service.ts
    import {API_TOKEN} from './index';

    @Injectable()
    export class SomeService {
        constructor(@Inject(API_TOKEN) public api: string) { }
    }
    ```