/**
 * example:
 * const TOKEN = new InjectionToken(TOKEN_KEY)
 */

export class InjectionToken<T> {
  constructor(public injectionIdentifier: string) {}

  // toString() {
  //   return `InjectionToken '${this.injectionIdentifier}'`;
  // }
}
