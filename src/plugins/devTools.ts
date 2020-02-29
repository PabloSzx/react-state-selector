import { Patch } from "immer";

export interface ReduxDevTools {
  subscribe: (cb: (message: any) => void) => void;
  unsuscribe: () => void;
  send: (action: { type: string; payload: Patch[] }, state: any) => void;
  init: (state: any) => void;
  error: (message: string) => void;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: {
      connect: (args: { name: string; serialize: boolean }) => ReduxDevTools;
    };
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
