import { useCallback, useState } from "react";

const incrementParameter = (num: number) => ++num;

const useUpdate = () => {
  const [, setState] = useState(0);

  return useCallback(() => setState(incrementParameter), []);
};

export default useUpdate;
