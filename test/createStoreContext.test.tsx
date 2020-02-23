/* eslint react-hooks/exhaustive-deps: 0 */

import React, { FC, useLayoutEffect } from "react";
import waitForExpect from "wait-for-expect";

import { act, render } from "@testing-library/react";

import { createSelector, createStoreContext } from "../src";
import { useRenderCount } from "./utils/useRenderCount";

describe("basic createStore", () => {
  const initialStore = Object.freeze({
    a: 5,
    b: -5,
  });

  it("useStore works", () => {
    const { useStore, Provider } = createStoreContext(initialStore);

    const UseStoreComponent: FC = () => {
      const store = useStore();
      return <span>{store.a}</span>;
    };

    const { getByText, unmount } = render(<UseStoreComponent />, {
      wrapper: Provider,
    });

    const comp = getByText(initialStore.a.toString());

    expect(comp).toBeTruthy();
    unmount();
  });

  it("produce works", () => {
    const { useStore, useProduce, Provider } = createStoreContext(initialStore);

    const n = 5;

    const ProduceComponent: FC = () => {
      const store = useStore();
      const { produce } = useProduce();

      useLayoutEffect(() => {
        act(() => {
          produce(draft => {
            draft.a += n;
          });
        });
      }, []);

      return <span>{store.a}</span>;
    };

    const { container, unmount } = render(<ProduceComponent />, {
      wrapper: Provider,
    });

    expect(container.innerHTML).toContain(initialStore.a + n);

    unmount();
  });

  it("asyncProduce works", async () => {
    const { useStore, useProduce } = createStoreContext(initialStore);

    const n = 5;

    const AsyncProduceComponent: FC = () => {
      const store = useStore();
      const { asyncProduce } = useProduce();

      return (
        <>
          <button
            data-testid="button"
            onClick={async () => {
              await act(async () => {
                await asyncProduce(async draft => {
                  draft.a += await new Promise<number>(resolve => {
                    setTimeout(() => {
                      resolve(n);
                    }, 500);
                  });
                });
              });
            }}
          >
            click me
          </button>
          <span>{store.a}</span>
        </>
      );
    };

    const { container, unmount, getByTestId } = render(
      <AsyncProduceComponent />
    );

    getByTestId("button").click();
    await waitForExpect(
      async () => {
        expect(container.innerHTML).toContain((initialStore.a + n).toString());
      },
      2000,
      250
    );
    unmount();
  });
});

describe("selectors and listeners", () => {
  it("basic number object and individual selectors", () => {
    const initialStore = Object.freeze({
      a: 1,
      b: 2,
      c: 3,
    });

    const { useA, useB, useC } = createStoreContext(initialStore, {
      hooks: {
        useA: store => store.a,
        useB: store => store.b,
        useC: store => store.c,
      },
    });

    const AComp: FC = () => {
      const n = useA();

      return <span>{n}</span>;
    };
    const BComp: FC = () => {
      const n = useB();

      return <span>{n}</span>;
    };
    const CComp: FC = () => {
      const n = useC();

      return <span>{n}</span>;
    };

    const aComp = render(<AComp />);
    const bComp = render(<BComp />);
    const cComp = render(<CComp />);

    expect(aComp.container.textContent).toBe(initialStore.a.toString());
    expect(bComp.container.textContent).toBe(initialStore.b.toString());
    expect(cComp.container.textContent).toBe(initialStore.c.toString());

    aComp.unmount();
    bComp.unmount();
    cComp.unmount();
  });

  it("selectors only re-renders component when needed", () => {
    const initialStore = Object.freeze({
      a: 5,
      b: 10,
    });

    const {
      useStore,
      useA,
      useB,
      useAxB,
      useProduce,
      Provider,
    } = createStoreContext(initialStore, {
      hooks: {
        useA: store => {
          return store.a;
        },
        useB: store => {
          return store.b;
        },
        useAxB: store => store.a * store.b,
      },
    });

    const AllStoreComp: FC = () => {
      const store = useStore();
      const renderCount = useRenderCount();

      return (
        <div data-testid="allStore">
          <span>{renderCount}</span>
          <span>{JSON.stringify(store)}</span>
        </div>
      );
    };

    const OnlyAComp: FC = () => {
      const a = useA();
      const renderCount = useRenderCount();

      return (
        <div data-testid="onlyA">
          <span>{renderCount}</span>
          <span>A={a}</span>
        </div>
      );
    };

    const OnlyBComp: FC = () => {
      const b = useB();
      const renderCount = useRenderCount();

      return (
        <div data-testid="onlyB">
          <span>{renderCount}</span>
          <span>B={b}</span>
        </div>
      );
    };

    const OnlyAxBComp: FC = () => {
      const AxB = useAxB();
      const renderCount = useRenderCount();

      return (
        <div data-testid="onlyAxB">
          <span>{renderCount}</span>
          <span>AxB={AxB}</span>
        </div>
      );
    };

    const plusA = 5;

    const ProducerComp: FC = () => {
      const { produce } = useProduce();

      return (
        <button
          data-testid="producer"
          onClick={() => {
            act(() => {
              produce(draft => {
                draft.a += plusA;
              });
            });
          }}
        >
          Click here
        </button>
      );
    };

    const { getByTestId, unmount } = render(
      <Provider>
        <AllStoreComp />
        <OnlyAComp />
        <OnlyBComp />
        <OnlyAxBComp />
        <ProducerComp />
      </Provider>
    );

    const allStoreComp = getByTestId("allStore");
    const aComp = getByTestId("onlyA");
    const bComp = getByTestId("onlyB");
    const axbComp = getByTestId("onlyAxB");
    const producerComp = getByTestId("producer");

    expect(allStoreComp.innerHTML).toContain("nRenders=1");
    expect(allStoreComp.innerHTML).toContain(JSON.stringify(initialStore));

    expect(aComp.innerHTML).toContain("nRenders=1");
    expect(aComp.innerHTML).toContain(`A=${initialStore.a}`);

    expect(bComp.innerHTML).toContain("nRenders=1");
    expect(bComp.innerHTML).toContain(`B=${initialStore.b}`);

    expect(axbComp.innerHTML).toContain("nRenders=1");
    expect(axbComp.innerHTML).toContain(
      `AxB=${initialStore.a * initialStore.b}`
    );

    act(() => {
      producerComp.click();
    });

    expect(allStoreComp.innerHTML).toContain("nRenders=2");
    expect(allStoreComp.innerHTML).toContain(
      JSON.stringify({ ...initialStore, a: initialStore.a + plusA })
    );

    expect(aComp.innerHTML).toContain("nRenders=2");
    expect(aComp.innerHTML).toContain(`A=${initialStore.a + plusA}`);

    expect(bComp.innerHTML).toContain("nRenders=1");
    expect(bComp.innerHTML).toContain(`B=${initialStore.b}`);

    expect(axbComp.innerHTML).toContain("nRenders=2");
    expect(axbComp.innerHTML).toContain(
      `AxB=${(initialStore.a + plusA) * initialStore.b}`
    );

    unmount();
  });

  it("createSelector support and it makes a difference", () => {
    const initialStore = Object.freeze({
      list: Object.freeze([1, 3, 5, 7]),
      otherList: Object.freeze([0, 2, 4, 6]),
    });

    const {
      useMultiplySlow,
      useMultiplyFast,
      useProduce,
      Provider,
    } = createStoreContext(initialStore, {
      hooks: {
        useMultiplySlow: store => {
          return store.list.map(n => n * 2);
        },
        useMultiplyFast: createSelector(
          state => state.list,
          list => {
            return list.map(n => n * 2);
          }
        ),
      },
    });

    const CompSlow: FC = () => {
      const list = useMultiplySlow();
      const renderCount = useRenderCount();

      return (
        <div data-testid="compSlow">
          <span>{renderCount}</span>
          <br />
          <span>{list.join("|")}</span>
        </div>
      );
    };

    const CompFast: FC = () => {
      const list = useMultiplyFast();
      const renderCount = useRenderCount();

      return (
        <div data-testid="compFast">
          <span>{renderCount}</span>
          <br />
          <span>{list.join("|")}</span>
        </div>
      );
    };

    const ProducerComp: FC = () => {
      const { produce } = useProduce();

      return (
        <button
          data-testid="producer"
          onClick={() => {
            act(() => {
              produce(draft => {
                draft.otherList.push(9);
              });
            });
          }}
        >
          Click here!
        </button>
      );
    };

    const initialListJoin = initialStore.list.map(n => n * 2).join("|");

    const { unmount, getByTestId } = render(
      <Provider>
        <CompSlow />
        <CompFast />
        <ProducerComp />
      </Provider>
    );
    const compSlow = getByTestId("compSlow");

    const compFast = getByTestId("compFast");

    const producerComp = getByTestId("producer");

    expect(compSlow.innerHTML).toContain("nRenders=1");
    expect(compFast.innerHTML).toContain("nRenders=1");
    expect(compSlow.innerHTML).toContain(initialListJoin);
    expect(compFast.innerHTML).toContain(initialListJoin);

    act(() => {
      producerComp.click();
    });

    expect(compSlow.innerHTML).toContain("nRenders=2");
    expect(compFast.innerHTML).toContain("nRenders=1");
    expect(compSlow.innerHTML).toContain(initialListJoin);
    expect(compFast.innerHTML).toContain(initialListJoin);

    unmount();
  });
});

describe("context providers", () => {
  it("different providers have different state", () => {
    const initialStore = Object.freeze({
      a: 1,
      b: 2,
    });

    const { Provider, useStore, useProduce } = createStoreContext(initialStore);

    const StoreWatch: FC = () => {
      const store = useStore();

      return <span>{JSON.stringify(store)}</span>;
    };

    const Producer: FC<{ id?: string }> = ({ id }) => {
      const { produce } = useProduce();

      return (
        <button
          data-testid={id}
          onClick={() => {
            act(() => {
              produce(draft => {
                draft.a *= 2;
                draft.b *= 2;
              });
            });
          }}
        >
          click me!
        </button>
      );
    };

    const ContextA = render(
      <Provider>
        <StoreWatch />
        <Producer id="button" />
      </Provider>
    );
    const ContextB = render(
      <Provider>
        <StoreWatch />
        <Producer />
      </Provider>
    );

    expect(ContextA.container.innerHTML).toContain(
      JSON.stringify(initialStore)
    );
    expect(ContextB.container.innerHTML).toContain(
      JSON.stringify(initialStore)
    );

    ContextA.getByTestId("button").click();

    expect(ContextA.container.innerHTML).toContain(
      JSON.stringify({ a: initialStore.a * 2, b: initialStore.b * 2 })
    );
    expect(ContextB.container.innerHTML).toContain(
      JSON.stringify(initialStore)
    );

    ContextA.unmount();
    ContextB.unmount();
  });
});
