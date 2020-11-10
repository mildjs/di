# A Lightweight Dependency Injection Library

[![Build Status](https://travis-ci.org/mildjs/di.svg?branch=main)](https://travis-ci.org/mildjs/di) 
[![codecov](https://codecov.io/gh/mildjs/di/branch/main/graph/badge.svg?token=6wlUe1OgBT)](https://codecov.io/gh/mildjs/di)
[![npm version](https://badge.fury.io/js/%40mildjs%2Fdi.svg)](https://badge.fury.io/js/%40mildjs%2Fdi)

## Features

- Support `value`, `Class`, `Factory` and `AsyncFactory`

## Installation

```
$ npm install @mildjs/di
```

## Usage 

```typescript
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
```

output

```
Hello async
```

Original by https://dev.to/darcyrayner/typescript-dependency-injection-in-200-loc-12j7