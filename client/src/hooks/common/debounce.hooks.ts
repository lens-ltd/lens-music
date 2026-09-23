import { useEffect, useState } from "react";

// DEBOUNCED VALUE
// Follows `value` once it has stopped changing for `delay` ms, so a search
// field sends one request per pause instead of one per keystroke.
export const useDebouncedValue = <T,>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
