import { useEffect, useRef, useCallback } from 'react';

export function useFocusLoss(enabled: boolean = true) {
  const countRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const handler = () => {
      if (document.hidden) {
        countRef.current += 1;
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [enabled]);

  const getCount = useCallback(() => countRef.current, []);
  const reset = useCallback(() => { countRef.current = 0; }, []);

  return { getCount, reset };
}
