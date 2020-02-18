import { createElement, FC } from "react";
import { createContext, useContextSelector } from "use-context-selector";

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
  const Context = createContext<TStore>(null as any);

  const Provider: FC = ({ children }) => {
    const value = useStoreHook();

    return createElement(Context.Provider, {
      value,
      children
    });
  };

  type HooksKey = keyof NonNullable<typeof options>["hooks"];

  const hooks: {
    [HookKey in HooksKey]: () => ReturnType<THooksObj[HookKey]>;
  } = {};

  if (options?.hooks) {
    for (const [hookKey, createHook] of Object.entries<THook>(options.hooks)) {
      // @ts-ignore
      hooks[hookKey] = () => {
        // eslint-disable-next-line
        const hookData = useContextSelector(Context, createHook);
        assertIsDefined(hookData, "You should render the context provider!");
        return hookData;
      };
    }
  }

  return { Provider, ...hooks };
}
