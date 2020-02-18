import React, { FC, useState } from "react";

import { createStore } from "../dist";

const { Provider, useCount, useSetCount, useOther } = createStore(
  () => {
    const [state, setState] = useState(0);

    return { state, setState };
  },
  {
    hooks: {
      useCount: ({ state }) => ({ max }: { max: number }) => {
        if (state > max) {
          return max;
        }
        return state;
      },
      useSetCount: ({ setState }) => () => {
        return setState;
      },
      useOther: () => () => {
        return "123";
      }
    },
    initialState: {
      state: 0,
      setState: () => {}
    }
  }
);

const Test: FC = () => {
  const count = useCount({ max: 5 });
  const setCount = useSetCount();
  const other = useOther();
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
      <span>{other}</span>
    </div>
  );
};

export default {
  title: "Welcome"
};

export const toStorybook = () => (
  <Provider>
    <Test />
  </Provider>
);

toStorybook.story = {
  name: "to Storybook"
};
