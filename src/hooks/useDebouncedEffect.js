import { useEffect, useRef } from 'react';

const useDebouncedEffect = (effect, deps, delay = 500) => {
  const handler = useRef(null);

  useEffect(() => {
    handler.current = setTimeout(() => effect(), delay);

    return () => {
      if (handler.current) {
        clearTimeout(handler.current);
      }
    };
  }, [...(deps || []), delay]);
};

export default useDebouncedEffect;
