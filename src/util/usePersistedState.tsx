import { useState, useEffect } from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * A generic hook that persists its state in window.localStorage.
 *
 * @param key The key to store the value under.
 * @param defaultValue The default value to use if none exists in storage.
 * @returns A tuple of [value, setValue] similar to useState.
 */
function usePersistedState<T>(key: string, defaultValue: T): [T, SetState<T>] {
  // initialize from localStorage (or default)
  const [state, setState] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        console.warn(
          `usePersistedState: failed to parse localStorage key "${key}"`
        );
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      console.warn(
        `usePersistedState: failed to serialize state for key "${key}"`
      );
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
