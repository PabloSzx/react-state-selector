/**
 * @jest-environment node
 */

import waitForExpect from "wait-for-expect";

import { createStore } from "../src";
import { mockLocalStorage } from "./utils/localStorage";

describe("on server it gets ignored", () => {
  test("is ignored", () => {
    const initialState = { a: 1 };
    const persistenceKey = "gets_data_from_localStorage_server";

    const StoreRemember = createStore(initialState, {
      storagePersistence: {
        persistenceKey,
        isActive: true,
        isSSR: true,
      },
    });
    const StoreNoRemember = createStore(initialState, {
      storagePersistence: {
        persistenceKey,
        isActive: false,
      },
    });

    expect(StoreNoRemember.produce()).toEqual(initialState);
    expect(StoreRemember.produce()).toEqual(initialState);

    StoreRemember.produce((draft) => {
      draft.a = 2;
    });

    expect(StoreRemember.produce()).toEqual({ a: 2 });
  });

  test("edge cases", async () => {
    const persistenceKey = "edgeCases";
    const Store = createStore(
      {
        a: 1,
      },
      {
        devName: persistenceKey,
        storagePersistence: {
          debounceWait: 0,
          isActive: true,
          isSSR: true,
          persistenceMethod: null as any,
        },
      }
    );

    expect(Store.produce()).toEqual({ a: 1 });
    Store.produce((draft) => {
      draft.a = 2;
    });
    expect(Store.produce()).toEqual({ a: 2 });
  });

  test("mocking localStorage on server", async () => {
    const mockStorage = mockLocalStorage(false);

    const persistenceKey = "mockServer";
    const Store = createStore(
      { a: 1 },
      {
        storagePersistence: {
          persistenceKey,
          isActive: true,
          persistenceMethod: mockStorage.localStorageMock,
          isSSR: true,
          debounceWait: 500,
        },
      }
    );
    expect(mockStorage.localStorageMock.getItem).toBeCalledTimes(0);

    expect(Store.produce()).toEqual({ a: 1 });
    expect(mockStorage.localStorageMock.setItem).toBeCalledTimes(0);

    Store.produce((draft) => {
      draft.a = 2;
    });
    expect(Store.produce()).toEqual({ a: 2 });
    expect(mockStorage.localStorageMock.getItem(persistenceKey)).toEqual(null);
    await waitForExpect(async () => {
      expect(mockStorage.localStorageMock.setItem).toBeCalledTimes(1);
    });
    expect(mockStorage.localStorageMock.getItem(persistenceKey)).toEqual(
      JSON.stringify({ a: 2 })
    );
  });
});
