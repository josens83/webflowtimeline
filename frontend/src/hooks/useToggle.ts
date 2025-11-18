/**
 * useToggle Hook
 * Boolean 상태를 토글하는 간단한 훅
 */

import { useState, useCallback } from 'react';

/**
 * Boolean 상태를 토글하는 훅
 *
 * @example
 * ```tsx
 * const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
 *
 * <button onClick={toggleOpen}>Toggle</button>
 * <button onClick={() => setIsOpen(true)}>Open</button>
 * ```
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
