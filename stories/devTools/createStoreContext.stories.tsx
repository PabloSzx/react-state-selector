import React, { CSSProperties, FC, useState } from "react";
import { createStoreContext } from "react-state-selector";

import { DevTools } from "../../stories/utils/devTools";

const boxStyle = (color: string): CSSProperties => {
  return {
    border: `1px solid ${color}`,
    padding: "5px",
    borderRadius: "5px",
    width: "fit-content",
    color: "white",
  };
};

const {
  Provider,
  hooks: { useA, useB },
  useActions,
} = createStoreContext(
  {
    a: 1,
    b: 2,
  },
  {
    devName: "CountContextExample",
    devToolsInProduction: true,
    hooks: {
      useA: ({ a }) => {
        return a;
      },
      useB: ({ b }) => {
        return b;
      },
    },
    actions: {
      incrementA: (n: number) => (draft) => {
        draft.a += n;
      },
      incrementB: (n: number) => (draft) => {
        draft.b += n;
      },
    },
  }
);

const RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {
  // This component is designed to show that every component
  // only subscribes to the data it needs, therefore, less renders needed

  return (
    <p style={boxStyle("red")}>
      Random Number = {Math.round(Math.random() * limit)}
    </p>
  );
};

const A: FC = () => {
  const a = useA();
  const { incrementA } = useActions();

  return (
    <div style={boxStyle("blue")}>
      <p>{a}</p>
      <button onClick={() => incrementA(5)}>Increment A (+5)</button>
      <RandomNumberEveryRender />
    </div>
  );
};
const B: FC = () => {
  const b = useB();
  const { incrementB } = useActions();

  return (
    <div style={boxStyle("blue")}>
      <p>{b}</p>
      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}
      <RandomNumberEveryRender />
    </div>
  );
};
const ManualIncrement: FC = () => {
  const [n, setN] = useState(1);
  const { incrementA, incrementB } = useActions();

  return (
    <div style={boxStyle("blue")}>
      <input
        value={n}
        type="number"
        onChange={({ target: { value } }) => setN(parseInt(value))}
      />
      <button
        onClick={() => {
          incrementA(n);
        }}
      >
        Increment A
      </button>
      <button
        onClick={() => {
          incrementB(n);
        }}
      >
        Increment B
      </button>
      <RandomNumberEveryRender />
    </div>
  );
};

export const createStoreContextDev = () => {
  return (
    <>
      <DevTools />
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Provider debugName="Provider 1">
          <div style={boxStyle("green")}>
            <p>Provider 1</p>
            <A />
            <br />
            <B />
            <br />
            <ManualIncrement />
            <br />
            <RandomNumberEveryRender />
          </div>
        </Provider>
        <Provider debugName="Provider 2">
          <div style={boxStyle("green")}>
            <p>Provider 2</p>
            <A />
            <br />
            <B />
            <br />
            <ManualIncrement />
            <br />
            <RandomNumberEveryRender />
          </div>
        </Provider>
      </div>
    </>
  );
};

export default {
  title: "devTools",
};
