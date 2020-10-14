import { createElement } from "react";
import waitForExpect from "wait-for-expect";

import { act, cleanup, renderHook } from "@testing-library/react-hooks";

import { createStore, createStoreContext, IPersistenceMethod } from "../src";
import { mockLocalStorage, mockAsyncLocalStorage } from "./utils/localStorage";

afterEach(async () => {
  await cleanup();
});

describe("createStore", () => {
  test("gets data from localStorage", () => {
    const initialState = { a: 1 };
    const rememberedInitialState = { a: 2 };
    const persistenceKey = "gets_data_from_localStorage";
    localStorage.setItem(
      persistenceKey,
      JSON.stringify(rememberedInitialState)
    );
    const StoreRemember = createStore(initialState, {
      storagePersistence: {
        persistenceKey,
        isActive: true,
      },
    });

    localStorage.removeItem(persistenceKey);
    const StoreNoRemember = createStore(initialState, {
      storagePersistence: {
        persistenceKey,
        isActive: true,
      },
    });

    expect(StoreNoRemember.produce()).toEqual(initialState);
    expect(StoreRemember.produce()).toEqual(rememberedInitialState);
  });

  test("debounces calls to the persistence method", async () => {
    const initialState = { a: 1 };
    const rememberedInitialState = { a: 2 };
    const persistenceKey = "gets_data_from_localStorage";

    const mockedLocalStorage = mockLocalStorage();

    localStorage.setItem(
      persistenceKey,
      JSON.stringify(rememberedInitialState)
    );

    const StoreRemember = createStore(initialState, {
      storagePersistence: {
        persistenceKey,
        isActive: true,
        debounceWait: 1000,
      },
    });

    expect(mockedLocalStorage.localStorageMock.getItem).toBeCalledTimes(1);

    expect(mockedLocalStorage.localStorageMock.setItem).toBeCalledTimes(1);

    expect(StoreRemember.produce()).toEqual(rememberedInitialState);

    expect(
      StoreRemember.produce((draft) => {
        draft.a = 4;
      })
    );

    expect(StoreRemember.produce()).toEqual({ a: 4 });

    expect(mockedLocalStorage.localStorageMock.setItem).toBeCalledTimes(1);

    expect(window.localStorage.getItem(persistenceKey)).toEqual(
      JSON.stringify({ a: 2 })
    );

    expect(
      StoreRemember.produce((draft) => {
        draft.a = 5;
      })
    );

    expect(StoreRemember.produce()).toEqual({ a: 5 });

    expect(
      StoreRemember.produce((draft) => {
        draft.a = 6;
      })
    );
    expect(StoreRemember.produce()).toEqual({ a: 6 });

    await waitForExpect(
      async () => {
        expect(mockedLocalStorage.localStorageMock.setItem).toBeCalledTimes(2);
      },
      1000,
      100
    );

    expect(window.localStorage.getItem(persistenceKey)).toEqual(
      JSON.stringify({ a: 6 })
    );

    expect(mockedLocalStorage.localStorageMock.getItem).toBeCalledTimes(3);

    mockedLocalStorage.unmockLocalStorage();
  });

  test("edge cases", () => {
    const persistenceKey = "edgeCasesBrowser";
    const Store = createStore(
      { a: 1 },
      {
        storagePersistence: {
          persistenceKey,
          isActive: true,
          isSSR: true,
        },
      }
    );

    const Case1 = renderHook(() => {
      return Store.useStore();
    });

    const Case2 = renderHook(() => {
      return Store.useStore();
    });

    expect(Case1.result.current).toEqual({ a: 1 });
    expect(Case2.result.current).toEqual({ a: 1 });
  });

  test("throws sync persistenceMethod error", () => {
    const persistenceMethod: IPersistenceMethod = {
      getItem(_key: string) {
        throw Error("get");
      },
      setItem(_key: string) {
        throw Error("set");
      },
    };

    expect(
      createStore(
        { a: 1 },
        {
          storagePersistence: {
            persistenceKey: "zxczxc",
            isActive: true,
            persistenceMethod,
          },
        }
      ).isReady
    ).rejects.toEqual(Error("get"));
  });
  test("throws async persistenceMethod error", () => {
    const persistenceMethod: IPersistenceMethod = {
      async getItem(_key: string) {
        throw Error("get");
      },
      async setItem(_key: string) {
        throw Error("set");
      },
    };

    expect(
      createStore(
        { a: 1 },
        {
          storagePersistence: {
            persistenceKey: "zxczxc",
            isActive: true,
            persistenceMethod,
          },
        }
      ).isReady
    ).rejects.toEqual(Error("get"));
  });

  test("work with asyncProduce, actions and asyncActions", async () => {
    const persistenceKey = "asyncStore";
    const storagePersistence = mockLocalStorage();
    const Store = createStore(
      {
        a: 1,
      },
      {
        actions: {
          increment: () => (draft) => {
            draft.a += 1;
          },
        },
        asyncActions: {
          asyncIncrement: (produce) => async () => {
            produce((draft) => {
              draft.a += 1;
            });
          },
        },
        storagePersistence: {
          debounceWait: 500,
          persistenceKey,
          isActive: true,
          persistenceMethod: storagePersistence.localStorageMock,
        },
      }
    );

    expect(Store.produce()).toEqual({ a: 1 });

    expect(storagePersistence.localStorageMock.setItem).toBeCalledTimes(0);

    expect(storagePersistence.localStorageMock.getItem).toBeCalledTimes(1);

    await expect(
      Store.asyncProduce(async (draft) => {
        draft.a += 1;
      })
    ).resolves.toEqual({ a: 2 });

    await waitForExpect(() => {
      expect(storagePersistence.localStorageMock.setItem).toBeCalledTimes(1);
    });

    expect(storagePersistence.localStorageMock.getItem(persistenceKey)).toBe(
      JSON.stringify({ a: 2 })
    );

    expect(storagePersistence.localStorageMock.getItem).toBeCalledTimes(2);

    expect(Store.actions.increment()).toEqual({ a: 3 });

    expect(storagePersistence.localStorageMock.getItem).toBeCalledTimes(2);

    await expect(Store.asyncActions.asyncIncrement()).resolves.toEqual({
      a: 4,
    });

    expect(storagePersistence.localStorageMock.getItem(persistenceKey)).toBe(
      JSON.stringify({ a: 2 })
    );

    expect(storagePersistence.localStorageMock.getItem).toBeCalledTimes(3);

    expect(storagePersistence.localStorageMock.setItem).toBeCalledTimes(1);

    await waitForExpect(() => {
      expect(storagePersistence.localStorageMock.setItem).toBeCalledTimes(2);
    });

    expect(storagePersistence.localStorageMock.getItem(persistenceKey)).toBe(
      JSON.stringify({ a: 4 })
    );

    storagePersistence.unmockLocalStorage();
  });

  test("throw incorrect store type", () => {
    expect(() => {
      createStore([], {
        storagePersistence: {
          isActive: true,
          persistenceKey: "asd",
        },
      });
    }).toThrowError(
      "For local storage persistence your store has to be an object"
    );
  });

  test("throw no persistence key nor dev name", () => {
    expect(() => {
      createStore(
        {},
        {
          storagePersistence: {
            isActive: true,
          },
        }
      );
    }).toThrowError("You have to specify persistence key or devName");
  });

  test("gets data from async localStorage", async () => {
    const initialState = { a: 1 };
    const rememberedInitialState = { a: 2 };
    const persistenceKey = "gets_data_from_localStorage";
    const persistenceMethod = mockAsyncLocalStorage();

    await persistenceMethod.setItem(
      persistenceKey,
      JSON.stringify(rememberedInitialState)
    );

    const StoreRemember = createStore(initialState, {
      storagePersistence: {
        persistenceKey,
        isActive: true,
        persistenceMethod,
      },
    });

    await StoreRemember.isReady;

    await persistenceMethod.removeItem(persistenceKey);

    const StoreNoRemember = createStore(initialState, {
      storagePersistence: {
        persistenceKey,
        isActive: true,
        persistenceMethod,
      },
    });

    await StoreNoRemember.isReady;

    expect(StoreNoRemember.produce()).toEqual(initialState);
    expect(StoreRemember.produce()).toEqual(rememberedInitialState);
  });
});

describe("createStoreContext", () => {
  test("correct usage", async () => {
    const persistenceKey = "createStoreCtx";

    const localStorageKeyDebugName = persistenceKey + "-" + persistenceKey;

    localStorage.setItem(localStorageKeyDebugName, JSON.stringify({ a: 4 }));
    localStorage.setItem(persistenceKey, JSON.stringify({ a: 5 }));

    const StoreRemember = createStoreContext(
      {
        a: 1,
      },
      {
        devName: persistenceKey,
        storagePersistence: {
          persistenceKey,
          isActive: true,
        },
      }
    );

    const StoreNoRemember = createStoreContext(
      {
        a: 1,
      },
      {
        devName: persistenceKey,
        storagePersistence: {
          persistenceKey,
          isActive: false,
          debounceWait: 1000,
        },
      }
    );

    const StoreRememberNoDebugName = createStoreContext(
      {
        a: 1,
      },
      {
        storagePersistence: {
          persistenceKey,
          isActive: true,
        },
      }
    );

    const wrapper = ({
      debugName,
      store,
    }: {
      debugName?: string;
      store: typeof StoreRemember;
    }) => (props: any) => {
      return createElement(store.Provider, {
        debugName,
        ...props,
      });
    };

    const rememberedStateNoDebugName = renderHook(
      () => {
        const store = StoreRememberNoDebugName.useStore();
        const produce = StoreRememberNoDebugName.useProduce();

        return { store, produce };
      },
      {
        wrapper: wrapper({ store: StoreRememberNoDebugName }),
      }
    );

    expect(rememberedStateNoDebugName.result.current.store).toEqual({
      a: 5,
    });

    expect(localStorage.getItem(persistenceKey)).toBe(
      JSON.stringify({
        a: 5,
      })
    );

    const rememberedState = renderHook(
      () => {
        const store = StoreRemember.useStore();
        const produce = StoreRemember.useProduce();

        return { store, produce };
      },
      {
        wrapper: wrapper({ debugName: persistenceKey, store: StoreRemember }),
      }
    );

    const notRememberedState = renderHook(
      () => {
        const store = StoreNoRemember.useStore();
        const produce = StoreNoRemember.useProduce();

        return { store, produce };
      },
      {
        wrapper: wrapper({ debugName: persistenceKey, store: StoreNoRemember }),
      }
    );

    expect(rememberedState.result.current.store).toEqual({ a: 4 });
    expect(notRememberedState.result.current.store).toEqual({ a: 1 });

    act(() => {
      rememberedState.result.current.produce.produce((draft) => {
        draft.a = 10;
      });

      notRememberedState.result.current.produce.produce((draft) => {
        draft.a = 20;
      });
    });

    expect(rememberedState.result.current.store).toEqual({ a: 10 });
    expect(notRememberedState.result.current.store).toEqual({ a: 20 });

    await act(async () => {
      rememberedState.result.current.produce.asyncProduce(async (draft) => {
        draft.a = 100;
      });

      notRememberedState.result.current.produce.asyncProduce(async (draft) => {
        draft.a = 200;
      });
    });

    expect(rememberedState.result.current.store).toEqual({ a: 100 });
    expect(notRememberedState.result.current.store).toEqual({ a: 200 });

    expect(localStorage.getItem(localStorageKeyDebugName)).toEqual(
      JSON.stringify({ a: 4 })
    );

    await waitForExpect(async () => {
      expect(localStorage.getItem(localStorageKeyDebugName)).toEqual(
        JSON.stringify({ a: 100 })
      );
    });

    expect(localStorage.getItem(localStorageKeyDebugName)).toEqual(
      JSON.stringify({ a: 100 })
    );
  });

  test("no provider should work anyway", async () => {
    const persistenceKey = "noProviderStoreCtx";

    const localStorageKey = persistenceKey + "-noProvider";
    localStorage.setItem(localStorageKey, JSON.stringify({ a: 10 }));

    const Store = createStoreContext(
      {
        a: 1,
      },
      {
        devName: persistenceKey,
        storagePersistence: {
          debounceWait: 0,
          isActive: true,
        },
      }
    );

    const HookResult = renderHook(() => {
      const store = Store.useStore();
      const produce = Store.useProduce();

      return {
        store,
        produce,
      };
    });

    expect(HookResult.result.current.store).toEqual({ a: 10 });

    act(() => {
      HookResult.result.current.produce.produce((draft) => {
        draft.a = 20;
      });
    });

    expect(HookResult.result.current.store).toEqual({ a: 20 });

    await waitForExpect(() => {
      expect(localStorage.getItem(localStorageKey)).toBe(
        JSON.stringify({ a: 20 })
      );
    });
  });

  test("find wrong usage", () => {
    expect(() => {
      createStoreContext([], {
        storagePersistence: {
          isActive: true,
          persistenceKey: "asd",
        },
      });
    }).toThrowError(
      "For local storage persistence your store has to be an object"
    );

    expect(() => {
      createStoreContext(
        {},
        {
          storagePersistence: {
            isActive: true,
          },
        }
      );
    }).toThrowError("You have to specify persistence key or devName");
  });

  test("async localstorage correct usage", async () => {
    const persistenceKey = "createStoreCtx";

    const persistenceMethod = mockAsyncLocalStorage();
    const localStorageKeyDebugName = persistenceKey + "-" + persistenceKey;

    await persistenceMethod.setItem(
      localStorageKeyDebugName,
      JSON.stringify({ a: 4 })
    );
    await persistenceMethod.setItem(persistenceKey, JSON.stringify({ a: 5 }));

    const StoreRemember = createStoreContext(
      {
        a: 1,
      },
      {
        devName: persistenceKey,
        storagePersistence: {
          persistenceKey,
          isActive: true,
          persistenceMethod,
        },
      }
    );

    const StoreNoRemember = createStoreContext(
      {
        a: 1,
      },
      {
        devName: persistenceKey,
        storagePersistence: {
          persistenceKey,
          isActive: false,
          debounceWait: 1000,
          persistenceMethod,
        },
      }
    );

    const StoreRememberNoDebugName = createStoreContext(
      {
        a: 1,
      },
      {
        storagePersistence: {
          persistenceKey,
          isActive: true,
          persistenceMethod,
        },
      }
    );

    const wrapper = ({
      debugName,
      store,
    }: {
      debugName?: string;
      store: typeof StoreRemember;
    }) => (props: any) => {
      return createElement(store.Provider, {
        debugName,
        ...props,
      });
    };

    const rememberedStateNoDebugName = renderHook(
      () => {
        const store = StoreRememberNoDebugName.useStore();
        const produce = StoreRememberNoDebugName.useProduce();
        const isReady = StoreRememberNoDebugName.useIsReady();

        return { store, produce, isReady };
      },
      {
        wrapper: wrapper({ store: StoreRememberNoDebugName }),
      }
    );

    await act(async () => {
      await waitForExpect(async () => {
        expect(rememberedStateNoDebugName.result.current.isReady).toBe(true);
      });
    });

    expect(rememberedStateNoDebugName.result.current.store).toEqual({
      a: 5,
    });

    expect(await persistenceMethod.getItem(persistenceKey)).toBe(
      JSON.stringify({
        a: 5,
      })
    );

    const rememberedState = renderHook(
      () => {
        const store = StoreRemember.useStore();
        const produce = StoreRemember.useProduce();
        const isReady = StoreRemember.useIsReady();

        return { store, produce, isReady };
      },
      {
        wrapper: wrapper({ debugName: persistenceKey, store: StoreRemember }),
      }
    );

    const notRememberedState = renderHook(
      () => {
        const store = StoreNoRemember.useStore();
        const produce = StoreNoRemember.useProduce();
        const isReady = StoreNoRemember.useIsReady();

        return { store, produce, isReady };
      },
      {
        wrapper: wrapper({ debugName: persistenceKey, store: StoreNoRemember }),
      }
    );

    await act(async () => {
      await waitForExpect(async () => {
        expect(rememberedState.result.current.isReady).toBe(true);
        expect(notRememberedState.result.current.isReady).toBe(true);
      });
    });

    expect(rememberedState.result.current.store).toEqual({ a: 4 });
    expect(notRememberedState.result.current.store).toEqual({ a: 1 });

    act(() => {
      rememberedState.result.current.produce.produce((draft) => {
        draft.a = 10;
      });

      notRememberedState.result.current.produce.produce((draft) => {
        draft.a = 20;
      });
    });

    expect(rememberedState.result.current.store).toEqual({ a: 10 });
    expect(notRememberedState.result.current.store).toEqual({ a: 20 });

    await act(async () => {
      rememberedState.result.current.produce.asyncProduce(async (draft) => {
        draft.a = 100;
      });

      notRememberedState.result.current.produce.asyncProduce(async (draft) => {
        draft.a = 200;
      });
    });

    expect(rememberedState.result.current.store).toEqual({ a: 100 });
    expect(notRememberedState.result.current.store).toEqual({ a: 200 });

    expect(await persistenceMethod.getItem(localStorageKeyDebugName)).toEqual(
      JSON.stringify({ a: 4 })
    );

    await waitForExpect(async () => {
      expect(await persistenceMethod.getItem(localStorageKeyDebugName)).toEqual(
        JSON.stringify({ a: 100 })
      );
    });

    expect(await persistenceMethod.getItem(localStorageKeyDebugName)).toEqual(
      JSON.stringify({ a: 100 })
    );
  }, 10000);
});
