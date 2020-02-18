import React, { FC, useState } from "react";

import { createStore } from "../src";

const { Provider, useCount, useSetCount, useOther } = createStore(
  () => {
    const [state, setState] = useState(0);

    return { state, setState };
  },
  {
    hooks: {
      useCount: ({ state }) => {
        return state;
      },
      useSetCount: ({ setState }) => {
        return setState;
      },
      useOther: ({ state }) => {
        return "";
      }
    },
    initialState: {
      state: 0,
      setState: () => {}
    }
  }
);

const Test: FC = () => {
  const count = useCount();
  const setCount = useSetCount();

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
