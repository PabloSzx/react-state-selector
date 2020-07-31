/**
 * @jest-environment node
 */

import React, { FC } from "react";
import { renderToString } from "react-dom/server";

import { createStore, createStoreContext } from "../src";
import { Constants } from "../src/common";

describe("server-side-rendering", () => {
  describe("basic createStore", () => {
    const initialStore = Object.freeze({
      a: 5,
      b: -5,
    });

    it("useStore works", () => {
      const { useStore } = createStore(initialStore);

      const UseStoreComponent: FC = () => {
        const store = useStore();
        return <span>{store.a}</span>;
      };

      const comp = renderToString(<UseStoreComponent />);

      expect(comp).toContain(initialStore.a.toString());
    });

    it("detect errors on wrong hook names", () => {
      const wrongHookName = "wrongHookName";
      expect(() => {
        createStore(initialStore, {
          hooks: {
            [wrongHookName]: () => {},
          },
        });
      }).toThrow(
        Error(
          `All hooks should follow the rules of hooks for naming and "${wrongHookName}" doesn't`
        )
      );
    });

    it("should not detect errors on wrong hook names if in production mode", () => {
      expect(() => {
        const previous = Constants.IS_NOT_PRODUCTION;
        Constants.IS_NOT_PRODUCTION = false;
        createStore(initialStore, {
          hooks: {
            wrongHookName: () => {},
          },
        });
        Constants.IS_NOT_PRODUCTION = previous;
      }).not.toThrow();
    });
  });

  describe("basic createStoreContext", () => {
    const initialStore = Object.freeze({
      a: 5,
      b: -5,
    });

    it("useStore works", () => {
      const { useStore } = createStoreContext(initialStore);

      const UseStoreComponent: FC = () => {
        const store = useStore();
        return <span>{store.a}</span>;
      };

      const comp = renderToString(<UseStoreComponent />);

      expect(comp).toContain(initialStore.a.toString());
    });

    it("detect errors on wrong hook names", () => {
      const wrongHookName = "wrongHookName";
      expect(() => {
        createStoreContext(initialStore, {
          hooks: {
            [wrongHookName]: () => {},
          },
        });
      }).toThrow(
        Error(
          `All hooks should follow the rules of hooks for naming and "${wrongHookName}" doesn't`
        )
      );
    });

    it("should not detect errors on wrong hook names if in production mode", () => {
      expect(() => {
        const previous = Constants.IS_NOT_PRODUCTION;
        Constants.IS_NOT_PRODUCTION = false;
        createStoreContext(initialStore, {
          hooks: {
            wrongHookName: () => {},
          },
        });
        Constants.IS_NOT_PRODUCTION = previous;
      }).not.toThrow();
    });
  });
});
