import React from "react";
import { createSelector, createStore, Immutable } from "react-state-selector";

const genData = (n = 3) =>
  new Array(n).fill(0).map(() => Math.round(Math.random() * 10 + 1));

const initialState = {
  data: genData(),
};

const Store = createStore(
  {
    data: genData(),
    n: 0,
  },
  {
    hooks: {
      /**
       * This hook is going to re-render in any change
       * in the store due to that in every call
       * the "map" function is giving a new array.
       */
      useMultiply2DataWithoutSelector: state => {
        return state.data.map(n => n * 2);
      },
      /**
       * This hook is only going to be listening to changes
       * to "data" inside the store
       */
      useMultiply2Data: createSelector(
        state => state.data,
        data => {
          return data.map(n => n * 2);
        }
      ),
      /**
       * This hook is only going to be listening to changes
       * to "data" and the argument given to the hook
       */
      useMultiplyNData: createSelector(
        /**
         * This type definition is only for TypeScript usage
         */
        (state: Immutable<typeof initialState>, _n: number) => state.data,
        (_state, nMultiply) => nMultiply,
        (data, nMultiply) => {
          return data.map(n => nMultiply * n);
        }
      ),
    },
    actions: {
      newData: () => draft => {
        draft.data = genData();
      },
      newN: () => draft => {
        draft.n = Math.round(Math.random() * 10000);
      },
    },
  }
);

const ListWithoutSelector = () => {
  const list = Store.hooks.useMultiply2DataWithoutSelector();

  return (
    <>
      <p>Random Number = {Math.round(Math.random() * 100)}</p>
      <ul>
        {list.map((n, key) => {
          return <li key={key}>{n}</li>;
        })}
      </ul>
    </>
  );
};

const ListMultiply2 = () => {
  const list = Store.hooks.useMultiply2Data();

  return (
    <>
      <p>Random Number = {Math.round(Math.random() * 100)}</p>
      <ul>
        {list.map((n, key) => {
          return <li key={key}>{n}</li>;
        })}
      </ul>
    </>
  );
};

const ListMultiplyN = () => {
  const list = Store.hooks.useMultiplyNData(4);

  return (
    <>
      <p>Random Number = {Math.round(Math.random() * 100)}</p>
      <ul>
        {list.map((n, key) => {
          return <li key={key}>{n}</li>;
        })}
      </ul>
    </>
  );
};

export const createSelectorExample = () => {
  return (
    <div>
      <ListWithoutSelector />
      <ListMultiply2 />
      <ListMultiplyN />
      <br />
      <button
        onClick={() => {
          Store.actions.newData();
        }}
      >
        New Data
      </button>
      <br />
      <button
        onClick={() => {
          Store.actions.newN();
        }}
      >
        New N
      </button>
    </div>
  );
};

export default {
  title: "createStore",
};
