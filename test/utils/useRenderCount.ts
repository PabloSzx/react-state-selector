import { useRef } from "react";

export function nRenderString(n: number) {
  return `nRenders=${n}`;
}

export function useRenderCount() {
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;

  return nRenderString(renderCountRef.current);
}
