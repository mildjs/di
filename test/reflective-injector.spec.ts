import { ReflectiveInjector } from "../src/reflective-injector";
import { Injectable } from "../src/decorators/injectable";
import { Inject } from "../src/decorators/inject";

describe("ReflectiveInjector", () => {
  describe("inject", () => {
    class BasicClass {
      constructor(public x: number) {}
    }

    @Injectable()
    class InjectableClass {
      constructor(public basicClass: BasicClass) {}
    }

    @Injectable()
    class ACircularClass {
      constructor(public other: BCircularClass) {}
    }

    @Injectable()
    class BCircularClass {
      constructor(public other: ACircularClass) {}
    }

    @Injectable()
    class AnotherBasicClass {
      x: number = 10;
    }

    @Injectable()
    class TokenOverrideClass {
      constructor(@Inject(AnotherBasicClass) public basicClass: BasicClass) {}
    }

    const SPECIAL_STRING_TOKEN = "some-identifer";
    @Injectable()
    class TokenStringOverrideClass {
      constructor(@Inject(SPECIAL_STRING_TOKEN) public someValue: string) {}
    }

    interface SomeInterface {
      a: string;
    }

    @Injectable()
    class SomeInferfaceClass {
      constructor(public someInterface: SomeInterface) {}
    }

    it("can inject using a value provider", async () => {
      const injector = new ReflectiveInjector();
      const input = { x: 200 };
      injector.addProvider({ provide: BasicClass, useValue: input });
      const output = await injector.get(BasicClass);
      expect(input).toBe(output);
    });

    it("can inject using a factory provider", async () => {
      const injector = new ReflectiveInjector();
      const input = { x: 200 };
      injector.addProvider({ provide: BasicClass, useFactory: () => input });
      const injectedVal = await injector.get(BasicClass);
      expect(injectedVal).toBe(input);
    });

    it("can inject using a class provider", async () => {
      const injector = new ReflectiveInjector();
      const basicValue = { x: 200 };
      injector.addProvider({ provide: BasicClass, useValue: basicValue });
      injector.addProvider({
        provide: InjectableClass,
        useClass: InjectableClass,
      });
      const injectedVal = await injector.get(InjectableClass);
      expect(injectedVal.basicClass).toBe(basicValue);
    });

    it("will default to a class provider for the top level class if no provider for that type exists and the type is injectable ", async() => {
      const injector = new ReflectiveInjector();
      const basicValue = { x: 200 };
      injector.addProvider({ provide: BasicClass, useValue: basicValue });
      const injectedVal = await injector.get(InjectableClass);
      expect(injectedVal.basicClass).toBe(basicValue);
    });

    it("will throw an error when a class with a circular dependency is detected",  () => {
      const injector = new ReflectiveInjector();
      injector.addProvider({
        provide: ACircularClass,
        useClass: ACircularClass,
      });
      injector.addProvider({
        provide: BCircularClass,
        useClass: BCircularClass,
      });
      expect(async () =>
        await injector.get(ACircularClass)
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Injection error. Recursive dependency detected in constructor for type ACircularClass with parameter at index 0"`
      );
    });

    it("will throw an error when a class which isn't injectable is provided with a class provider", () => {
      const injector = new ReflectiveInjector();
      const provider = { provide: BasicClass, useClass: BasicClass };
      expect(() =>
        injector.addProvider(provider)
      ).toThrowErrorMatchingInlineSnapshot(
        `"Cannot provide BasicClass using class BasicClass, BasicClass isn't injectable"`
      );
    });

    it("can inject a class provider with an override", async () => {
      const injector = new ReflectiveInjector();
      injector.addProvider({
        provide: AnotherBasicClass,
        useClass: AnotherBasicClass,
      });
      injector.addProvider({ provide: BasicClass, useValue: { x: 200 } });
      injector.addProvider({
        provide: TokenOverrideClass,
        useClass: TokenOverrideClass,
      });

      const output = await injector.get(TokenOverrideClass);
      expect(output.basicClass).toEqual(new AnotherBasicClass());
    });

    it("can inject a string value provider with an override and injection token", async () => {
      const injector = new ReflectiveInjector();
      const specialValue = "the special value";
      injector.addProvider({
        provide: TokenStringOverrideClass,
        useClass: TokenStringOverrideClass,
      });
      injector.addProvider({
        provide: SPECIAL_STRING_TOKEN,
        useValue: specialValue,
      });

      const output = await injector.get(TokenStringOverrideClass);
      expect(output.someValue).toEqual(specialValue);
    });

    it("will throw an exception if a value for an injection token doesn't exist", () => {
      const injector = new ReflectiveInjector();
      injector.addProvider({
        provide: TokenStringOverrideClass,
        useClass: TokenStringOverrideClass,
      });
      expect(async () =>
        await injector.get(TokenStringOverrideClass)
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"No provider for type some-identifer"`
      );
    });

    it("will fail to inject an interface", () => {
      const injector = new ReflectiveInjector();
      expect(async () =>
        injector.get(SomeInferfaceClass)
      ).rejects.toThrowErrorMatchingInlineSnapshot(`"No provider for type Object"`);
    });

    // Static method
    //
    it("static init method: can inject using a value provider", async () => {
      // const injector = new ReflectiveInjector();
      const input = { x: 200 };
      const injector = ReflectiveInjector.init([
        { provide: BasicClass, useValue: input },
      ]);
      const output = await injector.get(BasicClass);
      expect(input).toBe(output);
    });
  });
});
