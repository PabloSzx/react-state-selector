/* eslint react-hooks/exhaustive-deps: 0 */

import React, { FC, useLayoutEffect } from "react";
import waitForExpect from "wait-for-expect";

import { act, cleanup, render } from "@testing-library/react";

import { createSelector, createStore, Draft } from "../src";
import { nRenderString, useRenderCount } from "./utils/useRenderCount";

afterEach(cleanup);

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

    const { getByText } = render(<UseStoreComponent />);

    const comp = getByText(initialStore.a.toString());

    expect(comp).toBeTruthy();
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

    const { getByText } = render(<ProduceComponent />);

    const comp = getByText((initialStore.a + n).toString());

    expect(comp).toBeTruthy();
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

    const { getByTestId, container } = render(<AsyncProduceComponent />);

    expect(container.innerHTML).toContain(initialStore.a);

    getByTestId("button").click();

    await waitForExpect(
      async () => {
        expect(container.innerHTML).toContain(initialStore.a + n);
      },
      2000,
      250
    );
  });

  it("asyncProduce works as getter", () => {
    const { asyncProduce, produce } = createStore({ a: 1 });

    expect(produce()).toEqual({ a: 1 });

    expect(asyncProduce()).resolves.toEqual({ a: 1 });

    expect(asyncProduce(async () => {})).resolves.toEqual({ a: 1 });
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

    const { container, getByTestId } = render(<ActionsComp />);

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
  });

  it("async actions work", async () => {
    const initialStore = Object.freeze({
      a: 1,
    });

    const Store = createStore(initialStore, {
      hooks: {},
      actions: {
        asyncIncrement: async (n: number) => {
          await new Promise(resolve => setTimeout(resolve, 500));

          return (draft: Draft<typeof initialStore>) => {
            draft.a += n;
          };
        },
        increment: (n: number) => draft => {
          draft.a += n;
        },
      },
    });

    expect(Store.produce()).toBe(initialStore);

    const a = Store.actions.asyncIncrement(10);
    const b = Store.actions.increment(20);

    expect(a).toHaveProperty("then");
    expect(b).toEqual({ a: 21 });

    await waitForExpect(async () => {
      expect(Store.produce()).toEqual({ a: 31 });
    }, 1000);
  });

  it("async actions handle errors", async () => {
    const initialStore = Object.freeze({
      a: 1,
    });

    const SampleError = new Error("test error");

    const Store = createStore(initialStore, {
      hooks: {},
      actions: {
        asyncError: async (n: number) => {
          await new Promise((_resolve, reject) =>
            setTimeout(() => reject(SampleError), 500)
          );

          return (draft: Draft<typeof initialStore>) => {
            draft.a += n;
          };
        },
      },
    });

    await expect(Store.actions.asyncError(10)).rejects.toBe(SampleError);
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

    const { container } = render(<Comp n={n} />);

    expect(container.innerHTML).toContain(initialStore.a * n);
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

    const { container } = render(<Comp n={n} />);

    expect(container.innerHTML).toContain(initialStore.a * n);
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

  it("createSelector with props support and it makes a difference", () => {
    const initialStore = Object.freeze({
      list: Object.freeze([1, 3, 5, 7]),
      otherList: Object.freeze([0, 2, 4, 6]),
    });

    const {
      hooks: { useMultiplySlow, useMultiplyFast },
      produce,
    } = createStore(initialStore, {
      hooks: {
        useMultiplySlow: (store, i: number) => {
          return store.list.map(n => n * i);
        },
        useMultiplyFast: createSelector<
          { list: readonly number[] },
          number,
          readonly number[],
          number,
          number[]
        >(
          state => state.list,
          (_, n) => n,
          (list, n) => {
            return list.map(i => i * n);
          }
        ),
      },
      actions: {},
    });

    const nArg = 4;

    const CompSlow: FC = () => {
      const list = useMultiplySlow(nArg);
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
      const list = useMultiplyFast(nArg);
      const renderCount = useRenderCount();

      return (
        <div>
          <span>{renderCount}</span>
          <br />
          <span>{list.join("|")}</span>
        </div>
      );
    };

    const initialListJoin = initialStore.list.map(n => n * nArg).join("|");

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

  describe("draft function returns new instance of store", () => {
    it("actions gives new instance of store", () => {
      const initialStore = Object.freeze({
        a: 1,
        b: 2,
      });
      const newStore = Object.freeze({
        a: 4,
        b: 5,
      });
      const Store = createStore(initialStore, {
        actions: {
          newStore: () => () => {
            return newStore;
          },
        },
        hooks: {},
      });

      expect(Store.produce()).toBe(initialStore);

      expect(Store.actions.newStore()).toBe(newStore);

      expect(Store.produce()).toBe(newStore);
    });

    it("produce gives new instance of store", () => {
      const initialStore = Object.freeze({
        a: 1,
        b: 2,
      });
      const newStore = Object.freeze({
        a: 4,
        b: 5,
      });
      const Store = createStore(initialStore, {
        actions: {
          newStore: () => () => {
            return newStore;
          },
        },
        hooks: {},
      });

      expect(Store.produce()).toBe(initialStore);

      expect(Store.produce(() => newStore)).toBe(newStore);

      expect(Store.produce()).toBe(newStore);
    });
  });
});

describe("map inside object", () => {
  const obj1 = { a: 1, b: "asd" };
  const obj2 = { zxc: "8234" };

  const initialStore = {
    mapInside: new Map<object, boolean>(),
  };
  initialStore.mapInside.set(obj2, true);

  const Store = createStore(initialStore, {
    hooks: {
      useIsCheckedInside: ({ mapInside }, obj: object) => {
        return !!mapInside.get(obj);
      },
    },
    actions: {
      toggleInside: (obj: object) => draft => {
        draft.mapInside.set(obj, !draft.mapInside.get(obj));
      },
    },
  });

  const CheckInsideComp: FC<{ obj: object; testId: string }> = ({
    testId,
    obj,
  }) => {
    const isChecked = Store.hooks.useIsCheckedInside(obj);

    return <div data-testid={testId}>{isChecked ? "yes" : "no"}</div>;
  };

  const { getByTestId } = render(
    <>
      <CheckInsideComp testId="obj1" obj={obj1} />
      <CheckInsideComp testId="obj2" obj={obj2} />
    </>
  );

  const CompObj1 = getByTestId("obj1");
  const CompObj2 = getByTestId("obj2");

  expect(CompObj1.textContent).toBe("no");
  expect(CompObj2.textContent).toBe("yes");

  act(() => {
    Store.actions.toggleInside(obj1);
  });

  expect(CompObj1.textContent).toBe("yes");
});
