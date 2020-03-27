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
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { createSelector, ParametricSelector } from "reselect";

import {
  emptyArray,
  IActions,
  IActionsObj,
  IAsyncActions,
  IAsyncActionsObj,
  IAsyncProduce,
  IHooks,
  IHooksObj,
  IProduce,
  IUseProduce,
  IUseStore,
  Selector,
  toAnonFunction,
  useIsomorphicLayoutEffect,
  useUpdate,
} from "./common";
import { connectDevTools, ReduxDevTools } from "./plugins/devTools";
import {
  connectPersistenceStorage,
  IPersistenceOptions,
  PersistenceStoragePlugin,
} from "./plugins/persistenceStorage";

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
 * @template TAsyncActions
 * Object that defines the custom async actions of the store.
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
 *   useActions: () => IActionsObj<TStore, typeof options> & IAsyncActionsObj<TStore, typeof options>;
 *   hooks: IHooksObj<TStore, typeof options>;
 * }}
 * Resulting object containing of the store.
 */
export function createStoreContext<
  TStore,
  THooks extends IHooks<TStore>,
  TActions extends IActions<TStore>,
  TAsyncActions extends IAsyncActions<TStore>
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
     * Custom async actions.
     *
     * @type {Record<string, (produce: (draft: (draft: Draft<TStore>) => void | TStore) => Immutable<TStore>) => (...args: any[]) => (draft: Draft<TStore>) => void | TStore>}
     */
    asyncActions?: TAsyncActions;
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

    /**
     * Storage persistence options for the store.
     * By default uses window.localStorage
     *
     * @type {IPersistenceOptions}
     */
    storagePersistence?: IPersistenceOptions;
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
   * @type {() => Record<string, (...props:any[]) => TStore | Promise<TStore>>}
   */
  useActions: () => IActionsObj<TStore, typeof options> &
    IAsyncActionsObj<TStore, typeof options>;
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

  if (process.env.NODE_ENV !== "production") {
    if (options?.actions && options.asyncActions) {
      const asyncActionsKeys = Object.keys(options.asyncActions);

      for (const key in options.actions) {
        if (asyncActionsKeys.includes(key)) {
          throw new Error(
            `All the actions and asyncActions should have different names and "${key}" exists in both objects!`
          );
        }
      }
    }
  }

  const createStoragePersistenceInstance = (
    produceStore: IProduce<TStore>,
    debugName?: string | null
  ) => {
    if (options?.storagePersistence?.isActive) {
      if (typeof initialStore !== "object" || Array.isArray(initialStore))
        throw new Error(
          "For local storage persistence your store has to be an object"
        );

      let persistenceKey: string | undefined;
      if (options.storagePersistence.persistenceKey) {
        persistenceKey = options.storagePersistence.persistenceKey;
      } else if (options.devName) {
        persistenceKey = options.devName;
      }

      if (!persistenceKey)
        throw new Error("You have to specify persistence key or devName");

      if (debugName) {
        persistenceKey += "-" + debugName;
      } else if (debugName === null) {
        persistenceKey += "-noProvider";
      }

      return connectPersistenceStorage({
        persistenceKey,
        produce: produceStore,
        debounceWait: options.storagePersistence.debounceWait,
        persistenceMethod: options.storagePersistence.persistenceMethod,
        isSSR: options.storagePersistence.isSSR,
      });
    }
    return null;
  };

  const createDevToolsInstance = (debugName?: string | null) => {
    if (
      options?.devName &&
      (options.devToolsInProduction || process.env.NODE_ENV !== "production")
    ) {
      let devToolsName: string;
      if (debugName) {
        devToolsName = options.devName + "-" + debugName;
      } else if (debugName === null) {
        devToolsName = options.devName + "-noProvider";
      } else {
        devToolsName = options.devName;
      }
      const devTools = connectDevTools(devToolsName);
      if (devTools) {
        devTools.init(initialStore);
      }
      return devTools;
    }
    return undefined;
  };

  type IStore = {
    store: Immutable<TStore>;
    listeners: Map<
      ParametricSelector<Immutable<TStore>, unknown, unknown>,
      unknown
    >;
    devTools: ReduxDevTools | undefined;
    actions?: IActionsObj<TStore, typeof options> &
      IAsyncActionsObj<TStore, typeof options>;
    produce: {
      produce: IProduce<TStore>;
      asyncProduce: IAsyncProduce<TStore>;
    };
    storagePersistence?: PersistenceStoragePlugin | null;
  };

  const createProduceObj = (
    storeRef: Pick<
      IStore,
      "devTools" | "store" | "listeners" | "storagePersistence"
    >
  ) => {
    return {
      produce: (draft?: (draft: Draft<TStore>) => void) => {
        if (typeof draft !== "function") return storeRef.store;

        if (storeRef.devTools) {
          const produceFn = produceWithPatches<
            (draft: Draft<TStore>) => void,
            [Draft<TStore>],
            TStore
          >(draft);

          const produceResult = produceFn(storeRef.store);

          storeRef.store = produceResult[0];
          storeRef.devTools.send(
            {
              type: "produce",
              payload: produceResult[1],
            },
            storeRef.store
          );
        } else {
          const produceFn = produce<
            (draft: Draft<TStore>) => void,
            [Draft<TStore>],
            TStore
          >(draft);

          storeRef.store = produceFn(storeRef.store);
        }

        storeRef.listeners.forEach((props, listener) => {
          listener(storeRef.store, props);
        });

        storeRef.storagePersistence?.setState(storeRef.store);

        return storeRef.store;
      },
      asyncProduce: async (draft?: (draft: Draft<TStore>) => Promise<void>) => {
        if (typeof draft !== "function") return storeRef.store;

        const storeDraft = createDraft(storeRef.store as TStore);

        await Promise.resolve(draft(storeDraft));

        finishDraft(storeDraft, (changes) => {
          if (changes.length) {
            storeRef.store = applyPatches(storeRef.store, changes);

            if (storeRef.devTools) {
              storeRef.devTools.send(
                {
                  type: "asyncProduce",
                  payload: changes,
                },
                storeRef.store
              );
            }

            storeRef.listeners.forEach((props, listener) => {
              listener(storeRef.store, props);
            });
          }
        });

        storeRef.storagePersistence?.setState(storeRef.store);

        return storeRef.store;
      },
    };
  };

  const providerRefCallback = (debugName?: string | null) => () => {
    const storeRef: Pick<
      IStore,
      "store" | "listeners" | "devTools" | "storagePersistence"
    > &
      Partial<Pick<IStore, "produce">> = {
      store: initialStore,
      listeners: new Map<Selector<Immutable<TStore>>, unknown /* props */>(),
      devTools: createDevToolsInstance(debugName),
    };

    const produceObj = createProduceObj(storeRef);

    storeRef.produce = produceObj;

    storeRef.storagePersistence = createStoragePersistenceInstance(
      produceObj.produce,
      debugName
    );

    return Object.assign(storeRef, { produce: produceObj });
  };

  const StoreContext = createContext<MutableRefObject<IStore>>({
    current: providerRefCallback(null)(),
  });

  const Provider: FunctionComponent<{ debugName?: string }> = memo(
    ({ children, debugName }) => {
      const initialRef = useMemo(providerRefCallback(debugName), emptyArray);
      const value = useRef(initialRef);

      return createElement(StoreContext.Provider, {
        value,
        children,
      });
    }
  );

  const useStore = () => {
    const storeCtx = useContext(StoreContext);
    const update = useUpdate(storeCtx.current.storagePersistence);

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

    return storeCtx.current.produce;
  };

  const useActions = () => {
    const storeCtx = useContext(StoreContext);
    const produceObj = useProduce();

    return useMemo(() => {
      if (storeCtx.current.actions === undefined) {
        const actionsObj: Record<
          string,
          (...args: unknown[]) => Immutable<TStore>
        > = {};

        const asyncActionsObj: Record<
          string,
          (...args: unknown[]) => Promise<Immutable<TStore>>
        > = {};

        for (const [actionName, actionFn] of Object.entries(
          options?.actions || {}
        )) {
          actionsObj[actionName] = (...args) => {
            const actionDraft = actionFn(...args, produceObj.produce);

            if (storeCtx.current.devTools) {
              const produceFn = produceWithPatches<
                (draft: Draft<TStore>) => void,
                [Draft<TStore>],
                TStore
              >(actionDraft);

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
              >(actionDraft);

              storeCtx.current.store = produceFn(storeCtx.current.store);
            }
            storeCtx.current.listeners.forEach((props, listener) => {
              listener(storeCtx.current.store, props);
            });

            return storeCtx.current.store;
          };
        }
        for (const [actionName, actionFn] of Object.entries(
          options?.asyncActions || {}
        )) {
          asyncActionsObj[actionName] = async (...args) => {
            await actionFn(produceObj.produce)(...args);

            return storeCtx.current.store;
          };
        }

        storeCtx.current.actions = ({
          ...actionsObj,
          ...asyncActionsObj,
        } as unknown) as IActionsObj<TStore, typeof options> &
          IAsyncActionsObj<TStore, typeof options>;
      }

      return storeCtx.current.actions;
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

      const update = useUpdate(storeCtx.current.storagePersistence);

      const props = useMemo(
        toAnonFunction(hooksProps),
        hookPropsDeps || [hooksProps]
      );

      const isMountedRef = useRef(false);

      const { updateSelector, initialStateRef } = useMemo(() => {
        return {
          updateSelector: createSelector(hookSelector, (result) => {
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
