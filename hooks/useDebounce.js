import {useEffect, useState} from 'react';

// ref: https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log('setDebouncedValue');
      setDebouncedValue(value);
    }, delay);

    return () => {
      console.log('clearTimeout');
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;

};

export default useDebounce;
