import { createStore, createStoreContext } from "../src";
import { connectDevTools } from "../src/plugins/devTools";

window.__REDUX_DEVTOOLS_EXTENSION__ = {
  connect: jest.fn(),
};

const mockDevTools = () => {
  let devState: { current: any } = { current: undefined };
  let devActions: { type: string; payload: any }[] = [];

  const devToolsMock = {
    init: jest.fn(),
    send: jest.fn(),
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

  //@ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__.connect.mockReturnValue(devToolsMock);

  return { devToolsMock, devState, devActions };
};

describe("with redux dev tools", () => {
  beforeEach(() => {});

  it("connect dev tools works", () => {
    mockDevTools();

    const reduxDevTools = connectDevTools("test");

    expect(reduxDevTools).toBeTruthy();
  });

  it("createStore with devName works", () => {
    const { devToolsMock, devActions, devState } = mockDevTools();

    const Store = createStore(
      {
        a: 1,
      },
      {
        devName: "test",
      }
    );

    expect(devToolsMock.init).toHaveBeenCalledTimes(1);

    Store.produce(draft => {
      draft.a += 1;
    });

    expect(devState.current).toEqual({ a: 2 });

    expect(devActions).toHaveLength(1);

    expect(devActions).toContainEqual({
      type: "produce",
      payload: [{ op: "replace", path: ["a"], value: 2 }],
    });

    expect(Store.produce(() => {})).toEqual({ a: 2 });

    expect(devActions).toHaveLength(2);

    expect(devActions[1]).toEqual({
      type: "produce",
      payload: [],
    });
  });
  it("createStoreContext with devName works", () => {
    const { devToolsMock } = mockDevTools();

    const Store = createStoreContext(
      {
        a: 1,
      },
      {
        devName: "test",
      }
    );

    expect(devToolsMock.init).toHaveBeenCalledTimes(1);

    expect(Store).toBeTruthy();
  });
});

describe("without redux dev tools", () => {
  beforeEach(() => {
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ = undefined;
  });
  it("connect dev tools gives undefined", () => {
    const reduxDevTools = connectDevTools("test");

    expect(reduxDevTools).toBe(undefined);
  });
});
