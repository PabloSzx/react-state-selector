import React, { FC, useState } from "react";

import { createStore } from "../src";

const {
  useCountA,
  useCountB,
  useProduce,
  incrementA,
  printCurrentStore
} = createStore(
  {
    countA: 5,
    countB: 15
  },
  {
    hooks: {
      useCountA: ({ countA }, { a, b }: { a: string; b?: string }) => {
        return a + (b || "") + " - " + countA;
      },
      useCountB: ({ countB }) => {
        return countB;
      }
    },
    actions: {
      incrementA: (a: number) => async draft => {
        const delay = false;
        if (delay) {
          draft.countA += await new Promise<number>(resolve => {
            setTimeout(() => {
              resolve(a);
            }, 1000);
          });
        } else {
          draft.countA += a;
        }
        return "xd" as const;
      },
      printCurrentStore: () => draft => {
        alert(JSON.stringify(draft));
      }
    }
  }
);

const CountA: FC = () => {
  const [a, setA] = useState("asd");

  const count = useCountA(() => ({ a, b: "..." }), [a]);

  const { produce, asyncProduce } = useProduce();

  return (
    <div>
      <input value={a} onChange={({ target: { value } }) => setA(value)} />
      <br />
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          asyncProduce(async draft => {
            draft.countA = 0;
          });
        }}
      >
        Async produce A
      </button>
      <br />
      <br />
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
      <span>94 - {count}</span>
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

const CountC = () => {
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

const Produce: FC = () => {
  const { asyncProduce } = useProduce();
  return (
    <>
      {Math.round(Math.random() * 1000)}
      <button
        onClick={async () => {
          await asyncProduce(async draft => {
            await new Promise(resolve => {
              setTimeout(resolve, 4000);
            });

            draft.countB += 100;
          });
        }}
      >
        Async produce B
      </button>
    </>
  );
};

const Actions: FC = () => {
  return (
    <>
      <br />
      <br />
      <br />
      <button
        onClick={async () => {
          const result = await incrementA(1);
          alert(result);
        }}
      >
        Increment A + 1
      </button>
      <br />
      <br />
      <br />
      <button
        onClick={() => {
          printCurrentStore();
        }}
      >
        Print Current Store
      </button>
    </>
  );
};

export const Home = () => (
  <div>
    <CountA />
    <CountB />
    <CountC />
    <Produce />
    <Actions />
  </div>
);

export default {
  title: "Home"
};

Home.story = {
  name: "Home"
};
