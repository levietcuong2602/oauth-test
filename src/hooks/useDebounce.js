const { useRef, useState, useEffect } = require('react');

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const handler = useRef(null);

  const forceSetDeboucedValue = (forceVal) => {
    if (handler.current) {
      clearTimeout(handler.current);
    }
    setDebouncedValue(forceVal);
  };

  useEffect(() => {
    handler.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };
  }, [value]);

  return [debouncedValue, forceSetDeboucedValue];
};

export default useDebounce;
