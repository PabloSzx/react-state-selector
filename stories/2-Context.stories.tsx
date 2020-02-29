import React, { FC } from "react";

import { createSelector, createStoreContext } from "../src";

const {
  hooks: { useXD },
} = createStoreContext(
  { a: 5 },
  {
    devName: "XD",
    hooks: {
      useXD: createSelector(
        state => {
          return state.a;
        },
        state => {
          return state.a + 2;
        },
        (res, res2) => {
          return res + res2;
        }
      ),
    },
  }
);

const {
  hooks: { useCount },
  useActions,
  Provider,
} = createStoreContext(
  {
    count: 5,
  },
  {
    devName: "Count",
    hooks: {
      useCount: ({ count }) => {
        return count;
      },
    },
    actions: {
      increment: (a: number) => draft => {
        draft.count += a;
        return;
      },
      printCurrentStore: () => draft => {
        alert(JSON.stringify(draft));
      },
    },
  }
);

const Count: FC = () => {
  const count = useCount();

  const { increment } = useActions();
  return (
    <div>
      <br />
      <button
        onClick={() => {
          increment(1);
        }}
      >
        Increment
      </button>
      <br />
      <br />
      <span style={{ color: "yellow" }}>
        {Math.round(Math.random() * 1000)}
      </span>
      <br />
      <br />
      {count}
    </div>
  );
};

const XD: FC = () => {
  const n = useXD();

  return <div>{n}</div>;
};

export const ContextStory = () => (
  <div>
    <Count />
    <Count />
    <br />
    <Provider>
      <Count />
      <Count />
    </Provider>
    <br />
    <br />
    <Provider>
      <Count />
    </Provider>
    <br />
    <br />

    <Count />
    <br />
    <br />

    <br />
    <br />

    <XD />
  </div>
);

export default {
  title: "Context",
};

ContextStory.story = {
  name: "Context",
};
