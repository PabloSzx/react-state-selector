# React State Selector

[![codecov](https://codecov.io/gh/PabloSzx/react-state-selector/branch/master/graph/badge.svg?token=86B359Hwdw)](https://codecov.io/gh/PabloSzx/react-state-selector)
[![npm version](https://badge.fury.io/js/react-state-selector.svg)](https://badge.fury.io/js/react-state-selector)

## **React global state management**, the performant, type safe and easy way

```sh
npm install react-state-selector
# or
yarn add react-state-selector
```

---

## What if we combine [**immer**](https://github.com/immerjs/immer), [**reselect**](https://github.com/reduxjs/reselect) and even [**React Context API**](https://reactjs.org/docs/context.html) to make a performant and expressive React global state manager?

> Check **https://pabloszx.github.io/react-state-selector** for more detailed examples and use cases.

### Features

- [x] Redux DevTools
- [x] async actions
- [x] TypeScript first class support
- [x] **_reselect_** createSelector support
- [ ] **More** examples and use cases (In progress...)

### Basic Usage

For simple global stores you can use createStore.

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
        // Here reselect will automatically memoize this selector
        // and only rerender the component when absolutely needed
        return countA;
      },
      useCountB: ({ countB }) => {
        return countB;
      },
    },
    actions: {
      incrementA: (n: number) => draft => {
        // Here you can mutate "draft", and immer will
        // automatically make the immutable equivalent
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

This library uses type inference to automatically help you with auto-completion and type-safety, **even if you only use JavaScript and not TypeScript !**.

### Basic Context Usage

If you need multiple instances of a specific store you can use the React Context API to make specific instances of the store.

```tsx
import { createStoreContext } from "react-state-selector";

const {
  hooks: { useCountA, useCountB },
  useActions,
  Provider,
} = createStoreContext(
  {
    countA: 0,
    countB: 0,
  },
  {
    hooks: {
      useCountA: ({ countA }) => {
        // Here reselect will automatically memoize this selector
        // and only rerender the component when absolutely needed
        return countA;
      },
      useCountB: ({ countB }) => {
        return countB;
      },
    },
    actions: {
      incrementA: (n: number) => draft => {
        // Here you can mutate "draft", and immer will
        // automatically make the immutable equivalent
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
  const { incrementA } = useActions();

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
  const { incrementB } = useActions();
  return (
    <div>
      <h1>Counter B</h1>
      <span>{b}</span>
      <button onClick={() => incrementB(2)}>+</button>
    </div>
  );
};

// ...

const Counters = () => {
  return (
    <>
      <Provider>
        <CounterA />
        <CounterB />
      </Provider>
      <Provider>
        <CounterB />
      </Provider>
    </>
  );
};
```

## Default API

By default every created store gives a couple of out of the box functionality, if you don't use them it's okay, but they could end up being handy:

### createStore

#### produce: _function(draft => void | TStore): TStore_

- Synchronous change to the store state, you should give it a function that will mutate the state and it will give the resulting global state after the transformation. Don't worry about mutating the draft, immer will do the transformations. At first it might feel weird if you are used to making the immutable equivalent of every mutation and using ~~_(abusing)_~~ the spread syntax.
- If you **return** something in the draft function, it will transform the entire global state into that value. [_Read more_](https://immerjs.github.io/immer/docs/return).
- If you **don't** give it a function, it will work simply as a **state getter**, so you can check the global state anytime without any restriction.

```ts
const state = produce(draft => {
  draft.a += 1;
});
console.log(produce() === state); // true
```

#### asyncProduce: _function(async draft => void | TStore): Promise TStore_

- Asynchronous change to the store state, you should give it an async function that will mutate the state and it will give a promise of the resulting global state after the transformation.
- It is often better to use custom actions for dealing with asynchronous requests, since here when you start the async function, you might had received a stale draft state after the request is done.
- You shouldn't rely on this feature to transform the entire state as with [produce](#produce-functiondraft--void--tstore-tstore) or custom actions;

```ts
const state = await asyncProduce(async draft => {
  draft.users = await (await fetch("/api/users")).json();
});
console.log(produce() === state); // true
```

#### useStore: _function(): TStore_

- Hook that subscribes to any change in the store

```tsx
const CompStore = () => {
  const store = useStore();

  return <div>{JSON.stringify(store, null, 2)}</div>;
};
```

### createStoreContext

#### useStore: _function(): TStore_

- Hook that subscribes to any change in the store

```tsx
const CompStore = () => {
  const store = useStore();

  return <div>{JSON.stringify(store, null, 2)}</div>;
};
```

#### useProduce: _function(): { produce, asyncProduce }_

- Hook that gives an object containing the same functions [produce](#produce-functiondraft--void--tstore-tstore) and [asyncProduce](#asyncproduce-functionasync-draft--void--tstore-promise-tstore) from [createStore](#createstore)

```tsx
const IncrementComp = () => {
  const { produce } = useProduce();

  return (
    <button
      onClick={() =>
        produce(draft => {
          draft.count += 1;
        })
      }
    >
      Increment
    </button>
  );
};
```

---

> Heavily inspired by [redux](https://github.com/reduxjs/redux) and [react-sweet-state](https://github.com/atlassian/react-sweet-state)

---
