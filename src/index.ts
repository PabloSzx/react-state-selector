import { createElement, FC } from "react";
import { createContext, useContextSelector } from "use-context-selector";

export function createStore<
  TStore,
  THookKeys extends string,
  THook extends (store: TStore) => any,
  THooksObj extends Record<THookKeys, THook>
>(
  useStoreHook: () => TStore,
  options: {
    hooks?: THooksObj;
    initialState: TStore;
  }
) {
  const Context = createContext<TStore>(options.initialState);

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
    for (const [key, hook] of Object.entries<THook>(options.hooks)) {
      // @ts-ignore
      hooks[key] = () => {
        // eslint-disable-next-line
        return useContextSelector(Context, hook);
      };
    }
  }

  return {
    Provider,
    useStore: () => {
      // eslint-disable-next-line
      return useContextSelector(Context, s => s);
    },
    ...hooks
  };
}
