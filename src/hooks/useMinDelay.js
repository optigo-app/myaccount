import { useEffect, useState } from "react";

export function useMinDelay(delay = 2000) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return done;
}
