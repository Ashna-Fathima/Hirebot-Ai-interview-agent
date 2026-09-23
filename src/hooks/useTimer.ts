import { useEffect, useRef, useState, useCallback } from 'react';

export function useTimer(seconds: number, onExpire: () => void, active: boolean = true) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const expiredRef = useRef(false);

  useEffect(() => {
    if (active) {
      setTimeLeft(seconds);
      expiredRef.current = false;
    } else {
      setTimeLeft(seconds);
    }
  }, [seconds, active]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const reset = useCallback(() => {
    setTimeLeft(seconds);
    expiredRef.current = false;
  }, [seconds]);

  return { timeLeft, reset, setTimeLeft };
}
