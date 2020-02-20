import React, { FC } from "react";

import { createStore } from "../src";

const { useCountA, useCountB, useProduce } = createStore(
  {
    countA: 0,
    countB: 0
  },
  {
    useCountA: ({ countA }) => (a: number) => {
      return { countA };
    },
    useCountB: ({ countB }) => (b: string) => {
      return { countB };
    }
  }
);

const CountA: FC = () => {
  const { countA: count } = useCountA(12);
  const { produce } = useProduce();
  return (
    <div>
      <button
        onClick={() => {
          produce(state => {
            state.countA -= 1;
          });
        }}
      >
        -
      </button>
      <span>{count}</span>
      <button
        onClick={() => {
          produce(state => {
            state.countA += 2;
          });
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
  const { countB: count } = useCountB("1");
  const { produce } = useProduce();

  return (
    <div>
      <button
        onClick={() => {
          produce(state => {
            state.countB -= 1;
          });
        }}
      >
        -
      </button>
      <span>{count}</span>
      <button
        onClick={() => {
          produce(state => {
            state.countB += 1;
          });
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

export const ProduceC = () => {
  useProduce();

  return <>{Math.round(Math.random() * 100)}</>;
};

export default {
  title: "Welcome"
};

export const toStorybook = () => (
  <>
    <CountA />
    <CountB />
    <ProduceC />
  </>
);

toStorybook.story = {
  name: "to Storybook1"
};
