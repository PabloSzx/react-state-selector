import React, { createContext, FC, useContext } from "react";

function assertIsDefined<T = unknown>(
  value: T,
  message: string
): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(message);
  }
}

export function createStore<
  TStore,
  THookKeys extends string,
  THook extends (store: TStore) => any,
  THooksObj extends Record<THookKeys, THook>
>(
  useStoreHook: () => TStore,
  options?: {
    hooks?: THooksObj;
    keys?: Record<string, string>;
  }
) {
  const Context = createContext<TStore | null>(null);

  const Provider: FC = ({ children }) => {
    const value = useStoreHook();

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  type HooksKey = keyof NonNullable<typeof options>["hooks"];

  const hooks: {
    [HookKey in HooksKey]: () => ReturnType<THooksObj[HookKey]>;
  } = {};

  if (options?.hooks) {
    for (const [hookKey, createHook] of Object.entries<THook>(options.hooks)) {
      // @ts-ignore
      hooks[hookKey] = () => {
        const ctx = useContext(Context);
        assertIsDefined(ctx, "You should render the context provider!");
        const hookData = createHook(ctx);

        return hookData;
      };
    }
  }

  return { Provider, ...hooks };
}
