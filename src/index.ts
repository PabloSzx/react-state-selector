import { Draft, Immutable, produce } from "immer";
import { createElement, FC, useEffect, useLayoutEffect, useRef } from "react";
import { useUpdate } from "react-use";

import { createContext, useContextSelector } from "./useContextSelector";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function assertIsDefined<T = unknown>(
  value: T,
  message: string
): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
}

export function createStoreHook<
  TStore extends Record<string | number | symbol, unknown>,
  THookKeys extends string,
  THooksObj extends Record<
    THookKeys,
    (store: TStore) => (props: unknown) => unknown
  >,
  THooksSelectorKeys extends {
    [HookSelectKey in keyof THooksObj]?: (
      store: TStore
    ) => (
      ...props: Parameters<ReturnType<THooksObj[HookSelectKey]>>
    ) => unknown;
  }
>(
  useStoreHook: () => TStore,
  options: {
    hooks?: THooksObj;
    selectorKeys?: THooksSelectorKeys;
    initialState: TStore;
  }
): {
  Provider: FC;
  useStore: () => TStore;
} & {
  [HookKey in keyof typeof options["hooks"]]: (
    ...props: Parameters<ReturnType<THooksObj[HookKey]>>
  ) => ReturnType<ReturnType<THooksObj[HookKey]>>;
} {
  const Context = createContext<TStore>(options.initialState);

  const Provider: FC = ({ children }) => {
    // eslint-disable-next-line
    const value = useStoreHook();

    return createElement<any>(Context.Provider, {
      value,
      children
    });
  };

  const hooks: Record<string, Function> = {};
  const selectorKeys: Record<
    string,
    ((store: TStore) => (...props: any) => unknown) | undefined
  > = options.selectorKeys ?? {};

  if (options.hooks) {
    for (const [key, hookSelector] of Object.entries<Function>(options.hooks)) {
      hooks[key] = (props: unknown) => {
        // eslint-disable-next-line
        return useContextSelector(
          Context,
          store => {
            return hookSelector(store)(props);
          },
          key in selectorKeys
            ? store => selectorKeys[key]?.(store)(props)
            : undefined
        );
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

export function createStore<
  TStore extends Immutable<Record<string | number | symbol, unknown>>,
  THookKeys extends string,
  THooksObj extends Record<
    THookKeys,
    (store: Immutable<TStore>) => (props: unknown) => unknown
  >
>(
  store: Immutable<TStore>,
  hooks?: THooksObj
): {
  useStore: () => Immutable<TStore>;
  useProduce: () => {
    produce: (draft: (draft: Draft<TStore>) => void) => void;
  };
} & {
  [HookKey in keyof typeof hooks]: (
    ...props: Parameters<ReturnType<typeof hooks[HookKey]>>
  ) => ReturnType<ReturnType<typeof hooks[HookKey]>>;
} {
  const hooksObj: Record<string, Function> = {};

  // when an action is called, call all the listeners
  let listeners: Function[] = [];

  let currentStore = store;

  const useStore = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const update = useUpdate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      const listener = () => {
        update();
      };
      listeners.push(listener);

      return () => {
        listeners = produce(listeners, state => {
          state.splice(
            state.findIndex(fn => fn === listener),
            1
          );
        });
      };
    }, []);

    return currentStore;
  };

  const useProduce = () => {
    return {
      produce: (draft: (draft: Draft<TStore>) => void) => {
        const produceFn = produce<
          (draft: Draft<TStore>) => void,
          [Draft<TStore>],
          TStore
        >(draft);

        currentStore = produceFn(currentStore);
        for (const listener of listeners) {
          listener();
        }
      }
    };
  };

  if (hooks) {
    for (const [key, hookSelector] of Object.entries<
      (store: Immutable<TStore>) => (props: unknown) => unknown
    >(hooks)) {
      hooksObj[key] = (props: unknown) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const stateRef = useRef(currentStore);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const update = useUpdate();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsomorphicLayoutEffect(() => {
          const listener = () => {
            update();
          };
          listeners.push(listener);

          return () => {
            listeners = produce(listeners, state => {
              state.splice(
                state.findIndex(fn => fn === listener),
                1
              );
            });
          };
        }, []);

        stateRef.current = currentStore;

        return hookSelector(stateRef.current)(props);
      };
    }
  }

  return {
    useStore,
    useProduce,
    ...hooksObj
  };
}
