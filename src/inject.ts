import { Token } from "./provider";
import "reflect-metadata";

const INJECT_METADATA_KEY = Symbol("INJECT_KEY");

/**
 * @Inject Decorator
 *
 * @param token 
 */

export function Inject(token: Token) {
  return (target: any, _: string | symbol, index: number) => {
    return makeInjectableParamsDecorator(token, target, index);
  };
}

/**
 * Make custom the Injectable parameters decorator
 * @param token Tokey key
 * @param target Class decorator target
 * @param index Index of parameters
 */
 
export function makeInjectableParamsDecorator(token: Token, target: any, index: number){
  Reflect.defineMetadata(
    INJECT_METADATA_KEY,
    token,
    target,
    `index-${index}`
  );
  return target;
}

export function getInjectionToken(target: any, index: number) {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`) as
    | Token
    | undefined;
}