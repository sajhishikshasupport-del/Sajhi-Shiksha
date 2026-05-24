import { useEffect, useRef, useCallback } from 'react';

/**
 * Debounce hook for search inputs.
 * Returns a debounced callback that delays execution by `delay` ms.
 * Automatically cancels pending calls on unmount or when dependencies change.
 */
export function useDebounceCallback<T extends (...args: Parameters<T>) => void>(
    callback: T,
    delay: number
): T {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        }) as T,
        [callback, delay]
    );
}
