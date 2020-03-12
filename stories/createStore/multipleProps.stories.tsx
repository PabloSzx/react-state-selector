import React, { useState } from "react";
import { createStore } from "react-state-selector";

enum ColorsTypes {
  blue = "blue",
  red = "red",
  green = "green",
}

const Store = createStore(
  {
    data: [
      { color: ColorsTypes.blue, n: 2 },
      { color: ColorsTypes.green, n: 4 },
      { color: ColorsTypes.red, n: 3 },
    ],
  },
  {
    hooks: {
      /**
       * If you need to give more than
       * a single argument to a hook
       * selector, you should give
       * an object
       */
      useGetElement: (state, arg: { color: string; n: number }) => {
        return state.data.find(
          value => value.color === arg.color || value.n === arg.n
        );
      },
    },
  }
);

export const MultipleProps = () => {
  const [color, setColor] = useState("");
  const [n, setN] = useState(0);

  /**
   * But to prevent unneccesary calls
   * to the selector you can give a
   * secondary argument just like useMemo
   * or useCallback
   */
  const element = Store.hooks.useGetElement(
    {
      color,
      n,
    },
    [color, n]
  );

  return (
    <div>
      <label>Color</label>
      <input
        value={color}
        onChange={({ target: { value } }) => setColor(value)}
      />
      <br />
      <label>N</label>
      <input
        value={n}
        type="number"
        onChange={({ target: { value } }) => setN(parseInt(value))}
      />

      <br />
      <br />

      {element && <p style={{ color: element.color }}>{element.n}</p>}
    </div>
  );
};

export default {
  title: "createStore",
};
