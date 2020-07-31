import { IPersistenceMethod, IProduce, isClientSide } from "../common";
import { isPromise } from "../utils/isPromise";

export type PersistenceStoragePlugin<T = any> = {
  getState: () => void | Promise<void>;
  setState: (state: T) => void | Promise<void>;
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
  debounceWait: number | undefined;
  persistenceMethod?: IPersistenceMethod | undefined;
  isSSR: boolean | undefined;
  resolve: () => void;
  reject: (reason?: any) => void;
};

export const connectPersistenceStorage = ({
  persistenceKey: persistenceName,
  produce,
  debounceWait = 3000,
  persistenceMethod = isClientSide ? window.localStorage : undefined,
  isSSR,
  resolve,
  reject,
}: ConnectPersistenceStorageArgs): PersistenceStoragePlugin | null => {
  if (!persistenceMethod) return null;

  let isConnected = false;
  let timeout: NodeJS.Timeout | undefined;

  const setStateFn = (state: unknown) => {
    const possiblePromise = persistenceMethod.setItem(
      persistenceName,
      JSON.stringify(state)
    );

    if (isPromise(possiblePromise)) {
      return possiblePromise.then(() => {
        isConnected = true;
      });
    }
    if (!isConnected) isConnected = true;
    return void 0;
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
    if (isConnected || !persistenceMethod) {
      resolve();
      return void 0;
    }

    try {
      const statePromise = persistenceMethod.getItem(persistenceName);

      if (isPromise(statePromise)) {
        return statePromise
          .then((state) => {
            if (state == null) {
              isConnected = true;
              resolve();
              return void 0;
            }

            produce(() => ({
              ...produce(),
              ...JSON.parse(state),
            }));
            isConnected = true;
            resolve();
            return void 0;
          })
          .catch(reject);
      } else {
        if (statePromise == null) {
          isConnected = true;
          resolve();
          return void 0;
        }

        produce(() => ({
          ...produce(),
          ...JSON.parse(statePromise),
        }));
        isConnected = true;
        resolve();
        return void 0;
      }
    } catch (err) {
      reject(err);
      return void 0;
    }
  };

  if (isSSR) {
    resolve();
  } else {
    getState();
  }

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
