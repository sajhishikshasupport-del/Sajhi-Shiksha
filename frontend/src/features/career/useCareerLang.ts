/**
 * Language state for the Career Counselling section (REQ-1012-16).
 *
 * The active language is carried on the URL as a `?lang=hi` query parameter
 * (no parameter = English, the default). We deliberately do NOT add routes or
 * change the router — path-based leaf routing has broken this site before — so
 * the value is read from and written to `window.location` via
 * `history.replaceState`. That keeps the URL shareable and the back button
 * working, and `replaceState` (not `pushState`) means toggling never adds a
 * history entry.
 *
 * The choice is also persisted in localStorage so it carries across the career
 * pages: a page whose URL has no `?lang` still opens in the last chosen
 * language, and the hook re-adds the parameter to the URL so it stays visible.
 */
import { useCallback, useEffect, useState } from 'react';

export type CareerLang = 'en' | 'hi';

const STORAGE_KEY = 'career-lang';

function isLang(value: string | null): value is CareerLang {
    return value === 'en' || value === 'hi';
}

/** The `?lang` value on the current URL, or null when absent/unknown. */
function readUrlLang(): CareerLang | null {
    if (typeof window === 'undefined') return null;
    try {
        const value = new URLSearchParams(window.location.search).get('lang');
        return isLang(value) ? value : null;
    } catch {
        return null;
    }
}

/** The last language the visitor chose, or null when none was stored. */
function readStoredLang(): CareerLang | null {
    if (typeof window === 'undefined') return null;
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return isLang(value) ? value : null;
    } catch {
        return null;
    }
}

/** Reflect a language on the URL without adding a history entry. */
function syncUrl(lang: CareerLang): void {
    if (typeof window === 'undefined') return;
    try {
        const url = new URL(window.location.href);
        if (lang === 'hi') url.searchParams.set('lang', 'hi');
        else url.searchParams.delete('lang');
        const next = `${url.pathname}${url.search}${url.hash}`;
        const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (next !== current) {
            window.history.replaceState(window.history.state, '', next);
        }
    } catch {
        /* never break navigation because of the language toggle */
    }
}

function storeLang(lang: CareerLang): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
        /* storage may be unavailable (private mode) — the URL still carries it */
    }
}

/**
 * Resolve the active career language and expose a setter.
 *
 * URL wins over the stored value; with neither present the default is English.
 * A mount effect keeps the URL and the stored value in step with the active
 * language, so navigating to a career page without `?lang` still shows (and
 * re-annotates the URL with) the chosen language.
 */
export function useCareerLang(): { lang: CareerLang; setLang: (lang: CareerLang) => void } {
    const [lang, setLangState] = useState<CareerLang>(() => readUrlLang() ?? readStoredLang() ?? 'en');

    useEffect(() => {
        syncUrl(lang);
        storeLang(lang);
    }, [lang]);

    const setLang = useCallback((next: CareerLang): void => {
        setLangState(next);
    }, []);

    return { lang, setLang };
}
