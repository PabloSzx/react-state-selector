import React, { FC } from "react";

import { render } from "@testing-library/react";

import { createStore } from "../src";

describe("works", () => {
  it("renders without crashing", () => {
    const { useStore, useCountB, printCurrentStore } = createStore(
      {
        countA: 5,
        countB: 15,
      },
      {
        hooks: {
          useCountB: ({ countB }) => {
            return countB;
          },
          useTuPune: () => {},
        },
        actions: {
          printCurrentStore: () => draft => {
            alert(JSON.stringify(draft));
          },
        },
      }
    );

    const Component: FC = () => {
      const store = useStore();
      return <div>{store.countA}</div>;
    };

    const { getByText } = render(<Component />);

    const variable = getByText("5");

    expect(variable).toBeTruthy();
  });
});
