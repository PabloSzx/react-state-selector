import { Draft, Immutable, produce } from "immer";
import {
  createElement,
  FC,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createSelector } from "reselect";

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

// interface IStoreExample {
//   a: { b: number; c: string };
// }

// const selectorFnExample = (store: IStoreExample) => {
//   return store.a.b;
// };

// const selectorFnExample2 = (store: IStoreExample) => {
//   return store.a.c;
// };

// const selector = createSelector(
//   (state: IStoreExample) => {
//     return selectorFnExample(state);
//   },
//   (state: IStoreExample) => {
//     return selectorFnExample2(state);
//   },
//   (res1, res2) => {
//     console.log("function 1 called!", {
//       res1,
//       res2
//     });
//   }
// );

// const exampleStore: IStoreExample = {
//   a: { b: 1, c: "asd" }
// };

// selector(exampleStore);

// const exampleStore2: IStoreExample = {
//   a: { b: 2, c: "asd" }
// };

// selector(exampleStore2);

export function createStore<
  TStore extends Immutable<Record<string | number | symbol, unknown>>,
  THookKeys extends string,
  THooksObj extends Record<THookKeys, (store: Immutable<TStore>) => unknown>
>(
  store: Immutable<TStore>,
  hooks?: THooksObj
): {
  useStore: () => Immutable<TStore>;
  useProduce: () => {
    produce: (draft: (draft: Draft<TStore>) => void) => void;
  };
} & {
  [HookKey in keyof typeof hooks]: () => // ...props: Parameters<ReturnType<typeof hooks[HookKey]>>
  ReturnType<typeof hooks[HookKey]>;

  // ReturnType<ReturnType<typeof hooks[HookKey]>>;
} {
  const hooksObj: Record<string, Function> = {};

  let listeners = new Map<Function, boolean>();

  let currentStore = store;

  const useStore = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, update] = useState(0);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      const selector = (s: TStore) => s;
      const globalListener = createSelector(selector, () => {
        update(n => ++n);
      });
      listeners.set(globalListener, true);

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

        listeners.forEach((_, listener) => {
          listener(currentStore);
        });
      }
    };
  };

  if (hooks) {
    for (const [key, hookSelector] of Object.entries<
      (store: Immutable<TStore>) => unknown
    >(hooks)) {
      hooksObj[key] = (props: unknown) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const stateRef = useRef(currentStore);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [, update] = useState(0);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsomorphicLayoutEffect(() => {
          let firstRender = true;
          const selector = createSelector(hookSelector, () => {
            if (!firstRender) {
              update(n => ++n);
            }
          });
          selector(stateRef.current);
          firstRender = false;
          listeners.set(selector, true);

          return () => {
            listeners.delete(selector);
          };
        }, []);

        stateRef.current = currentStore;

        return hookSelector(stateRef.current);
      };
    }
  }

  return {
    useStore,
    useProduce,
    ...hooksObj
  };
}
