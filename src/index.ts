/* eslint react-hooks/rules-of-hooks: 0 */

import { createDraft, Draft, finishDraft, Immutable, produce } from "immer";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { createSelector, ParametricSelector } from "reselect";

import useUpdate from "./utils/useUpdate";

export type Selector<
  TState,
  TProps = unknown | (() => unknown),
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

export function createStore<
  TStore,
  THooks extends Record<string, Selector<Immutable<TStore>>>,
  TActions extends Record<
    string,
    (...args: unknown[]) => (draft: Draft<TStore>) => unknown
  >
>(
  initialStore: Immutable<TStore>,
  options?: { hooks?: THooks; actions?: TActions }
): {
  useStore: () => Immutable<TStore>;
  useProduce: () => {
    asyncProduce: (
      draft: (draft: Draft<TStore>) => Promise<void>
    ) => Promise<Immutable<TStore>>;
    produce: (draft: (draft: Draft<TStore>) => void) => Immutable<TStore>;
  };
} & {
  [HookName in keyof NonNullable<typeof options>["hooks"]]: (
    props?:
      | Parameters<NonNullable<typeof options>["hooks"][HookName]>[1]
      | (() => Parameters<NonNullable<typeof options>["hooks"][HookName]>[1]),
    propsDeps?: any[]
  ) => ReturnType<NonNullable<typeof options>["hooks"][HookName]>;
} &
  {
    [ActionName in keyof NonNullable<typeof options>["actions"]]: (
      ...args: Parameters<NonNullable<typeof options>["actions"][ActionName]>
    ) => ReturnType<
      ReturnType<NonNullable<typeof options>["actions"][ActionName]>
    >;
  } {
  if (process.env.NODE_ENV === "development") {
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

        return currentStore;
      },
      asyncProduce: async (draft: (draft: Draft<TStore>) => Promise<void>) => {
        const storeDraft = createDraft(currentStore as TStore);

        await Promise.resolve(draft(storeDraft));

        currentStore = (finishDraft(storeDraft) as any) as Immutable<TStore>;

        listeners.forEach((props, listener) => {
          listener(currentStore, props);
        });

        return currentStore;
      }
    };
  };

  const actionsObj: Record<
    string,
    (...args: unknown[]) => Promise<unknown>
  > = {};

  for (const [actionName, actionFn] of Object.entries(options?.actions || {})) {
    actionsObj[actionName] = async (...args) => {
      const storeDraft = createDraft(currentStore as TStore);

      const actionDraft = actionFn(...args);

      const ownDraftResult = await Promise.resolve(actionDraft(storeDraft));

      currentStore = (finishDraft(storeDraft) as any) as Immutable<TStore>;

      listeners.forEach((props, listener) => {
        listener(currentStore, props);
      });

      return ownDraftResult;
    };
  }

  const hooksObj: Record<
    string,
    (hookProps?: (() => unknown) | unknown, hookPropsDeps?: any[]) => unknown
  > = {};

  for (const [hookName, hookSelector] of Object.entries(options?.hooks || {})) {
    hooksObj[hookName] = (
      hooksProps?: (() => unknown) | unknown,
      hookPropsDeps?: any[]
    ) => {
      const update = useUpdate();

      const props = useMemo(
        toAnonFunction(hooksProps),
        hookPropsDeps || [hooksProps]
      );

      const isMountedRef = useRef(false);
      const stateRef = useRef(hookSelector(currentStore, props));
      const updateSelectorRef = useRef(
        createSelector(hookSelector, result => {
          stateRef.current = result;

          if (!isMountedRef.current) {
            return;
          }

          update();
        })
      );

      useIsomorphicLayoutEffect(() => {
        updateSelectorRef.current(currentStore, props);

        listeners.set(updateSelectorRef.current, props);
      }, [props]);

      useEffect(() => {
        isMountedRef.current = true;

        return () => {
          listeners.delete(updateSelectorRef.current);
        };
      }, []);

      return stateRef.current;
    };
  }

  return {
    useStore,
    useProduce,
    ...actionsObj,
    ...hooksObj
  };
}
