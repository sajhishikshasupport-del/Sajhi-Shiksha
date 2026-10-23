import { useEffect, useState } from 'react';

/**
 * Large lookup tables (document descriptions, page intros, ...) are served as
 * static files from /data/ and fetched here at runtime, instead of being
 * `import`ed - which would bake them into the main JavaScript bundle and make
 * every phone download and parse them before the page can paint.
 *
 * Keeps the app shell small (Core Web Vitals: LCP / INP).
 */
const cache = new Map<string, Promise<Record<string, unknown>>>();

export function loadJson(path: string): Promise<Record<string, unknown>> {
    let pending = cache.get(path);
    if (!pending) {
        pending = fetch(path)
            .then((res) => (res.ok ? res.json() : {}))
            .catch(() => ({}));
        cache.set(path, pending);
    }
    return pending;
}

/** Returns `fallback` until the file has arrived, then the parsed data. */
export function useJsonData<T>(path: string, fallback: T): T {
    const [data, setData] = useState<T>(fallback);

    useEffect(() => {
        let alive = true;
        void loadJson(path).then((json) => {
            if (alive) setData(json as unknown as T);
        });
        return () => {
            alive = false;
        };
    }, [path]);

    return data;
}
