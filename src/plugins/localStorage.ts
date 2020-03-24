import { Immutable } from "immer";

import { IProduce, isClientSide } from "../common";

export type LocalStoragePlugin<T> = {
  getState: () => Immutable<T>;
  setState: (state: T) => void;
};

export const connectLocalStorage = <T>(
  persistenceName: string,
  defaultInitialState: T,
  produce: IProduce<T>,
  wait = 3000,
  persistenceMethod = isClientSide ? window.localStorage : undefined
): LocalStoragePlugin<T> => {
  let isConnected = false;
  let timeout: NodeJS.Timeout | undefined;

  const setStateFn = (state: T) => {
    if (persistenceMethod) {
      persistenceMethod.setItem(persistenceName, JSON.stringify(state));
      if (!isConnected) isConnected = true;
    }
  };

  const setState = (state: T) => {
    const execLater = () => {
      timeout = undefined;
      setStateFn(state);
    };
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(execLater, wait);
  };

  return {
    getState: () => {
      if (isConnected) return produce();

      try {
        const state = persistenceMethod?.getItem(persistenceName);

        if (state != null) {
          const connectedState = produce(() => ({
            ...produce(),
            ...JSON.parse(state),
          }));
          isConnected = true;
          return connectedState;
        }
      } catch (err) {}
      return defaultInitialState as Immutable<T>;
    },
    setState,
  };
};
