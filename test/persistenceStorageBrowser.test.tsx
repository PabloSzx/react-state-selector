import waitForExpect from "wait-for-expect";

import { cleanup, renderHook } from "@testing-library/react-hooks";

import { createStore } from "../src";
import { mockLocalStorage } from "./utils/localStorage";

afterEach(async () => {
  await cleanup();
});

describe("default persistence on localStorage works", () => {
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

    // const StoreSSR = createStore({a: 1}, {
    //   storagePersistence: {
    //     persistenceKey,
    //     isActive: true,
    //     isSSR: true
    //   }
    // })
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
