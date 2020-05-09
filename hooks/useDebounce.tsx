import {useEffect, useState} from 'react';

// ref: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
const useDebounce = (value: string, delay: number): string => {

  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
