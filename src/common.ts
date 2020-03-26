/* eslint react-hooks/exhaustive-deps: 0 */

import { Draft, enablePatches, Immutable } from "immer";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ParametricSelector } from "reselect";

import { PersistenceStoragePlugin } from "./plugins/persistenceStorage";

enablePatches();

export type Selector<
  TState,
  TProps = any,
  TResult = unknown
> = ParametricSelector<TState, TProps, TResult>;

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function toAnonFunction(arg: unknown): () => typeof arg {
  if (typeof arg === "function") return arg as () => typeof arg;

  return () => arg;
}

const incrementParameter = (num: number) => ++num;

export const emptyArray: [] = [];

export const useUpdate = (
  persistencePlugin?: PersistenceStoragePlugin | null
) => {
  const [, setState] = useState(0);

  useEffect(() => {
    if (persistencePlugin?.current.isSSR) {
      persistencePlugin.getState();
    }
  }, emptyArray);

  return useCallback(() => setState(incrementParameter), emptyArray);
};

export const isClientSide = typeof window !== "undefined";

type NN<T> = NonNullable<T>;

export type IProduce<TStore> = (
  draft?: (draft: Draft<TStore>) => void | TStore
) => Immutable<TStore>;

export type IAsyncProduce<TStore> = (
  draft?: (draft: Draft<TStore>) => Promise<void>
) => Promise<Immutable<TStore>>;

export type IHooks<TStore> = Record<string, Selector<Immutable<TStore>>>;

export type IActions<TStore> = Record<
  string,
  (...args: any[]) => (draft: Draft<TStore>) => void | TStore
>;

export type IAsyncActions<TStore> = Record<
  string,
  (produce: IProduce<TStore>) => (...args: any[]) => Promise<void>
>;

export type IHooksObj<
  TStore,
  A extends { hooks?: IHooks<TStore> } | undefined
> = {
  [HookName in keyof NN<NN<A>["hooks"]>]: (
    props: Parameters<NN<NN<A>["hooks"]>[HookName]>[1] extends undefined
      ? void
      :
          | Parameters<NN<NN<A>["hooks"]>[HookName]>[1]
          | (() => Parameters<NN<NN<A>["hooks"]>[HookName]>[1]),
    propsDeps?: unknown[]
  ) => ReturnType<NN<NN<A>["hooks"]>[HookName]>;
};

export type IActionsObj<
  TStore,
  A extends { actions?: IActions<TStore> } | undefined
> = {
  [ActionName in keyof NN<NN<A>["actions"]>]: (
    ...args: Parameters<NN<NN<A>["actions"]>[ActionName]>
  ) => Immutable<TStore>;
};

export type IAsyncActionsObj<
  TStore,
  A extends { asyncActions?: IAsyncActions<TStore> } | undefined
> = {
  [ActionName in keyof NN<NN<A>["asyncActions"]>]: (
    ...args: Parameters<ReturnType<NN<NN<A>["asyncActions"]>[ActionName]>>
  ) => Promise<Immutable<TStore>>;
};

export type IUseStore<TStore> = () => Immutable<TStore>;

export type IUseProduce<TStore> = () => {
  asyncProduce: IAsyncProduce<TStore>;
  produce: IProduce<TStore>;
};

export type IPersistenceMethod = {
  setItem(key: string, data: any): any;
  getItem(key: string): string | null;
};
