import { useCallback, useEffect, useRef } from 'react';

/** Returns a stable function that delays calls to `fn` by `delay` ms.
 *  Trailing edge by default. Includes a `.flush()` to invoke pending
 *  call immediately, and a `.cancel()` to drop it. */
export function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number
) {
  const fnRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingArgsRef = useRef<A | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    pendingArgsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pendingArgsRef.current) {
      const args = pendingArgsRef.current;
      pendingArgsRef.current = null;
      fnRef.current(...args);
    }
  }, []);

  const run = useCallback(
    (...args: A) => {
      pendingArgsRef.current = args;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const a = pendingArgsRef.current;
        pendingArgsRef.current = null;
        if (a) fnRef.current(...a);
      }, delay);
    },
    [delay]
  );

  useEffect(() => () => cancel(), [cancel]);

  return Object.assign(run, { flush, cancel });
}
