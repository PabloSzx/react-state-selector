import React, { FC, useLayoutEffect } from "react";
import waitForExpect from "wait-for-expect";

import { act, render } from "@testing-library/react";

import { createSelector, createStore } from "../src";
import { useRenderCount } from "./utils/useRenderCount";

describe("basic createStore", () => {
  const initialStore = Object.freeze({
    a: 5,
    b: -5,
  });

  it("useStore works", () => {
    const { useStore } = createStore(initialStore);

    const UseStoreComponent: FC = () => {
      const store = useStore();
      return <span>{store.a}</span>;
    };

    const { getByText, unmount } = render(<UseStoreComponent />);

    const comp = getByText(initialStore.a.toString());

    expect(comp).toBeTruthy();
    unmount();
  });

  it("produce works", () => {
    const { useStore, produce } = createStore(initialStore);

    const n = 5;

    const ProduceComponent: FC = () => {
      const store = useStore();

      useLayoutEffect(() => {
        act(() => {
          produce(draft => {
            draft.a += n;
          });
        });
      }, []);

      return <span>{store.a}</span>;
    };

    const { getByText, unmount } = render(<ProduceComponent />);

    const comp = getByText((initialStore.a + n).toString());

    expect(comp).toBeTruthy();
    unmount();
  });

  it("asyncProduce works", async () => {
    const { useStore, asyncProduce } = createStore(initialStore);

    const n = 5;

    const AsyncProduceComponent: FC = () => {
      const store = useStore();

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

    const { getByTestId, unmount, container } = render(
      <AsyncProduceComponent />
    );

    getByTestId("button").click();

    await waitForExpect(
      async () => {
        expect(container.innerHTML).toContain(initialStore.a + n);
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

    const { useA, useB, useC } = createStore(initialStore, {
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
  });

  it("selectors only re-renders component when needed", () => {
    const initialStore = Object.freeze({
      a: 5,
      b: 10,
    });

    const { useStore, useA, useB, useAxB, produce } = createStore(
      initialStore,
      {
        hooks: {
          useA: store => {
            return store.a;
          },
          useB: store => {
            return store.b;
          },
          useAxB: store => store.a * store.b,
        },
      }
    );

    const AllStoreComp: FC = () => {
      const store = useStore();
      const renderCount = useRenderCount();

      return (
        <div>
          <span>{renderCount}</span>
          <span>{JSON.stringify(store)}</span>
        </div>
      );
    };

    const OnlyAComp: FC = () => {
      const a = useA();
      const renderCount = useRenderCount();

      return (
        <div>
          <span>{renderCount}</span>
          <span>A={a}</span>
        </div>
      );
    };

    const OnlyBComp: FC = () => {
      const b = useB();
      const renderCount = useRenderCount();

      return (
        <div>
          <span>{renderCount}</span>
          <span>B={b}</span>
        </div>
      );
    };

    const OnlyAxBComp: FC = () => {
      const AxB = useAxB();
      const renderCount = useRenderCount();

      return (
        <div>
          <span>{renderCount}</span>
          <span>AxB={AxB}</span>
        </div>
      );
    };

    const allStoreComp = render(<AllStoreComp />);
    const aComp = render(<OnlyAComp />);
    const bComp = render(<OnlyBComp />);
    const axbComp = render(<OnlyAxBComp />);

    expect(allStoreComp.container.innerHTML).toContain("nRenders=1");
    expect(allStoreComp.container.innerHTML).toContain(
      JSON.stringify(initialStore)
    );

    expect(aComp.container.innerHTML).toContain("nRenders=1");
    expect(aComp.container.innerHTML).toContain(`A=${initialStore.a}`);

    expect(bComp.container.innerHTML).toContain("nRenders=1");
    expect(bComp.container.innerHTML).toContain(`B=${initialStore.b}`);

    expect(axbComp.container.innerHTML).toContain("nRenders=1");
    expect(axbComp.container.innerHTML).toContain(
      `AxB=${initialStore.a * initialStore.b}`
    );

    const newA = 20;
    act(() => {
      produce(store => {
        store.a = newA;
      });
    });

    expect(allStoreComp.container.innerHTML).toContain("nRenders=2");
    expect(allStoreComp.container.innerHTML).toContain(
      // We can use "produce" as a getState
      JSON.stringify(produce(s => s))
    );

    expect(aComp.container.innerHTML).toContain("nRenders=2");
    expect(aComp.container.innerHTML).toContain(`A=${newA}`);

    expect(bComp.container.innerHTML).toContain("nRenders=1");
    expect(bComp.container.innerHTML).toContain(`B=${initialStore.b}`);

    expect(axbComp.container.innerHTML).toContain("nRenders=2");
    expect(axbComp.container.innerHTML).toContain(
      `AxB=${newA * initialStore.b}`
    );

    aComp.unmount();
    bComp.unmount();
    axbComp.unmount();
    allStoreComp.unmount();
  });

  it("createSelector support and it makes a difference", () => {
    const initialStore = Object.freeze({
      list: Object.freeze([1, 3, 5, 7]),
      otherList: Object.freeze([0, 2, 4, 6]),
    });

    const { useMultiplySlow, useMultiplyFast, produce } = createStore(
      initialStore,
      {
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
      }
    );

    const CompSlow: FC = () => {
      const list = useMultiplySlow();
      const renderCount = useRenderCount();

      return (
        <div>
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
        <div>
          <span>{renderCount}</span>
          <br />
          <span>{list.join("|")}</span>
        </div>
      );
    };

    const initialListJoin = initialStore.list.map(n => n * 2).join("|");

    const compSlow = render(<CompSlow />);

    const compFast = render(<CompFast />);

    expect(compSlow.container.innerHTML).toContain("nRenders=1");
    expect(compFast.container.innerHTML).toContain("nRenders=1");
    expect(compSlow.container.innerHTML).toContain(initialListJoin);
    expect(compFast.container.innerHTML).toContain(initialListJoin);

    act(() => {
      produce(draft => {
        draft.otherList.push(9);
      });
    });

    expect(compSlow.container.innerHTML).toContain("nRenders=2");
    expect(compFast.container.innerHTML).toContain("nRenders=1");
    expect(compSlow.container.innerHTML).toContain(initialListJoin);
    expect(compFast.container.innerHTML).toContain(initialListJoin);
  });
});
