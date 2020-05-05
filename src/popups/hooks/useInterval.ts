import * as React from "react";

export const useInterval = (
  callback: () => void,
  interval: number | null
): void => {
  const savedCallback = React.useRef<(() => void) | null>(null);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    const tick = (): void => {
      savedCallback.current && savedCallback.current();
    };
    if (interval !== null) {
      const id = setInterval(tick, interval);
      return (): void => clearInterval(id);
    }
  }, [interval]);
};
