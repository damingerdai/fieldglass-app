import { useCallback, useEffect, useRef } from 'react';

export function useCallbackRef<Args extends unknown[], Result>(
  callback: ((...args: Args) => Result) | undefined
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: Args) => callbackRef.current?.(...args), []);
}
