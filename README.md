# React State Selector

[![codecov](https://codecov.io/gh/PabloSzx/react-state-selector/branch/master/graph/badge.svg?token=86B359Hwdw)](https://codecov.io/gh/PabloSzx/react-state-selector)
[![npm version](https://badge.fury.io/js/react-state-selector.svg)](https://badge.fury.io/js/react-state-selector)

## **React global state management**, the performant, type safe and easy way

> Heavily inspired by [redux](https://github.com/reduxjs/redux) and [react-sweet-state](https://github.com/atlassian/react-sweet-state)

```sh
npm install react-state-selector
# or
yarn add react-state-selector
```

---

### What if we combine [**immer**](https://github.com/immerjs/immer), [**reselect**](https://github.com/reduxjs/reselect) and even [**React Context API**](https://reactjs.org/docs/context.html) to make a performant and expressive React global state manager?

```tsx
import { createStore } from "react-state-selector";

const {
  hooks: { useCountA, useCountB },
  actions: { incrementA, incrementB },
} = createStore(
  {
    countA: 0,
    countB: 0,
  },
  {
    hooks: {
      useCountA: ({ countA }) => {
        // Here reselect will automatically memoize this selector and only rerender the component when absolutely needed
        return countA;
      },
      useCountB: ({ countB }) => {
        return countB;
      },
    },
    actions: {
      incrementA: (n: number) => draft => {
        // Here you can mutate "draft", and immer will automatically make the immutable equivalent
        draft.countA += n;
      },
      incrementB: (n: number) => draft => {
        draft.countB += n;
      },
    },
  }
);

// ...

const CounterA = () => {
  const a = useCountA();

  return (
    <div>
      <h1>Counter A</h1>
      <span>{a}</span>
      <button onClick={() => incrementA(1)}>+</button>
    </div>
  );
};

const CounterB = () => {
  const b = useCountB();

  return (
    <div>
      <h1>Counter B</h1>
      <span>{b}</span>
      <button onClick={() => incrementB(2)}>+</button>
    </div>
  );
};
```
