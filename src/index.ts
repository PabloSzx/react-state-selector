/* eslint react-hooks/rules-of-hooks: 0 */
/* eslint react-hooks/exhaustive-deps: 0 */
/* eslint no-loop-func: 0 */

import {
  applyPatches,
  createDraft,
  Draft,
  finishDraft,
  Immutable,
  produce,
  produceWithPatches,
} from "immer";
import {
  createContext,
  createElement,
  FunctionComponent,
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

import { connectDevTools, ReduxDevTools } from "./plugins/devTools";

export { createSelector } from "reselect";
export { Immutable, Draft, castDraft, castImmutable, original } from "immer";

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

function isPromise<T>(val: T | Promise<T>): val is Promise<T> {
  return val && (val as Promise<T>).then !== undefined;
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
  (
    ...args: any[]
  ) =>
    | ((draft: Draft<TStore>) => void | TStore)
    | Promise<(draft: Draft<TStore>) => void | TStore>
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
  ) => ReturnType<NN<NN<A>["actions"]>[ActionName]> extends Promise<any>
    ? Promise<Immutable<TStore>>
    : Immutable<TStore>;
};

type IUseStore<TStore> = () => Immutable<TStore>;

type IAsyncProduce<TStore> = (
  draft: (draft: Draft<TStore>) => Promise<void>
) => Promise<Immutable<TStore>>;

type IProduce<TStore> = (
  draft?: (draft: Draft<TStore>) => void | TStore
) => Immutable<TStore>;

type IUseProduce<TStore> = () => {
  asyncProduce: IAsyncProduce<TStore>;
  produce: IProduce<TStore>;
};

/**
 *  Create **react-state-selector** global store
 *
 * @export
 * @template TStore
 * Any object, including array or complex objects like Map, Set or Classes. Even primitives would work.
 * @template THooks
 * Object that defines the custom hooks of the store.
 * @template TActions
 * Object that defines the custom actions of the store.
 * @param {Immutable<TStore>} initialStore
 * Initial state of the store
 * @param {{
 *     hooks?: THooks;
 *     actions?: TActions;
 *     devName?: string;
 *     devToolsInProduction?: boolean;
 *   }} [options]
 * Options object.
 *
 * @returns {{
 *   useStore: IUseStore<TStore>;
 *   produce: IProduce<TStore>;
 *   asyncProduce: IAsyncProduce<TStore>;
 *   hooks: IHooksObj<TStore, typeof options>;
 *   actions: IActionsObj<TStore, typeof options>;
 * }}
 * Resulting object of the store.
 */
export function createStore<
  TStore,
  THooks extends IHooks<TStore>,
  TActions extends IActions<TStore>
>(
  initialStore: Immutable<TStore>,
  options?: {
    /**
     * Custom hooks.
     *
     * @type {Record<string, (store: Immutable<TStore>, props: any) => unknown>}
     */
    hooks?: THooks;
    /**
     * Custom actions.
     *
     * @type {Record<string, (...args: any[]) => (draft: Draft<TStore>) => void | TStore>}
     */
    actions?: TActions;
    /**
     * Name used to activate Redux DevTools.
     *
     * @type {string}
     */
    devName?: string;
    /**
     * Flag to manually activate the usage of the Redux DevTools in production.
     *
     * @type {boolean}
     */
    devToolsInProduction?: boolean;
  }
): {
  /**
   * useStore: default hook that listens for any change in the store.
   *
   * @type {() => Immutable<TStore>}
   */
  useStore: IUseStore<TStore>;
  /**
   * direct function to mutate the store
   *
   * @type {(draft: (draft: Draft<TStore>) => void | TStore) => Immutable<TStore>}
   */
  produce: IProduce<TStore>;
  /**
   * Async version of produce
   *
   * @type {(draft: (draft: Draft<TStore>) => Promise<void>) => Promise<Immutable<TStore>>}
   */
  asyncProduce: IAsyncProduce<TStore>;
  /**
   * Object containing the custom hooks specified in the options
   *
   * @type {Record<string, (props?: any, propsDeps?: any[]) => unknown>}
   */
  hooks: IHooksObj<TStore, typeof options>;
  /**
   * Object containing the custom actions specified in the options
   *
   * @type {Record<string, (...props:any[]) => TStore>}
   */
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

  let devTools: ReduxDevTools | undefined;

  if (
    options?.devName &&
    (options.devToolsInProduction || process.env.NODE_ENV !== "production")
  ) {
    devTools = connectDevTools(options.devName);
  }

  const listeners = new Map<Selector<Immutable<TStore>>, unknown /* props */>();

  let currentStore = initialStore;

  if (devTools) {
    devTools.init(currentStore);
  }

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
      if (typeof draft !== "function") return currentStore;

      if (devTools) {
        const produceFn = produceWithPatches<
          (draft: Draft<TStore>) => void,
          [Draft<TStore>],
          TStore
        >(draft);

        const produceResult = produceFn(currentStore);
        currentStore = produceResult[0];

        devTools.send(
          {
            type: "produce",
            payload: produceResult[1],
          },
          currentStore
        );
      } else {
        const produceFn = produce<
          (draft: Draft<TStore>) => void,
          [Draft<TStore>],
          TStore
        >(draft);

        currentStore = produceFn(currentStore);
      }
      listeners.forEach((props, listener) => {
        listener(currentStore, props);
      });

      return currentStore;
    },
    asyncProduce: async draft => {
      const storeDraft = createDraft(currentStore as TStore);

      await Promise.resolve(draft(storeDraft));

      currentStore = (finishDraft(storeDraft, changes => {
        if (devTools) {
          devTools.send(
            { type: "asyncProduce", payload: changes },
            applyPatches(currentStore, changes)
          );
        }
      }) as unknown) as Immutable<TStore>;

      listeners.forEach((props, listener) => {
        listener(currentStore, props);
      });

      return currentStore;
    },
  };

  const actionsObj: Record<
    string,
    (...args: unknown[]) => Immutable<TStore> | Promise<Immutable<TStore>>
  > = {};

  for (const [actionName, actionFn] of Object.entries(options?.actions || {})) {
    actionsObj[actionName] = (...args) => {
      const actionDraft = actionFn(...args);

      const actionProduce = (
        draft: (draft: Draft<TStore>) => void | TStore
      ) => {
        if (devTools) {
          const produceFn = produceWithPatches<
            (draft: Draft<TStore>) => void,
            [Draft<TStore>],
            TStore
          >(draft);

          const produceResult = produceFn(currentStore);

          currentStore = produceResult[0];

          devTools.send(
            {
              type: actionName,
              payload: produceResult[1],
            },
            currentStore
          );
        } else {
          const produceFn = produce<
            (draft: Draft<TStore>) => void,
            [Draft<TStore>],
            TStore
          >(draft);

          currentStore = produceFn(currentStore);
        }

        listeners.forEach((props, listener) => {
          listener(currentStore, props);
        });

        return currentStore;
      };

      if (isPromise(actionDraft)) {
        return new Promise<Immutable<TStore>>(async (resolve, reject) => {
          try {
            resolve(actionProduce(await actionDraft));
          } catch (err) {
            reject(err);
          }
        });
      }

      return actionProduce(actionDraft);
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

/**
 * Create React Context version of a **react-state-selector** global store
 *
 * @export
 * @template TStore
 * Any object, including array or complex objects like Map, Set or Classes. Even primitives would work.
 * @template THooks
 * Object that defines the custom hooks of the store.
 * @template TActions
 * Object that defines the custom actions of the store.
 * @param {Immutable<TStore>} initialStore
 * Initial state of the store
 * @param {{
 *     hooks?: THooks;
 *     actions?: TActions;
 *     devName?: string;
 *     devToolsInProduction?: boolean;
 *   }} [options]
 * Options object that may contain:
 * hooks: custom hooks;
 * actions: custom actions;
 * devName: name used to activate Redux DevTools;
 * devToolsInProduction: flag to manually activate the usage of the Redux DevTools in production
 * @returns {{
 *   Provider: FunctionComponent<{ debugName?: string }>;
 *   useStore: IUseStore<TStore>;
 *   useProduce: IUseProduce<TStore>;
 *   useActions: () => IActionsObj<TStore, typeof options>;
 *   hooks: IHooksObj<TStore, typeof options>;
 * }}
 * Resulting object containing of the store.
 */
export function createStoreContext<
  TStore,
  THooks extends IHooks<TStore>,
  TActions extends IActions<TStore>
>(
  initialStore: Immutable<TStore>,
  options?: {
    /**
     * Custom hooks.
     *
     * @type {Record<string, (store: Immutable<TStore>, props: any) => unknown>}
     */
    hooks?: THooks;
    /**
     * Custom actions.
     *
     * @type {Record<string, (...args: any[]) => (draft: Draft<TStore>) => void | TStore>}
     */
    actions?: TActions;
    /**
     * Name used to activate Redux DevTools.
     *
     * @type {string}
     */
    devName?: string;
    /**
     * Flag to manually activate the usage of the Redux DevTools in production.
     *
     * @type {boolean}
     */
    devToolsInProduction?: boolean;
  }
): {
  /**
   * React Context Provider of an instance of the global store
   *
   * @type {FunctionComponent<{ debugName?: string }>}
   */
  Provider: FunctionComponent<{ debugName?: string }>;
  /**
   * Default hook that listens for any change in the store.
   *
   * @type {() => Immutable<TStore>}
   */
  useStore: IUseStore<TStore>;
  /**
   * Default hook that contains "produce" direct function to mutate the store and "asyncProduce" async version of produce
   *
   * @type {() => {
   *  produce: (draft: (draft: Draft<TStore>) => void | TStore) => Immutable<TStore>
   *  asyncProduce: (draft: (draft: Draft<TStore>) => Promise<void>) => Promise<Immutable<TStore>>
   * }}
   */
  useProduce: IUseProduce<TStore>;
  /**
   * Hook that contains the custom actions specified in the options
   *
   */
  useActions: () => IActionsObj<TStore, typeof options>;
  /**
   * Object containing the custom hooks specified in the options
   *
   * @type {Record<string, (...props:any[]) => unknown>}
   */
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
      devTools: ReduxDevTools | undefined;
    }>
  >({
    current: {
      store: initialStore,
      listeners: new Map(),
      devTools: (() => {
        if (
          options?.devName &&
          (options.devToolsInProduction ||
            process.env.NODE_ENV !== "production")
        ) {
          const devTools = connectDevTools(options.devName + "-noProvider");
          if (devTools) {
            devTools.init(initialStore);
          }
          return devTools;
        }
        return undefined;
      })(),
    },
  });

  const providerRefCallback = (debugName?: string) => () => {
    return {
      store: initialStore,
      listeners: new Map<Selector<Immutable<TStore>>, unknown /* props */>(),
      devTools: (() => {
        if (
          options?.devName &&
          (options.devToolsInProduction ||
            process.env.NODE_ENV !== "production")
        ) {
          const devTools = connectDevTools(
            debugName ? options.devName + "-" + debugName : options.devName
          );
          if (devTools) {
            devTools.init(initialStore);
          }
          return devTools;
        }
        return undefined;
      })(),
    };
  };

  const Provider: FunctionComponent<{ debugName?: string }> = memo(
    ({ children, debugName }) => {
      const initialRef = useMemo(providerRefCallback(debugName), emptyArray);
      const valueRef = useRef(initialRef);

      return createElement(StoreContext.Provider, {
        value: valueRef,
        children,
      });
    }
  );

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

    return useMemo(() => {
      return {
        produce: (draft?: (draft: Draft<TStore>) => void) => {
          if (typeof draft !== "function") return storeCtx.current.store;

          if (storeCtx.current.devTools) {
            const produceFn = produceWithPatches<
              (draft: Draft<TStore>) => void,
              [Draft<TStore>],
              TStore
            >(draft);

            const produceResult = produceFn(storeCtx.current.store);

            storeCtx.current.store = produceResult[0];
            storeCtx.current.devTools.send(
              {
                type: "produce",
                payload: produceResult[1],
              },
              storeCtx.current.store
            );
          } else {
            const produceFn = produce<
              (draft: Draft<TStore>) => void,
              [Draft<TStore>],
              TStore
            >(draft);

            storeCtx.current.store = produceFn(storeCtx.current.store);
          }

          storeCtx.current.listeners.forEach((props, listener) => {
            listener(storeCtx.current.store, props);
          });

          return storeCtx.current.store;
        },
        asyncProduce: async (
          draft: (draft: Draft<TStore>) => Promise<void>
        ) => {
          const storeDraft = createDraft(storeCtx.current.store as TStore);

          await Promise.resolve(draft(storeDraft));

          storeCtx.current.store = (finishDraft(storeDraft, changes => {
            if (storeCtx.current.devTools) {
              storeCtx.current.devTools.send(
                {
                  type: "asyncProduce",
                  payload: changes,
                },
                applyPatches(storeCtx.current.store, changes)
              );
            }
          }) as unknown) as Immutable<TStore>;

          storeCtx.current.listeners.forEach((props, listener) => {
            listener(storeCtx.current.store, props);
          });

          return storeCtx.current.store;
        },
      };
    }, [storeCtx]);
  };

  const useActions = () => {
    const storeCtx = useContext(StoreContext);

    return useMemo(() => {
      const actionsObj: Record<
        string,
        (...args: unknown[]) => Immutable<TStore> | Promise<Immutable<TStore>>
      > = {};

      for (const [actionName, actionFn] of Object.entries(
        options?.actions || {}
      )) {
        actionsObj[actionName] = (...args) => {
          const actionDraft = actionFn(...args);

          const actionProduce = (
            draft: (draft: Draft<TStore>) => void | TStore
          ) => {
            if (storeCtx.current.devTools) {
              const produceFn = produceWithPatches<
                (draft: Draft<TStore>) => void,
                [Draft<TStore>],
                TStore
              >(draft);

              const produceResult = produceFn(storeCtx.current.store);

              storeCtx.current.store = produceResult[0];
              storeCtx.current.devTools.send(
                {
                  type: actionName,
                  payload: produceResult[1],
                },
                storeCtx.current.store
              );
            } else {
              const produceFn = produce<
                (draft: Draft<TStore>) => void,
                [Draft<TStore>],
                TStore
              >(draft);

              storeCtx.current.store = produceFn(storeCtx.current.store);
            }
            storeCtx.current.listeners.forEach((props, listener) => {
              listener(storeCtx.current.store, props);
            });

            return storeCtx.current.store;
          };

          if (isPromise(actionDraft)) {
            return new Promise<Immutable<TStore>>(async (resolve, reject) => {
              try {
                resolve(actionProduce(await actionDraft));
              } catch (err) {
                reject(err);
              }
            });
          }
          return actionProduce(actionDraft);
        };
      }
      return (actionsObj as unknown) as IActionsObj<TStore, typeof options>;
    }, emptyArray);
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
