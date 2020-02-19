import { Context } from "react";

export const createContext: <T>(
  defaultValue: T
) => Pick<Context<T>, "Provider" | "displayName">;

export const useContextSelector: <T, S, U>(
  context: Pick<Context<T>, "Provider" | "displayName">,
  selector: (value: T) => S,
  selectorKey?: (value: T) => U
) => S;

export const useContext: <T>(
  context: Pick<Context<T>, "Provider" | "displayName">
) => T;
