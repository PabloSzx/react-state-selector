/**
 * @jest-environment node
 */

import React, { FC } from "react";
import { renderToString } from "react-dom/server";

import { createStore, createStoreContext } from "../src";

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
      expect(() => {
        createStore(initialStore, {
          hooks: {
            wrongHookName: () => {},
          },
        });
      }).toThrow(
        Error(
          'All hooks should follow the rules of hooks for naming and "wrongHookName" doesn\'t'
        )
      );
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
      expect(() => {
        createStoreContext(initialStore, {
          hooks: {
            wrongHookName: () => {},
          },
        });
      }).toThrow(
        Error(
          'All hooks should follow the rules of hooks for naming and "wrongHookName" doesn\'t'
        )
      );
    });
  });
});
