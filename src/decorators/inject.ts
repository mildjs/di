import "reflect-metadata";
import { Token } from "../provider";
import { Dictionary } from '../types';

const INJECT_METADATA_KEY = Symbol("INJECT_KEY");

/**
 * @Inject Decorator
 *
 * @param token
 */

export function Inject(token: Token): ParameterDecorator {
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

export function makeInjectableParamsDecorator(
  token: Token,
  target: any,
  index: number
) {
  if (token === undefined)
    throw new Error("Token is undefined, Token must be provided");

  const injectionTokens: Dictionary<Token> = Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) || {};
  injectionTokens[index] = token;

  Reflect.defineMetadata(
    INJECT_METADATA_KEY,
    injectionTokens,
    target
  );
  return target;
}


export function getInjectionToken(target: any, index: number) {
  const injectionTokens: Dictionary<Token> = Reflect.getOwnMetadata(INJECT_METADATA_KEY, target);
  if (injectionTokens === undefined)
    return undefined;
  return injectionTokens[index] as Token | undefined;
}
