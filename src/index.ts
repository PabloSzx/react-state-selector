import { createElement, FC } from "react";
import { createContext, useContextSelector } from "use-context-selector";

export function createStore<
  TStore,
  THookKeys extends string,
  THook extends (store: TStore) => (props: any) => any,
  THooksObj extends Record<THookKeys, THook>
>(
  useStoreHook: () => TStore,
  options: {
    hooks?: THooksObj;
    initialState: TStore;
  }
): {
  Provider: FC<{}>;
  useStore: () => TStore;
} & {
  [HookKey in keyof NonNullable<typeof options>["hooks"]]: (
    ...props: Parameters<ReturnType<THooksObj[HookKey]>>
  ) => ReturnType<ReturnType<THooksObj[HookKey]>>;
} {
  const Context = createContext<TStore>(options.initialState);

  const Provider: FC = ({ children }) => {
    const value = useStoreHook();

    return createElement(Context.Provider, {
      value,
      children
    });
  };

  const hooks: {
    [HookKey in keyof NonNullable<typeof options>["hooks"]]: (
      ...props: Parameters<ReturnType<THooksObj[HookKey]>>
    ) => ReturnType<ReturnType<THooksObj[HookKey]>>;
  } = {};

  if (options?.hooks) {
    for (const [key, hookSelector] of Object.entries<THook>(options.hooks)) {
      // @ts-ignore
      hooks[key] = (props: any) => {
        // eslint-disable-next-line
        return useContextSelector(Context, store => {
          return hookSelector(store)(props);
        });
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
