import React, { FC, useState } from "react";

import { createStore } from "../src";

const { useCountA, useCountB, useProduce } = createStore(
  {
    countA: 0,
    countB: 0
  },
  {
    useCountA: ({ countA }, arg: { a: string }) => {
      return countA + arg.a;
    },
    useCountB: ({ countB }) => {
      return countB;
    }
  }
);

const CountA: FC = () => {
  const [a, setA] = useState("asd");

  const count = useCountA({ a });

  const { produce } = useProduce();

  return (
    <div>
      <input value={a} onChange={({ target: { value } }) => setA(value)} />

      <br />
      <br />
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
  const [a, setA] = useState("zxc");
  const count = useCountA({ a });
  return (
    <>
      <br />
      <input value={a} onChange={({ target: { value } }) => setA(value)} />

      <br />

      <br />
      <br />
      {Math.round(Math.random() * 1000)}

      <p>{count}</p>
    </>
  );
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
