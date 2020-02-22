import { useRef } from "react";

export const useRenderCount = () => {
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;

  return `nRenders=${renderCountRef.current}`;
};
