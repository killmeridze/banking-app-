import { useEffect, useRef } from "react";

export const useLogoutTimer = (onTimeout) => {
  const timerRef = useRef(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onTimeout, 5 * 60 * 1000); // 5 minutes
    };

    const events = ["mousedown", "mousemove", "keypress"];
    events.forEach((event) => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onTimeout]);
};
