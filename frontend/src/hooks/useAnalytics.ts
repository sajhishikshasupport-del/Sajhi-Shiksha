import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
        dataLayer: unknown[];
    }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
const GA_SCRIPT_SRC = 'https://www.googletagmanager.com/gtag/js?id=';

export function useAnalytics(): void {
    const scriptRef = useRef<HTMLScriptElement | null>(null);

    /** 1. Inject the GA script once on mount.  */
    useEffect(() => {
        if (!GA_ID) return;
        if (scriptRef.current) return;

        const script = document.createElement('script');
        script.async = true;
        script.src = `${GA_SCRIPT_SRC}${GA_ID}`;
        document.head.appendChild(script);
        scriptRef.current = script;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag(): void {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date().toISOString());
        window.gtag('config', GA_ID, { send_page_view: false });

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            scriptRef.current = null;
        };
    }, []);

    /** 2. Track page-views when the path changes.  */
    useEffect(() => {
        if (!GA_ID || !window.gtag) return;

        window.gtag('config', GA_ID, {
            page_path: window.location.pathname + window.location.search,
        });
    }, [window.location.pathname, window.location.search]);
}
