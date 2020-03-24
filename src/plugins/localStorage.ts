import { IProduce, isClientSide } from "../common";

export type LocalStoragePlugin<T> = {
  getState: () => void;
  setState: (state: T) => void;
};

export const connectLocalStorage = <T>(
  persistenceName: string,
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
      if (isConnected) return;

      try {
        const state = persistenceMethod?.getItem(persistenceName);
        if (state === undefined) {
          isConnected = true;
        } else if (state != null) {
          produce(() => ({
            ...produce(),
            ...JSON.parse(state),
          }));
          isConnected = true;
          return;
        }
      } catch (err) {}
      return;
    },
    setState,
  };
};
