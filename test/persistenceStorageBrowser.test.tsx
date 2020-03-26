import { createElement } from "react";
import waitForExpect from "wait-for-expect";

import { act, cleanup, renderHook } from "@testing-library/react-hooks";

import { createStore, createStoreContext } from "../src";
import { mockLocalStorage } from "./utils/localStorage";

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

    await expect(Store.actions.asyncIncrement()).resolves.toEqual({
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
});

describe("createStoreContext", () => {
  test("correct usage", async () => {
    const persistenceKey = "createStoreCtx";

    localStorage.setItem(persistenceKey, JSON.stringify({ a: 4 }));

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

    const wrapper = (debugName: string, store: typeof StoreRemember) => (
      props: any
    ) => {
      return createElement(store.Provider, {
        debugName,
        ...props,
      });
    };

    const rememberedState = renderHook(
      () => {
        const store = StoreRemember.useStore();
        const produce = StoreRemember.useProduce();

        return { store, produce };
      },
      {
        wrapper: wrapper(persistenceKey, StoreRemember),
      }
    );

    const notRememberedState = renderHook(
      () => {
        const store = StoreNoRemember.useStore();
        const produce = StoreNoRemember.useProduce();

        return { store, produce };
      },
      {
        wrapper: wrapper(persistenceKey, StoreNoRemember),
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

    expect(localStorage.getItem(persistenceKey)).toEqual(
      JSON.stringify({ a: 4 })
    );

    await waitForExpect(async () => {
      expect(localStorage.getItem(persistenceKey)).toEqual(
        JSON.stringify({ a: 100 })
      );
    });

    expect(localStorage.getItem(persistenceKey)).toEqual(
      JSON.stringify({ a: 100 })
    );
  });

  test("no provider should work anyway", async () => {
    const persistenceKey = "noProviderStoreCtx";

    localStorage.setItem(persistenceKey, JSON.stringify({ a: 10 }));

    const Store = createStoreContext(
      {
        a: 1,
      },
      {
        storagePersistence: {
          debounceWait: 1000,
          persistenceKey,
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

    expect(localStorage.getItem(persistenceKey)).toBe(
      JSON.stringify({ a: 10 })
    );

    await waitForExpect(() => {
      expect(localStorage.getItem(persistenceKey)).toBe(
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
    }).toThrowError(
      "You have to specify persistence key, debugName or devName"
    );
  });
});
