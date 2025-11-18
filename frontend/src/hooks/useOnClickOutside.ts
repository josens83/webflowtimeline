/**
 * useOnClickOutside Hook
 * 요소 외부 클릭을 감지하는 훅
 */

import { RefObject, useEffect } from 'react';

/**
 * 요소 외부 클릭을 감지하는 훅
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useOnClickOutside(ref, () => {
 *   setIsOpen(false);
 * });
 * ```
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      // ref 요소가 없거나, 클릭한 요소가 ref 내부인 경우 무시
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
