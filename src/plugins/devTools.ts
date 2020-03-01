import { Patch } from "immer";

// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Methods.md
export interface ReduxDevTools {
  subscribe: (cb: (message: any) => void) => void;
  unsubscribe: () => void;
  send: (action: { type: string; payload: Patch[] }, state: any) => void;
  init: (state: any) => void;
  error: (message: string) => void;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__:
      | {
          connect: (args: {
            name: string;
            serialize: boolean;
          }) => ReduxDevTools;
          open: (
            position: "left" | "right" | "bottom" | "panel" | "remote"
          ) => void;
        }
      | undefined;
  }
}

export const connectDevTools = (name: string): ReduxDevTools | undefined => {
  try {
    if (
      typeof window !== "undefined" &&
      typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
    ) {
      const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
        name: `Store ${name}`,
        serialize: true,
      });

      return devTools;
    }
  } catch (err) {}
  return undefined;
};
