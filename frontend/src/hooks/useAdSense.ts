import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-9323406770421868';
const ADSENSE_SCRIPT_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=';

/**
 * Routes where AdSense must NOT load — these pages have little or no
 * original content (AdSense "low value content" risk):
 *   - /search  : dynamic results page, noindex
 *   - 404 splat route ('/$') : not-found page
 */
function isAdFreeRoute(pathname: string, lastRouteId?: string): boolean {
    if (pathname === '/search' || pathname.startsWith('/search/')) return true;
    if (lastRouteId && lastRouteId.endsWith('/$')) return true; // 404 splat route
    return false;
}

/**
 * Loads the Google AdSense script only on content pages.
 * The script tag is intentionally NOT in index.html so that empty
 * pages (/search, 404) never load AdSense at all. The ownership
 * verification meta (google-adsense-account) stays in index.html.
 */
export function useAdSense(): void {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const lastRouteId = useRouterState({
        select: (s) => s.matches[s.matches.length - 1]?.routeId,
    });

    useEffect(() => {
        if (isAdFreeRoute(pathname, lastRouteId)) return;
        if (document.querySelector(`script[data-adsense-client="${ADSENSE_CLIENT}"]`)) return;

        const script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `${ADSENSE_SCRIPT_SRC}${ADSENSE_CLIENT}`;
        script.dataset.adsenseClient = ADSENSE_CLIENT;
        document.head.appendChild(script);
    }, [pathname, lastRouteId]);
}
