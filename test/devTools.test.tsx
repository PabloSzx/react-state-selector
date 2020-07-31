import React, { FC, useEffect } from "react";

import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";

import { createStore, createStoreContext } from "../src";
import { Constants } from "../src/common";
import { connectDevTools } from "../src/plugins/devTools";

const mockDevTools = () => {
  const devConnections: string[] = [];
  const devState: { current: any } = { current: undefined };
  const devActions: { type: string; payload: any }[] = [];

  const connectMock = { connect: jest.fn(), open: jest.fn() };

  window.__REDUX_DEVTOOLS_EXTENSION__ = connectMock;

  const devToolsMock = {
    init: jest.fn(),
    send: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    error: jest.fn(),
  };

  devToolsMock.init.mockImplementation((state: any) => {
    devState.current = state;
  });

  devToolsMock.send.mockImplementation(
    (action: { type: string; payload: any }, state: any) => {
      devActions.push(action);
      devState.current = state;
    }
  );

  connectMock.connect.mockImplementation(
    ({ name }: { name: string; serialize: boolean }) => {
      devConnections.push(name);
      return devToolsMock;
    }
  );

  return { devToolsMock, devState, devActions, devConnections };
};

describe("with redux dev tools", () => {
  it("connect dev tools works", () => {
    mockDevTools();

    const reduxDevTools = connectDevTools("test");

    expect(reduxDevTools).toBeTruthy();

    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      1
    );
  });

  it("createStore with devName works", async () => {
    const { devToolsMock, devActions, devState } = mockDevTools();

    const Store = createStore(
      {
        a: 1,
      },
      {
        devName: "test",
        actions: {
          increment: (n: number) => (draft) => {
            draft.a += n;
          },
        },
      }
    );
    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      1
    );
    expect(devToolsMock.init).toHaveBeenCalledTimes(1);

    Store.produce((draft) => {
      draft.a += 1;
    });

    expect(devState.current).toEqual({ a: 2 });

    expect(devActions).toHaveLength(1);

    expect(devActions).toContainEqual({
      type: "produce",
      payload: [{ op: "replace", path: ["a"], value: 2 }],
    });

    expect(Store.produce()).toEqual({ a: 2 });

    expect(devActions).toHaveLength(1);

    const newAsyncA = 10;

    await Store.asyncProduce(async (draft) => {
      draft.a = await new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(newAsyncA);
        }, 500);
      });
    });

    expect(devState.current).toEqual({ a: newAsyncA });

    expect(devActions).toHaveLength(2);

    expect(devActions[1]).toEqual({
      type: "asyncProduce",
      payload: [{ op: "replace", path: ["a"], value: newAsyncA }],
    });

    const plusA = 2;

    Store.actions.increment(plusA);

    expect(devState.current).toEqual({ a: newAsyncA + plusA });

    expect(devActions).toHaveLength(3);

    expect(devActions[2]).toEqual({
      type: "increment",
      payload: [{ op: "replace", path: ["a"], value: newAsyncA + plusA }],
    });

    expect(Store.produce()).toEqual({ a: newAsyncA + plusA });

    expect(devActions).toHaveLength(3);
  });
  it("createStoreContext with devName works", async () => {
    const { devToolsMock, devState, devActions } = mockDevTools();

    const initialStore = Object.freeze({
      a: 1,
    });

    const Store = createStoreContext(initialStore, {
      devName: "test",
      actions: {
        increment: (n: number) => (draft) => {
          draft.a += n;
        },
      },
    });
    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      1
    );

    expect(devToolsMock.init).toHaveBeenCalledTimes(1);

    const { result, rerender, unmount, waitForNextUpdate } = renderHook(
      ({
        newA,
        asyncNew,
        incrementA,
      }: {
        newA?: number;
        asyncNew?: boolean;
        incrementA?: number;
      }) => {
        const { produce, asyncProduce } = Store.useProduce();
        const { increment } = Store.useActions();
        useEffect(() => {
          if (newA) {
            if (asyncNew) {
              asyncProduce(async (draft) => {
                draft.a = await new Promise<number>((resolve) => {
                  setTimeout(() => {
                    resolve(newA);
                  }, 500);
                });
              });
            } else {
              act(() => {
                produce((draft) => {
                  draft.a = newA;
                });
              });
            }
          } else if (incrementA) {
            act(() => {
              increment(incrementA);
            });
          }
        }, [newA, asyncNew, incrementA, asyncProduce, produce, increment]);
        return Store.useStore();
      },
      {
        initialProps: {},
        //@ts-expect-error
        wrapper: Store.Provider,
      }
    );

    expect(result.current).toBe(initialStore);

    expect(devState.current).toBe(initialStore);

    expect(devActions).toHaveLength(0);

    const newN = 5;
    rerender({ newA: newN });

    expect(devActions).toHaveLength(1);

    expect(devActions[0]).toEqual({
      type: "produce",
      payload: [{ op: "replace", path: ["a"], value: newN }],
    });

    expect(result.current).toEqual({ a: newN });

    const newAsyncN = 15;
    rerender({ newA: newAsyncN, asyncNew: true });

    await waitForNextUpdate({ timeout: 1000 });

    expect(devActions).toHaveLength(2);

    expect(devActions[1]).toEqual({
      type: "asyncProduce",
      payload: [{ op: "replace", path: ["a"], value: newAsyncN }],
    });

    expect(result.current).toEqual({ a: newAsyncN });

    const newIncrementN = 2;

    rerender({ incrementA: newIncrementN });

    expect(devActions).toHaveLength(3);

    expect(devActions[2]).toEqual({
      type: "increment",
      payload: [
        { op: "replace", path: ["a"], value: newAsyncN + newIncrementN },
      ],
    });

    expect(result.current).toEqual({ a: newAsyncN + newIncrementN });

    unmount();
  });

  it("createStoreContext Providers individual debug names works", () => {
    const { devConnections, devState } = mockDevTools();
    const initialState = Object.freeze({ a: 1 });
    const Store = createStoreContext(initialState, {
      devName: "debugNames",
    });

    const Comp: FC<{ testId: string }> = ({ testId }) => {
      const { a } = Store.useStore();

      return (
        <div data-testid={testId}>
          <p>{a}</p>
        </div>
      );
    };

    const { getByTestId, unmount } = render(
      <>
        <Store.Provider debugName="test1">
          <Comp testId="comp1" />
        </Store.Provider>
        <Store.Provider debugName="test2">
          <Comp testId="comp2" />
        </Store.Provider>
      </>
    );

    const comp1 = getByTestId("comp1");
    const comp2 = getByTestId("comp2");

    expect(devState.current).toBe(initialState);

    expect(comp1.textContent).toBe(initialState.a.toString());
    expect(comp2.textContent).toBe(initialState.a.toString());

    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      3
    );

    expect(devConnections).toStrictEqual([
      "Store debugNames-noProvider",
      "Store debugNames-test1",
      "Store debugNames-test2",
    ]);

    unmount();
  });

  it("createStore in production by default should not connect to devTools", () => {
    const { devToolsMock } = mockDevTools();

    const previous = Constants.IS_NOT_PRODUCTION;
    Constants.IS_NOT_PRODUCTION = false;

    createStore(
      {
        a: 1,
      },
      {
        devName: "test",
      }
    );

    expect(devToolsMock.init).toHaveBeenCalledTimes(0);

    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      0
    );

    Constants.IS_NOT_PRODUCTION = previous;
  });

  it("createStore in production with it's config should connect to devTools", () => {
    const { devToolsMock, devState } = mockDevTools();

    const previous = Constants.IS_NOT_PRODUCTION;
    Constants.IS_NOT_PRODUCTION = false;

    createStore(
      {
        a: 1,
      },
      {
        devName: "test",
        devToolsInProduction: true,
      }
    );

    expect(devToolsMock.init).toHaveBeenCalledTimes(1);

    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      1
    );

    expect(devState.current).toEqual({ a: 1 });

    Constants.IS_NOT_PRODUCTION = previous;
  });

  it("createStoreContext in production by default should not connect to devTools", () => {
    const { devToolsMock } = mockDevTools();
    const previous = Constants.IS_NOT_PRODUCTION;
    Constants.IS_NOT_PRODUCTION = false;

    createStoreContext(
      {
        a: 1,
      },
      {
        devName: "test",
      }
    );

    expect(devToolsMock.init).toHaveBeenCalledTimes(0);

    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      0
    );

    Constants.IS_NOT_PRODUCTION = previous;
  });

  it("createStoreContext in production with it's config should connect to devTools", () => {
    const { devToolsMock, devState } = mockDevTools();
    const previous = Constants.IS_NOT_PRODUCTION;
    Constants.IS_NOT_PRODUCTION = false;

    createStoreContext(
      {
        a: 1,
      },
      {
        devName: "test",
        devToolsInProduction: true,
      }
    );

    expect(devToolsMock.init).toHaveBeenCalledTimes(1);

    expect(window.__REDUX_DEVTOOLS_EXTENSION__?.connect).toHaveBeenCalledTimes(
      1
    );

    expect(devState.current).toEqual({ a: 1 });

    Constants.IS_NOT_PRODUCTION = previous;
  });
});

describe("without redux dev tools", () => {
  beforeEach(() => {
    window.__REDUX_DEVTOOLS_EXTENSION__ = undefined;
  });
  it("connect dev tools gives undefined", () => {
    const reduxDevTools = connectDevTools("test");

    expect(reduxDevTools).toBe(undefined);
  });
  it("creating store doesn't crash if the extension is not available", () => {
    createStore(
      { a: 1 },
      {
        devName: "test",
      }
    );
  });
  it("creating store context doesn't crash if the extension is not available", () => {
    const Store = createStoreContext(
      { a: 1 },
      {
        devName: "test",
      }
    );

    const { result } = renderHook(
      () => {
        return Store.useStore();
      },
      {
        wrapper: Store.Provider,
      }
    );

    expect(result.current).toEqual({
      a: 1,
    });
  });
});
