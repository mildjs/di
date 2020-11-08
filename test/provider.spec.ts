import {
  isConstructorProvider,
  isClassProvider,
  isValueProvider,
  isFactoryProvider,
} from "../src/provider";

describe("isTypeProvider", () => {
  it("can identify a type provider", () => {
    const output = isConstructorProvider(String);
    expect(output).toBeTruthy();
  });
  it("can identify a non-type provider", () => {
    const output = isConstructorProvider({ provide: String, useValue: "Hello" });
    expect(output).toBeFalsy();
  });
});

describe("isClassProvider", () => {
  it("can identify a class provider", () => {
    const output = isClassProvider({ provide: String, useClass: String });
    expect(output).toBeTruthy();
  });
  it("can identify a non-class provider", () => {
    const output = isClassProvider({ provide: String, useValue: "Hello" });
    expect(output).toBeFalsy();
  });
});

describe("isValueProvider", () => {
  it("can identify a value provider", () => {
    const output = isValueProvider({ provide: String, useValue: "Hello" });
    expect(output).toBeTruthy();
  });
  it("can identify a non-value provider", () => {
    const output = isValueProvider({ provide: String, useClass: String });
    expect(output).toBeFalsy();
  });
});

describe("isFactoryProvider", () => {
  it("can identify a factory provider", () => {
    const output = isFactoryProvider({
      provide: String,
      useFactory: () => "Hello",
    });
    expect(output).toBeTruthy();
  });
  it("can identify a non-factory provider", () => {
    const output = isFactoryProvider({ provide: String, useClass: String });
    expect(output).toBeFalsy();
  });
});
