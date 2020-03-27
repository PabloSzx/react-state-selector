import { IPersistenceMethod, IProduce, isClientSide } from "../common";

export type PersistenceStoragePlugin<T = any> = {
  getState: () => void;
  setState: (state: T) => void;
  current: Pick<
    ConnectPersistenceStorageArgs,
    "persistenceKey" | "isSSR" | "persistenceMethod" | "debounceWait"
  > & { isConnected: boolean };
};

export type IPersistenceOptions = {
  /**
   * The amount of milliseconds for the
   * the debouncing of the calls to the
   * persistence method, by default 3000 ms
   *
   * @type {number}
   */
  debounceWait?: number;
  /**
   * The key used in the persistence method.
   * If not specified, it uses the "devName"
   *
   * @type {string}
   */
  persistenceKey?: string;
  /**
   * Flag to activate or deactivate the
   * persistence.
   * "false" by default.
   *
   * @type {boolean}
   */
  isActive?: boolean;
  /**
   * Persistence method used, by default it
   * uses localStorage
   *
   * @type {IPersistenceMethod}
   */
  persistenceMethod?: IPersistenceMethod;
  /**
   * Flag used to specify that this store
   * is going to be used in server side
   * rendering context, this flag prevents
   * client/server mismatched html
   * on client side hydration
   *
   * "false" by default.
   * @type {boolean}
   */
  isSSR?: boolean;
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
}: ConnectPersistenceStorageArgs): PersistenceStoragePlugin | null => {
  if (!persistenceMethod) return null;

  let isConnected = false;
  let timeout: NodeJS.Timeout | undefined;

  const setStateFn = (state: unknown) => {
    persistenceMethod.setItem(persistenceName, JSON.stringify(state));
    if (!isConnected) isConnected = true;
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
