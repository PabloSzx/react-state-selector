/* eslint react-hooks/rules-of-hooks: 0 */

import { Draft, Immutable, produce } from "immer";
import { createElement, FC, useEffect, useLayoutEffect, useRef } from "react";
import { createSelector } from "reselect";

import { createContext, useContextSelector } from "./useContextSelector";
import { useUpdate } from "./useUpdate";

export type Selector<S, R, P = unknown> = (state: S, props?: P) => R;

export type OutputSelector<S, R, C> = Selector<S, R> & {
  resultFunc: C;
  recomputations: () => number;
  resetRecomputations: () => number;
};

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
  TStore extends Record<string | number | symbol, unknown>,
  THooksObj extends Record<
    string,
    (store: Immutable<TStore>, props?: unknown) => unknown
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
    props?: Parameters<typeof hooks[HookKey]>[1]
  ) => ReturnType<typeof hooks[HookKey]>;
} {
  const hooksObj: Record<string, Function> = {};

  if (process.env.NODE_ENV === "development") {
    for (const name in hooks) {
      if (
        name.length < 4 ||
        name.slice(0, 3) !== "use" ||
        name.charAt(3) === name.charAt(3).toLowerCase()
      ) {
        throw new Error(
          `All hooks should follow the rules of hooks for naming and "${name}" doesn't`
        );
      }
    }
  }

  let listeners = new Map<Function, unknown /* props */>();

  let currentStore = store;

  const useStore = () => {
    const update = useUpdate();

    useIsomorphicLayoutEffect(() => {
      const globalListener = createSelector(
        (s: TStore) => s,
        () => {
          update();
        }
      );
      listeners.set(globalListener, null);

      return () => {
        listeners.delete(globalListener);
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

        listeners.forEach((props, listener) => {
          listener(currentStore, props);
        });
      }
    };
  };

  if (hooks) {
    for (const [key, hookSelector] of Object.entries(hooks)) {
      hooksObj[key] = (hooksProps: unknown) => {
        const stateRef = useRef(currentStore);

        const selectorsRef = useRef<OutputSelector<
          Immutable<TStore>,
          void,
          (res1: unknown) => void
        > | null>(null);

        const update = useUpdate();

        useIsomorphicLayoutEffect(() => {
          if (selectorsRef.current) {
            listeners.set(selectorsRef.current, hooksProps);

            selectorsRef.current(stateRef.current, hooksProps);
          }
        }, [hooksProps]);

        useIsomorphicLayoutEffect(() => {
          let firstRender = true;
          if (!selectorsRef.current) {
            const stateSelector = createSelector(hookSelector, () => {
              if (firstRender) return;

              update();
            });
            selectorsRef.current = stateSelector;
          }
          selectorsRef.current(stateRef.current, hooksProps);

          setTimeout(() => {
            firstRender = false;
          }, 0);

          listeners.set(selectorsRef.current, hooksProps);

          return () => {
            if (selectorsRef.current) {
              listeners.delete(selectorsRef.current);
            } else {
              if (process.env.NODE_ENV === "development") {
                console.warn("MEMORY LEAK!");
              }
            }
          };
        }, []);

        stateRef.current = currentStore;

        return hookSelector(stateRef.current, hooksProps);
      };
    }
  }

  return {
    useStore,
    useProduce,
    ...hooksObj
  };
}
