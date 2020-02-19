import React from "react";

// File based on https://github.com/dai-shi/use-context-selector/blob/master/src/index.js

const CONTEXT_LISTENERS =
  process.env.NODE_ENV !== "production"
    ? Symbol("CONTEXT_LISTENERS")
    : /* for production */ Symbol();

const createProvider = (OrigProvider, listeners) =>
  React.memo(({ value, children }) => {
    // we call listeners in render intentionally.
    // listeners are not technically pure, but
    // otherwise we can't get benefits from concurrent mode.
    // we make sure to work with double or more invocation of listeners.
    listeners.forEach(listener => {
      listener(value);
    });
    return React.createElement(OrigProvider, { value }, children);
  });

/**
 * This creates a special context for `useContextSelector`.
 * @param {*} defaultValue
 * @returns {React.Context}
 * @example
 * const PersonContext = createContext({ firstName: '', familyName: '' });
 */
export const createContext = defaultValue => {
  // make changedBits always zero
  const context = React.createContext(defaultValue, () => 0);
  // shared listeners (not ideal)
  context[CONTEXT_LISTENERS] = new Set();
  // hacked provider
  context.Provider = createProvider(
    context.Provider,
    context[CONTEXT_LISTENERS]
  );
  // no support for consumer
  delete context.Consumer;
  return context;
};

/**
 * This hook returns context selected value by selector.
 * It will only accept context created by `createContext`.
 * It will trigger re-render if only the selected value is referencially changed.
 * @param {React.Context} context
 * @param {Function} selector
 * @param {Function} selectorKey
 * @returns {*}
 * @example
 * const firstName = useContextSelector(PersonContext, state => state.firstName);
 */
export const useContextSelector = (context, selector, selectorKey) => {
  const listeners = context[CONTEXT_LISTENERS];
  if (!listeners) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("useContextSelector requires special context");
    } else {
      // for production
      throw new Error();
    }
  }
  const [, forceUpdate] = React.useReducer(c => c + 1, 0);
  const value = React.useContext(context);
  const selected = selector(value);
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    ref.current = {
      f: selector, // last selector "f"unction
      v: selectorKey ? selectorKey(value) : value, // last "v"alue
      s: selected // last "s"elected value
    };
  });
  React.useLayoutEffect(() => {
    const callback = nextValue => {
      try {
        if (selectorKey) {
          if (Object.is(ref.current.v, selectorKey(nextValue))) {
            return;
          }
        } else if (
          ref.current.v === nextValue ||
          Object.is(ref.current.s, ref.current.f(nextValue))
        ) {
          return;
        }
      } catch (e) {
        // ignored (stale props or some other reason)
      }
      forceUpdate();
    };
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }, [listeners]);
  return selected;
};
