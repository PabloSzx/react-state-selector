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
import { useEffect, useMemo, useRef } from "react";
import { createSelector } from "reselect";

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
  IUseStore,
  Selector,
  toAnonFunction,
  useIsomorphicLayoutEffect,
  useUpdate,
  Constants,
  getPromiseWithCallbacks,
} from "./common";
import { connectDevTools, ReduxDevTools } from "./plugins/devTools";
import {
  connectPersistenceStorage,
  IPersistenceOptions,
  PersistenceStoragePlugin,
} from "./plugins/persistenceStorage";

/**
 *  Create **react-state-selector** global store
 */
export function createStore<
  TStore,
  THooks extends IHooks<TStore>,
  TActions extends IActions<TStore>,
  TAsyncActions extends IAsyncActions<TStore>
>(
  initialStore: Immutable<TStore>,
  options?: {
    /**
     * Custom hooks.
     */
    hooks?: THooks;
    /**
     * Custom actions.
     */
    actions?: TActions;
    /**
     * Custom async actions.
     */
    asyncActions?: TAsyncActions;
    /**
     * Name used to activate Redux DevTools.
     */
    devName?: string;
    /**
     * Flag to manually activate the usage of the Redux DevTools in production.
     */
    devToolsInProduction?: boolean;

    /**
     * Storage persistence for the store.
     * By default uses window.localStorage
     */
    storagePersistence?: IPersistenceOptions;
  }
): {
  /**
   * useStore: default hook that listens for any change in the store.
   */
  useStore: IUseStore<TStore>;
  /**
   * direct function to mutate the store
   */
  produce: IProduce<TStore>;
  /**
   * Async version of produce
   */
  asyncProduce: IAsyncProduce<TStore>;
  /**
   * Object containing the custom hooks specified in the options
   */
  hooks: IHooksObj<TStore, typeof options>;
  /**
   * Object containing the custom actions specified in the options
   */
  actions: IActionsObj<TStore, typeof options>;
  /**
   * Object containing the custom actions specified in the options
   */
  asyncActions: IAsyncActionsObj<TStore, typeof options>;
  /**
   * Promise that resolves when the store is ready to be used.
   * Only useful when using an Async Storage Persistance, like AsyncStorage from React Native
   */
  isReady: Promise<void>;
} {
  if (Constants.IS_NOT_PRODUCTION) {
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

  if (Constants.IS_NOT_PRODUCTION) {
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

  let devTools: ReduxDevTools | undefined;
  let localStoragePlugin: PersistenceStoragePlugin<TStore> | undefined | null;
  let isReady = Promise.resolve();

  if (
    options?.devName &&
    (options.devToolsInProduction || Constants.IS_NOT_PRODUCTION)
  ) {
    devTools = connectDevTools(options.devName);
  }

  const listeners = new Map<Selector<Immutable<TStore>>, unknown /* props */>();

  let currentStore = initialStore;

  if (devTools) {
    devTools.init(currentStore);
  }

  const useStore = () => {
    const update = useUpdate(localStoragePlugin);

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
    produce: (draft) => {
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

      localStoragePlugin?.setState(currentStore as TStore);

      return currentStore;
    },
    asyncProduce: async (draft) => {
      if (typeof draft !== "function") return currentStore;

      const storeDraft = createDraft(currentStore as TStore);

      await Promise.resolve(draft(storeDraft));

      finishDraft(storeDraft, (changes) => {
        if (changes.length) {
          currentStore = applyPatches(currentStore, changes);

          if (devTools) {
            devTools.send(
              { type: "asyncProduce", payload: changes },
              currentStore
            );
          }

          listeners.forEach((props, listener) => {
            listener(currentStore, props);
          });
        }
      });

      localStoragePlugin?.setState(currentStore as TStore);

      return currentStore;
    },
  };

  if (options?.storagePersistence?.isActive) {
    const { promise, resolve, reject } = getPromiseWithCallbacks();
    isReady = promise;
    if (typeof initialStore !== "object" || Array.isArray(initialStore))
      throw new Error(
        "For local storage persistence your store has to be an object"
      );

    const persistenceKey =
      options.storagePersistence.persistenceKey || options.devName;

    if (!persistenceKey)
      throw new Error("You have to specify persistence key or devName");

    localStoragePlugin = connectPersistenceStorage({
      persistenceKey,
      produce: produceObj.produce,
      debounceWait: options.storagePersistence.debounceWait,
      persistenceMethod: options.storagePersistence.persistenceMethod,
      isSSR: options.storagePersistence.isSSR,
      resolve,
      reject,
    });
  }

  const actionsObj: Record<
    string,
    (...args: unknown[]) => Immutable<TStore>
  > = {};

  const asyncActionsObj: Record<
    string,
    (...args: unknown[]) => Promise<Immutable<TStore>>
  > = {};

  for (const [actionName, actionFn] of Object.entries(options?.actions || {})) {
    actionsObj[actionName] = (...args) => {
      const actionDraft = actionFn(...args);

      if (devTools) {
        const produceFn = produceWithPatches<
          (draft: Draft<TStore>) => void,
          [Draft<TStore>],
          TStore
        >(actionDraft);

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
        >(actionDraft);

        currentStore = produceFn(currentStore);
      }

      listeners.forEach((props, listener) => {
        listener(currentStore, props);
      });

      localStoragePlugin?.setState(currentStore as TStore);

      return currentStore;
    };
  }

  for (const [actionName, actionFn] of Object.entries(
    options?.asyncActions || {}
  )) {
    asyncActionsObj[actionName] = async (...args) => {
      await actionFn(produceObj.produce)(...args);

      return currentStore;
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
      const update = useUpdate(localStoragePlugin);

      const props = useMemo(
        toAnonFunction(hooksProps),
        hookPropsDeps || [hooksProps]
      );

      const firstSelectorCall = useRef(true);

      const { updateSelector, initialStateRef } = useMemo(() => {
        return {
          updateSelector: createSelector(hookSelector, (result) => {
            stateRef.current = result;

            if (firstSelectorCall.current) {
              firstSelectorCall.current = false;
            } else {
              update();
            }
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
    asyncActions: (asyncActionsObj as unknown) as IAsyncActionsObj<
      TStore,
      typeof options
    >,
    hooks: (hooksObj as unknown) as IHooksObj<TStore, typeof options>,
    isReady,
    ...produceObj,
  };
}
