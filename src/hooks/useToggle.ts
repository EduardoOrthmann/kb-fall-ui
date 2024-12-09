import { useCallback, useState } from 'react';

const useToggle = (initialState: boolean) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback((value?: boolean) => {
    setState((prevState) => (typeof value === 'boolean' ? value : !prevState));
  }, []);

  return [state, toggle] as const;
};

export default useToggle;

