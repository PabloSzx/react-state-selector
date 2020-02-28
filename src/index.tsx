/* eslint react-hooks/rules-of-hooks: 0 */
/* eslint react-hooks/exhaustive-deps: 0 */
/* eslint no-loop-func: 0 */

import { createDraft, Draft, finishDraft, Immutable, produce } from "immer";
import React, {
  createContext,
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createSelector, ParametricSelector } from "reselect";

export { createSelector } from "reselect";

export type Selector<
  TState,
  TProps = any,
  TResult = unknown
> = ParametricSelector<TState, TProps, TResult>;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function toAnonFunction(arg: unknown): () => typeof arg {
  if (typeof arg === "function") {
    return arg as () => typeof arg;
  }
  return () => arg;
}

const incrementParameter = (num: number) => ++num;

const emptyArray = Object.freeze([]);

const useUpdate = () => {
  const [, setState] = useState(0);

  return useCallback(() => setState(incrementParameter), emptyArray);
};

type NN<T> = NonNullable<T>;

export type IHooks<TStore> = Record<string, Selector<Immutable<TStore>>>;

export type IActions<TStore> = Record<
  string,
  (...args: any[]) => (draft: Draft<TStore>) => unknown
>;

type IHooksObj<TStore, A extends { hooks?: IHooks<TStore> } | undefined> = {
  [HookName in keyof NN<NN<A>["hooks"]>]: (
    props: Parameters<NN<NN<A>["hooks"]>[HookName]>[1] extends undefined
      ? void
      :
          | Parameters<NN<NN<A>["hooks"]>[HookName]>[1]
          | (() => Parameters<NN<NN<A>["hooks"]>[HookName]>[1]),
    propsDeps?: unknown[]
  ) => ReturnType<NN<NN<A>["hooks"]>[HookName]>;
};

type IActionsObj<
  TStore,
  A extends { actions?: IActions<TStore> } | undefined
> = {
  [ActionName in keyof NN<NN<A>["actions"]>]: (
    ...args: Parameters<NN<NN<A>["actions"]>[ActionName]>
  ) => ReturnType<ReturnType<NN<NN<A>["actions"]>[ActionName]>>;
};

type IUseStore<TStore> = () => Immutable<TStore>;

type IAsyncProduce<TStore> = (
  draft: (draft: Draft<TStore>) => Promise<void>
) => Promise<Immutable<TStore>>;

type IProduce<TStore> = (
  draft: (draft: Draft<TStore>) => void
) => Immutable<TStore>;

type IUseProduce<TStore> = () => {
  asyncProduce: IAsyncProduce<TStore>;
  produce: IProduce<TStore>;
};

export function createStore<
  TStore,
  THooks extends IHooks<TStore>,
  TActions extends IActions<TStore>
>(
  initialStore: Immutable<TStore>,
  options?: { hooks?: THooks; actions?: TActions }
): {
  useStore: IUseStore<TStore>;
  produce: IProduce<TStore>;
  asyncProduce: IAsyncProduce<TStore>;
  hooks: IHooksObj<TStore, typeof options>;
  actions: IActionsObj<TStore, typeof options>;
} {
  if (process.env.NODE_ENV !== "production") {
    for (const name in options?.hooks) {
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

  const listeners = new Map<Selector<Immutable<TStore>>, unknown /* props */>();

  let currentStore = initialStore;

  const useStore = () => {
    const update = useUpdate();

    useIsomorphicLayoutEffect(() => {
      const globalListener = createSelector(
        (s: Immutable<TStore>) => s,
        () => {
          update();
        }
      );
      listeners.set(globalListener, null);

      return () => {
        listeners.delete(globalListener);
      };
    }, emptyArray);

    return currentStore;
  };

  const produceObj: {
    produce: IProduce<TStore>;
    asyncProduce: IAsyncProduce<TStore>;
  } = {
    produce: draft => {
      const produceFn = produce<
        (draft: Draft<TStore>) => void,
        [Draft<TStore>],
        TStore
      >(draft);

      currentStore = produceFn(currentStore);

      listeners.forEach((props, listener) => {
        listener(currentStore, props);
      });

      return currentStore;
    },
    asyncProduce: async draft => {
      const storeDraft = createDraft(currentStore as TStore);

      await Promise.resolve(draft(storeDraft));

      currentStore = (finishDraft(storeDraft) as any) as Immutable<TStore>;

      listeners.forEach((props, listener) => {
        listener(currentStore, props);
      });

      return currentStore;
    },
  };

  const actionsObj: Record<string, (...args: unknown[]) => unknown> = {};

  for (const [actionName, actionFn] of Object.entries(options?.actions || {})) {
    actionsObj[actionName] = (...args) => {
      const actionDraft = actionFn(...args);

      const storeDraft = createDraft(currentStore as TStore);

      const ownDraftResult = actionDraft(storeDraft);

      currentStore = (finishDraft(storeDraft) as any) as Immutable<TStore>;

      listeners.forEach((props, listener) => {
        listener(currentStore, props);
      });

      return ownDraftResult;
    };
  }

  const hooksObj: Record<
    string,
    (
      hookProps?: (() => unknown) | unknown,
      hookPropsDeps?: unknown[]
    ) => unknown
  > = {};

  for (const [hookName, hookSelector] of Object.entries(options?.hooks || {})) {
    hooksObj[hookName] = (
      hooksProps?: (() => unknown) | unknown,
      hookPropsDeps?: unknown[]
    ) => {
      const update = useUpdate();

      const props = useMemo(
        toAnonFunction(hooksProps),
        hookPropsDeps || [hooksProps]
      );

      const isMountedRef = useRef(false);

      const { updateSelector, initialStateRef } = useMemo(() => {
        return {
          updateSelector: createSelector(hookSelector, result => {
            stateRef.current = result;

            if (!isMountedRef.current) {
              return;
            }

            update();
          }),
          initialStateRef: hookSelector(currentStore, props),
        };
      }, emptyArray);

      const stateRef = useRef(initialStateRef);

      useIsomorphicLayoutEffect(() => {
        updateSelector(currentStore, props);

        listeners.set(updateSelector, props);
      }, [props]);

      useEffect(() => {
        isMountedRef.current = true;

        return () => {
          listeners.delete(updateSelector);
        };
      }, emptyArray);

      return stateRef.current;
    };
  }

  return {
    useStore,
    actions: (actionsObj as unknown) as IActionsObj<TStore, typeof options>,
    hooks: (hooksObj as unknown) as IHooksObj<TStore, typeof options>,
    ...produceObj,
  };
}

export function createStoreContext<
  TStore,
  THooks extends IHooks<TStore>,
  TActions extends IActions<TStore>
>(
  initialStore: Immutable<TStore>,
  options?: { hooks?: THooks; actions?: TActions }
): {
  Provider: FC;
  useStore: IUseStore<TStore>;
  useProduce: IUseProduce<TStore>;
  useActions: () => IActionsObj<TStore, typeof options>;
  hooks: IHooksObj<TStore, typeof options>;
} {
  if (process.env.NODE_ENV !== "production") {
    for (const name in options?.hooks) {
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

  const StoreContext = createContext<
    MutableRefObject<{
      store: Immutable<TStore>;
      listeners: Map<
        ParametricSelector<Immutable<TStore>, unknown, unknown>,
        unknown
      >;
    }>
  >({
    current: { store: initialStore, listeners: new Map() },
  });

  const Provider: FC = memo(({ children }) => {
    const initialRef = useMemo(() => {
      return {
        store: initialStore,
        listeners: new Map<Selector<Immutable<TStore>>, unknown /* props */>(),
      };
    }, emptyArray);
    const valueRef = useRef(initialRef);

    return (
      <StoreContext.Provider value={valueRef}>{children}</StoreContext.Provider>
    );
  });

  const useStore = () => {
    const storeCtx = useContext(StoreContext);
    const update = useUpdate();

    useIsomorphicLayoutEffect(() => {
      const globalListener = createSelector(
        (s: Immutable<TStore>) => s,
        () => {
          update();
        }
      );
      storeCtx.current.listeners.set(globalListener, null);

      return () => {
        storeCtx.current.listeners.delete(globalListener);
      };
    }, emptyArray);

    return storeCtx.current.store;
  };

  const useProduce = () => {
    const storeCtx = useContext(StoreContext);
    return {
      produce: (draft: (draft: Draft<TStore>) => void) => {
        const produceFn = produce<
          (draft: Draft<TStore>) => void,
          [Draft<TStore>],
          TStore
        >(draft);

        storeCtx.current.store = produceFn(storeCtx.current.store);

        storeCtx.current.listeners.forEach((props, listener) => {
          listener(storeCtx.current.store, props);
        });

        return storeCtx.current.store;
      },
      asyncProduce: async (draft: (draft: Draft<TStore>) => Promise<void>) => {
        const storeDraft = createDraft(storeCtx.current.store as TStore);

        await Promise.resolve(draft(storeDraft));

        storeCtx.current.store = (finishDraft(storeDraft) as any) as Immutable<
          TStore
        >;

        storeCtx.current.listeners.forEach((props, listener) => {
          listener(storeCtx.current.store, props);
        });

        return storeCtx.current.store;
      },
    };
  };

  const useActions = () => {
    const storeCtx = useContext(StoreContext);

    const actions = useMemo(() => {
      const actionsObj: Record<string, (...args: unknown[]) => unknown> = {};

      for (const [actionName, actionFn] of Object.entries(
        options?.actions || {}
      )) {
        actionsObj[actionName] = (...args) => {
          const storeDraft = createDraft(storeCtx.current.store as TStore);

          const actionDraft = actionFn(...args);

          const ownDraftResult = actionDraft(storeDraft);

          storeCtx.current.store = (finishDraft(
            storeDraft
          ) as any) as Immutable<TStore>;

          storeCtx.current.listeners.forEach((props, listener) => {
            listener(storeCtx.current.store, props);
          });

          return ownDraftResult;
        };
      }
      return (actionsObj as unknown) as IActionsObj<TStore, typeof options>;
    }, emptyArray);

    return actions;
  };

  const hooksObj: Record<
    string,
    (
      hookProps?: (() => unknown) | unknown,
      hookPropsDeps?: unknown[]
    ) => unknown
  > = {};

  for (const [hookName, hookSelector] of Object.entries(options?.hooks || {})) {
    hooksObj[hookName] = (
      hooksProps?: (() => unknown) | unknown,
      hookPropsDeps?: unknown[]
    ) => {
      const storeCtx = useContext(StoreContext);

      const update = useUpdate();

      const props = useMemo(
        toAnonFunction(hooksProps),
        hookPropsDeps || [hooksProps]
      );

      const isMountedRef = useRef(false);

      const { updateSelector, initialStateRef } = useMemo(() => {
        return {
          updateSelector: createSelector(hookSelector, result => {
            stateRef.current = result;

            if (!isMountedRef.current) {
              return;
            }

            update();
          }),
          initialStateRef: hookSelector(storeCtx.current.store, props),
        };
      }, emptyArray);

      const stateRef = useRef(initialStateRef);

      useIsomorphicLayoutEffect(() => {
        updateSelector(storeCtx.current.store, props);

        storeCtx.current.listeners.set(updateSelector, props);
      }, [props]);

      useEffect(() => {
        isMountedRef.current = true;

        return () => {
          storeCtx.current.listeners.delete(updateSelector);
        };
      }, emptyArray);

      return stateRef.current;
    };
  }

  return {
    Provider,
    useStore,
    useProduce,
    useActions,
    hooks: (hooksObj as unknown) as IHooksObj<TStore, typeof options>,
  };
}
