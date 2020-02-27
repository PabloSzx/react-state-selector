/* eslint react-hooks/exhaustive-deps: 0 */

import React, { FC, useLayoutEffect } from "react";
import waitForExpect from "wait-for-expect";

import { act, render } from "@testing-library/react";

import { createSelector, createStore } from "../src";
import { nRenderString, useRenderCount } from "./utils/useRenderCount";

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

  it("produce works with useStore", () => {
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

  it("asyncProduce works with useStore", async () => {
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

    expect(container.innerHTML).toContain(initialStore.a);

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

describe("actions", () => {
  it("defined actions work", () => {
    const initialStore = Object.freeze({
      a: 1,
    });
    const { actions, useStore } = createStore(initialStore, {
      actions: {
        increment: (n: number) => draft => {
          draft.a += n;
        },
        decrement: (n: number) => draft => {
          draft.a -= n;
        },
      },
    });

    const n = 5;

    const ActionsComp: FC = () => {
      const { a } = useStore();

      return (
        <div>
          <button
            data-testid="increment"
            onClick={() => actions.increment(n)}
          />
          <button
            data-testid="decrement"
            onClick={() => actions.decrement(n)}
          />
          <span>{a}</span>
        </div>
      );
    };

    const { container, getByTestId, unmount } = render(<ActionsComp />);

    const IncrementButton = getByTestId("increment");
    const DecrementButton = getByTestId("decrement");

    expect(container.innerHTML).toContain(initialStore.a);

    act(() => {
      IncrementButton.click();
    });

    expect(container.innerHTML).toContain(initialStore.a + n /* 6 */);

    act(() => {
      DecrementButton.click();
      DecrementButton.click();
    });

    expect(container.innerHTML).toContain(initialStore.a + n - n * 2 /* -4 */);

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

    const {
      hooks: { useA, useB, useC },
    } = createStore(initialStore, {
      hooks: {
        useA: store => store.a,
        useB: store => store.b,
        useC: store => store.c,
      },
      actions: {},
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

  it("selectors accept plain props", () => {
    const initialStore = Object.freeze({
      a: 1,
    });
    const {
      hooks: { useATimesN },
    } = createStore(initialStore, {
      hooks: {
        useATimesN: (store, n: number) => {
          return store.a * n;
        },
      },
    });
    const Comp: FC<{ n: number }> = ({ n }) => {
      const a = useATimesN(n);

      return (
        <div>
          <span>{a}</span>
        </div>
      );
    };

    const n = 4;

    const { unmount, container } = render(<Comp n={n} />);

    expect(container.innerHTML).toContain(initialStore.a * n);

    unmount();
  });
  it("selectors accept complex props", () => {
    const initialStore = Object.freeze({
      a: 1,
    });
    const {
      hooks: { useATimesN },
    } = createStore(initialStore, {
      hooks: {
        useATimesN: (store, n: number) => {
          return store.a * n;
        },
      },
    });
    const Comp: FC<{ n: number }> = ({ n }) => {
      const a = useATimesN(() => {
        for (let i = 0; i < 1000; ++i) {
          Math.random();
        }

        return n;
      }, [n]);

      return (
        <div>
          <span>{a}</span>
        </div>
      );
    };

    const n = 10;

    const { unmount, container } = render(<Comp n={n} />);

    expect(container.innerHTML).toContain(initialStore.a * n);

    unmount();
  });

  it("selectors only re-renders component when needed", () => {
    const initialStore = Object.freeze({
      a: 5,
      b: 10,
    });

    const {
      useStore,
      hooks: { useA, useB, useAxB },
      produce,
    } = createStore(initialStore, {
      hooks: {
        useA: store => {
          return store.a;
        },
        useB: store => {
          return store.b;
        },
        useAxB: store => store.a * store.b,
      },
      actions: {},
    });

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

    expect(allStoreComp.container.innerHTML).toContain(nRenderString(1));
    expect(allStoreComp.container.innerHTML).toContain(
      JSON.stringify(initialStore)
    );

    expect(aComp.container.innerHTML).toContain(nRenderString(1));
    expect(aComp.container.innerHTML).toContain(`A=${initialStore.a}`);

    expect(bComp.container.innerHTML).toContain(nRenderString(1));
    expect(bComp.container.innerHTML).toContain(`B=${initialStore.b}`);

    expect(axbComp.container.innerHTML).toContain(nRenderString(1));
    expect(axbComp.container.innerHTML).toContain(
      `AxB=${initialStore.a * initialStore.b}`
    );

    const newA = 20;
    act(() => {
      produce(store => {
        store.a = newA;
      });
    });

    expect(allStoreComp.container.innerHTML).toContain(nRenderString(2));
    expect(allStoreComp.container.innerHTML).toContain(
      // We can use "produce" as a getState
      JSON.stringify(produce(s => s))
    );

    expect(aComp.container.innerHTML).toContain(nRenderString(2));
    expect(aComp.container.innerHTML).toContain(`A=${newA}`);

    expect(bComp.container.innerHTML).toContain(nRenderString(1));
    expect(bComp.container.innerHTML).toContain(`B=${initialStore.b}`);

    expect(axbComp.container.innerHTML).toContain(nRenderString(2));
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

    const {
      hooks: { useMultiplySlow, useMultiplyFast },
      produce,
    } = createStore(initialStore, {
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
      actions: {},
    });

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

    expect(compSlow.container.innerHTML).toContain(nRenderString(1));
    expect(compFast.container.innerHTML).toContain(nRenderString(1));
    expect(compSlow.container.innerHTML).toContain(initialListJoin);
    expect(compFast.container.innerHTML).toContain(initialListJoin);

    act(() => {
      produce(draft => {
        draft.otherList.push(9);
      });
    });

    expect(compSlow.container.innerHTML).toContain(nRenderString(2));
    expect(compFast.container.innerHTML).toContain(nRenderString(1));
    expect(compSlow.container.innerHTML).toContain(initialListJoin);
    expect(compFast.container.innerHTML).toContain(initialListJoin);
  });
});