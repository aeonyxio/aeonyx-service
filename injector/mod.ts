export type InjectorOptions = {
  token?: string | (new (...args: unknown[]) => unknown);
  override?: boolean;
};

class Injector {
  private diMap = new Map<string, unknown>();

  inject<T>(storable: unknown, options?: InjectorOptions): void {
    const token = options?.token ?? storable;
    const tokenStr = typeof token === "string"
      ? token
      : (token as new (...args: unknown[]) => unknown).name;

    if (
      tokenStr === undefined ||
      tokenStr === null ||
      typeof tokenStr !== "string"
    ) {
      throw new Error("Token must be a uniquely identifiable string");
    }

    if (this.diMap.has(tokenStr) && !options?.override) {
      throw new Error(
        "Cannot inject, this already exists. If you wish to override, use the 'override' option",
      );
    }

    try {
      const instance = new (storable as new (...args: unknown[]) => unknown)();
      this.diMap.set(tokenStr, instance);
    } catch {
      this.diMap.set(tokenStr, storable);
    }
  }

  get<T>(token: new (...args: unknown[]) => T | string): T {
    const tokenStr = typeof token === "string" ? token : token.name;

    if (this.diMap.has(tokenStr)) {
      return this.diMap.get(tokenStr) as T;
    } else if (typeof token !== "string") {
      const instance = new token() as T;
      this.diMap.set(tokenStr, instance);
      return instance;
    } else {
      throw new Error("Data does not exist and could not be created");
    }
  }
}

export const injector = new Injector();
