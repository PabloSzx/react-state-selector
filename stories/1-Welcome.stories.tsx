import React, { FC } from "react";

import { createStore } from "../src";

const { useCountA, useCountB, useProduce } = createStore(
  {
    countA: 0,
    countB: 0
  },
  {
    useCountA: ({ countA }) => {
      return countA;
    },
    useCountB: ({ countB }) => {
      return countB;
    }
  }
);

const CountA: FC = () => {
  const count = useCountA();
  const { produce } = useProduce();
  console.log(Math.round(Math.random() * 100));
  return (
    <div>
      <button
        onClick={() => {
          produce(state => {
            state.countA -= 2;
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
      <span>{Math.round(Math.random() * 1000)}</span>
    </div>
  );
};
const CountB: FC = () => {
  const count = useCountB();
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
      <span>{Math.round(Math.random() * 1000)}</span>
    </div>
  );
};

export const ProduceC = () => {
  useProduce();

  return <>{Math.round(Math.random() * 1000)}</>;
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
