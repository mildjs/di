import "reflect-metadata";
import { Type } from "./type";

const INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_KEY");

export function Injectable() {
  return (target: any) => {
    return makeInjectableDecorator(target);
  };
}

/**
 * Make the decorator to be injectable
 * @param target Token key
 */

export function makeInjectableDecorator(target: any) {
  Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
  return target;
}

export function isInjectable<T>(target: Type<T>) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true;
}
