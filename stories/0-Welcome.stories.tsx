import React, { FC, useState } from "react";

import { createStore } from "../src";

const { Provider, useCountA, useCountB } = createStore(
  () => {
    const [countA, setCountA] = useState(0);
    const [countB, setCountB] = useState(0);

    return { countA, setCountA, countB, setCountB };
  },
  {
    hooks: {
      useCountA: ({ countA, setCountA }) => (a: number) => {
        return { countA, setCountA };
      },
      useCountB: ({ countB, setCountB }) => (b: string) => {
        return { countB, setCountB };
      }
    },
    selectorKeys: {
      useCountA: store => a => {
        return store.countA;
      },
      useCountB: ({ countB }) => b => {
        return countB;
      }
    },
    initialState: {
      countA: 0,
      countB: 0,
      setCountA: () => {},
      setCountB: () => {}
    }
  }
);

const CountA: FC = () => {
  const { countA: count, setCountA: setCount } = useCountA(12);
  return (
    <div>
      <button
        onClick={() => {
          setCount(count - 1);
        }}
      >
        -
      </button>
      <span>{count}</span>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
      <br />
      <br />
      <span>{Math.round(Math.random() * 100)}</span>
    </div>
  );
};
const CountB: FC = () => {
  const { countB: count, setCountB: setCount } = useCountB("1");
  return (
    <div>
      <button
        onClick={() => {
          setCount(count - 1);
        }}
      >
        -
      </button>
      <span>{count}</span>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
      <br />
      <br />
      <span>{Math.round(Math.random() * 100)}</span>
    </div>
  );
};

export default {
  title: "Welcome"
};

export const toStorybook = () => (
  <Provider>
    <CountA />
    <CountB />
  </Provider>
);

toStorybook.story = {
  name: "to Storybook1"
};
