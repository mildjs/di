import "reflect-metadata";
import { Token } from "../provider";
import { Dictionary } from "../types";

interface InjectionTokensHandler {
  token: Token,
  value?: any
}

const INJECT_METADATA_KEY = Symbol("INJECT_KEY");

/**
 * @Inject Decorator
 *
 * @param token
 */

export function Inject(token: Token): ParameterDecorator {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    return makeInjectableParamsDecorator(token, target, parameterIndex);
  }
}

/**
 * Make custom the Injectable parameters decorator
 * @param token Tokey key
 * @param target Class decorator target
 * @param index Index of parameters
 * @param value using value from the decorator < any | Function >
 */

export function makeInjectableParamsDecorator(
  token: Token,
  target: any,
  parameterIndex: number,
  value?: any | Function
) {

  if (token === undefined)
    throw new Error("Token is undefined, Token must be provided");

  const injectionTokens: Dictionary<InjectionTokensHandler> =
    Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) || {};

  injectionTokens[parameterIndex] = { token, value }

  Reflect.defineMetadata(INJECT_METADATA_KEY, injectionTokens, target);
  return target;
}

export function getInjectionToken(target: any, index: number) {
  const injectionTokens: Dictionary<InjectionTokensHandler> = Reflect.getOwnMetadata(
    INJECT_METADATA_KEY,
    target
  );
  if (injectionTokens === undefined) return undefined;
  return injectionTokens[index] as InjectionTokensHandler | undefined;
}

