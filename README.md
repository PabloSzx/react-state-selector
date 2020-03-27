# React State Selector

![logo](https://i.imgur.com/dIeukBc.png)

[![codecov](https://codecov.io/gh/PabloSzx/react-state-selector/branch/master/graph/badge.svg?token=86B359Hwdw)](https://codecov.io/gh/PabloSzx/react-state-selector)
[![npm version](https://badge.fury.io/js/react-state-selector.svg)](https://badge.fury.io/js/react-state-selector)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/react-state-selector)](https://bundlephobia.com/result?p=react-state-selector)
[![license](https://badgen.net/github/license/pabloszx/react-state-selector)](https://github.com/pabloszx/react-state-selector)
[![combined statuses](https://badgen.net/github/status//pabloszx/react-state-selector)](https://github.com/pabloszx/react-state-selector)

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

- [x] Redux **DevTools** support
- [x] **async** actions (_**redux-thunk** alike_)
- [x] **TypeScript** first class support
- [x] **_reselect_** createSelector support
- [x] Easy and efficient **localStorage** data persistence

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
      incrementA: (n: number) => (draft) => {
        // Here you can mutate "draft", and immer will
        // automatically make the immutable equivalent
        draft.countA += n;
      },
      incrementB: (n: number) => (draft) => {
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

This library uses type inference to automatically help you with auto-completion and type-safety, **even if you only use JavaScript and not TypeScript!**.

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
      incrementA: (n: number) => (draft) => {
        // Here you can mutate "draft", and immer will
        // automatically make the immutable equivalent
        draft.countA += n;
      },
      incrementB: (n: number) => (draft) => {
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
const state = produce((draft) => {
  draft.a += 1;
});
console.log(produce() === state); // true
```

#### asyncProduce: _function(async draft => void | TStore): Promise TStore_

- Asynchronous change to the store state, you should give it an async function that will mutate the state and it will give a promise of the resulting global state after the transformation.
- It is often better to use [custom actions](#custom-actions) for dealing with asynchronous requests, since here when you start the async function, you might had received a stale draft state after the request is done.
- You shouldn't rely on this feature to transform the entire state as with [produce](#produce-functiondraft--void--tstore-tstore) or [custom actions](#custom-actions);

```ts
const state = await asyncProduce(async (draft) => {
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
        produce((draft) => {
          draft.count += 1;
        })
      }
    >
      Increment
    </button>
  );
};
```

## Custom API

This is where this library aims to work the best using **type inference**, **memoization** and **mutability _with_ immutability** seemlessly without any boilerplate needed.

### Custom Hooks

In both **createStore** and **createStoreContext** the functionality is **the same**.

You should specify an object inside the options object _(**second parameter**)_ called **hooks**.

Inside this object you have to follow the [**custom hooks naming rule**](https://reactjs.org/docs/hooks-custom.html#extracting-a-custom-hook) for every custom hook, and inside, you give a function that will receive **two parameters**, the first one will be the **state** of the store, and the second one will be the _optional_ **custom props** of the hook.

In the resulting store object you will get an object field called **hooks**, which will have all the custom hooks specified in the creation.

```tsx
// const ABStore = createStoreContext(
const ABStore = createStore(
  { a: 1, b: 2 },
  {
    hooks: {
      useA: ({ a, b }) => {
        return a;
      },
      useB: ({ a, b }) => {
        return b;
      },
      useMultiplyAxN: (
        { a, b },
        n: number
        /* Only if you are using TypeScript 
      you have to specify the type of the props */
      ) => {
        return a * n;
      },
    },
  }
);

const { useA, useB } = ABStore.hooks;
// You can destructure the hooks if you want

const A = () => {
  const a = useA();

  return <p>{a}</p>;
};
const B = () => {
  const b = useB();

  return <p>{b}</p>;
};
const AxN = () => {
  // Or you can just call the hook from
  // the store object itself
  const axn = ABStore.hooks.useMultiplyAxN(10);

  return <p>{axn}</p>;
};
```

> Check **https://pabloszx.github.io/react-state-selector** for more advanced usage, like giving **multiple props** to a custom hook or returning a **new instance of data** based on the state and props, all of those, efficiently.

### Custom Actions

A very important feature of any global state is being able to modify it based on arguments given to a function and/or based on the current state, and using a reducer and dispatching action types and payload is a possible solution, but in this library the proposed solution is to specify the action types **explicitly** in the function names and it's payload in it's arguments.

In both **createStore** and **createStoreContext** the functionality is the same, but the usage in **createStoreContext** is a bit different due to **React Context API** constraints.

You should specify an object inside the options object _(**second parameter**)_ called **actions** and/or **asyncActions**.

#### Actions

Inside the **actions** object you have to give functions called whatever you want, which will receive the custom arguments of the action, and this function should **return another function** which will receive the **state draft**, and that one should either return nothing or a new instance of the store state, just like [produce](#produce-functiondraft--void--tstore-tstore).

The resulting object store will have either:

- **actions** object field in **createStore**.
- **useActions** hook that returns the custom actions in **createStoreContext**

```tsx
const Store = createStore(
  { a: 1 },
  {
    actions: {
      increment: (n: number) => (draft) => {
        draft.a += n;
      },
    },
  }
);
const StoreCtx = createStore(
  { b: 1 },
  {
    actions: {
      decrement: (n: number) => (draft) => {
        draft.b -= n;
      },
    },
  }
);
const A = () => {
  const { a } = Store.useStore();

  return (
    <div>
      <button onClick={() => Store.increment(5)}>Increment</button>
      <p>{a}</p>
    </div>
  );
};
const B = () => {
  const { b } = Store.useStore();
  const { decrement } = Store.useActions();

  return (
    <div>
      <button onClick={() => decrement(5)}>Decrement</button>
      <p>{b}</p>
    </div>
  );
};
```

#### Async Actions

Async actions need to be defined in another object inside the **options object** called **asyncActions**, and the first function should **not** be _async_ itself since it receives a **_dispatch like_** function which works just like [produce](#produce-functiondraft--void--tstore-tstore), and after that you should define the **async function** which will receive the parameters you expect in the action.

Both action types are merged inside the same **actions object** result of the [synchronous actions](#actions).

```tsx
enum State {
  waiting,
  loading,
  complete,
  error,
}

// const Store = createStoreContext(
const Store = createStore(
  {
    data: undefined,
    state: State.waiting,
  },
  {
    asyncActions: {
      getData: (produce) => async (bodyArgs) => {
        produce((draft) => {
          draft.state = State.loading;
        });

        try {
          const response = await axios.post("/data", bodyArgs);

          produce((draft) => {
            draft.state = State.complete;
            draft.data = response.data;
          });
        } catch (err) {
          console.error(err);
          produce((draft) => {
            draft.state = State.error;
          });
        }
      },
    },
  }
);

const Data = () => {
  const storeData = Store.useStore();

  // const {getData} = Store.useActions();
  const { getData } = Store.actions;

  switch (storeData.state) {
    case State.loading:
      return <p>Loading...</p>;
    case State.complete:
      return <p>{JSON.stringify(storeData.data)}</p>;
    case State.waiting:
      return (
        <button
          onClick={async () => {
            const newStore = await getData();
            console.log("newStore", newStore);
          }}
        >
          Get Data
        </button>
      );
    case State.error:
    default:
      return <p>ERROR! Check the console</p>;
  }
};
```

> Keep in mind that you can mix common synchronous actions and async actions in a single store, but you should not repeat the action names in both objects.

### **localStorage** data persistence and **DevTools**

When creating an store via **createStore** or **createStoreContext** you can specify some field that enable some useful features:

```tsx
//createStoreContext(
createStore(
  {
    foo: "bar",
  },
  {
    /**
     * devName
     *
     * Activates the Redux DevTools for this store using
     * this name as reference.
     */
    devName: "fooBarStore",

    /**
     * devToolsInProduction
     *
     * Activates the Redux Devtools functionality in production.
     *
     * By default this is false
     */
    devToolsInProduction: true,
    storagePersistence: {
      /**
       * isActive
       *
       * Activates the data persistence in this store
       **/
      isActive: true,
      /**
       * persistenceKey
       *
       * Set the key used for the storage persistence method.
       *
       * It has to be a string, and if it's not specified
       * reuses the "devName", but it has to exists at least one
       * of these two if the storagePersistence is active
       **/
      persistenceKey: "fooBarStore",
      /**
       * debounceWait
       *
       * Calling an external store like localStorage every time
       * any change to the store is very computationally expensive
       * and that's why by default this functionality is being debounced
       * to be called only when needed, after X amount of milliseconds
       * since the last change to the store.
       *
       * By default it's set to 3000 ms, but you can customize it to
       * be 0 if you want almost instant save to the persistence store
       **/
      debounceWait: 1000,
      /**
       * persistenceMethod
       *
       * You also can customize the persistence method,
       * but by default uses window.localStorage.
       *
       * Keep in mind that it should follow the same API
       * of setItem and getItem of localStorage
       **/
      persistenceMethod: window.localStorage,
      /**
       * isSSR
       *
       * Flag used to specify that this store is going to be
       * used in server side rendering environments and it prevents
       * client/server mismatched html on client side hydration
       *
       * false by default
       **/
      isSSR: true,
    },
  }
);
```

### **Map / Set** support _and/or_ **old browsers / React Native** support

In [Immer](https://immerjs.github.io/immer) latest version in order to reduce bundle size if you need support for **Map**, **Set**, **old browsers** or **React Native** you need to call some specific Immer functions as early as possible in your application.

```tsx
// You can import from either immer or react-state-selector

// import { enableES5, enableMapSet } from "immer";
import { enableES5, enableMapSet } from "react-state-selector";

// Import and call as needed

enableES5();

enableMapSet();
```

> [Immer documentation](https://immerjs.github.io/immer/docs/installation#pick-your-immer-version)

---

> Heavily inspired by [redux](https://github.com/reduxjs/redux) and [react-sweet-state](https://github.com/atlassian/react-sweet-state)

---
