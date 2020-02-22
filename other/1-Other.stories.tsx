import { createStore } from "../src";

const { hooks } = createStore(
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
