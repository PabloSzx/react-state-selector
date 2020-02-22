import { createStore } from "../src";

const { asd } = createStore(
  {
    a: 1,
  },
  {
    hooks: {
      useA: () => {},
    },
    actions: {
      asd: () => draft => {
        return draft;
      },
    },
  }
);
