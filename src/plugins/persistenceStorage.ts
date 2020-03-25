import { IPersistenceMethod, IProduce, isClientSide } from "../common";

export type LocalStoragePlugin<T = any> = {
  getState: () => void;
  setState: (state: T) => void;
  current: Pick<
    ConnectPersistenceStorageArgs,
    "persistenceKey" | "isSSR" | "persistenceMethod" | "debounceWait"
  > & { isConnected: boolean };
};

export type ConnectPersistenceStorageArgs = {
  persistenceKey: string;
  produce: IProduce<any>;
  debounceWait?: number;
  persistenceMethod?: IPersistenceMethod | undefined;
  isSSR?: boolean;
};

export const connectPersistenceStorage = ({
  persistenceKey: persistenceName,
  produce,
  debounceWait = 3000,
  persistenceMethod = isClientSide ? window.localStorage : undefined,
  isSSR,
}: ConnectPersistenceStorageArgs): LocalStoragePlugin => {
  let isConnected = false;
  let timeout: NodeJS.Timeout | undefined;

  const setStateFn = (state: unknown) => {
    if (persistenceMethod) {
      persistenceMethod.setItem(persistenceName, JSON.stringify(state));
      if (!isConnected) isConnected = true;
    }
  };

  const setState = (state: unknown) => {
    const execLater = () => {
      timeout = undefined;
      setStateFn(state);
    };
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(execLater, debounceWait);
  };

  const getState = () => {
    if (isConnected || !persistenceMethod) return;

    try {
      const state = persistenceMethod.getItem(persistenceName);
      if (state == null) {
        isConnected = true;
        return;
      }

      produce(() => ({
        ...produce(),
        ...JSON.parse(state),
      }));
      isConnected = true;
    } catch (err) {}
  };

  if (!isSSR) getState();

  return {
    getState,
    setState,
    current: {
      persistenceKey: persistenceName,
      persistenceMethod,
      isSSR,
      isConnected,
      debounceWait,
    },
  };
};
