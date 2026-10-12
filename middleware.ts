/**
 * Vercel Routing Middleware (project root).
 *
 * Social link previews (WhatsApp, Facebook, Twitter) do not run JavaScript,
 * so query-param URLs such as /for-teachers/circular-formats?leaf=office-formats
 * would otherwise all show the section's preview (a query string has no file of
 * its own, so the build-time static shells in generate-route-meta.mjs cannot
 * cover them).
 *
 * This middleware reads the ?leaf= value, looks it up in the build-time
 * generated /og-meta.json, and injects the leaf's own title/description/image
 * into the SPA shell before it is sent.
 *
 * It also handles the Career Counselling section's Hindi mode (REQ-1012-16):
 * a GET to a career path with ?lang=hi gets the page's Hindi title/description
 * (from the same og-meta.json) plus the en / hi / x-default hreflang alternates.
 *
 * It is deliberately conservative:
 *   - only GET requests that carry a ?leaf= value or ?lang=hi on a career path
 *     are touched
 *   - if anything is missing or fails, it returns nothing (Vercel continues
 *     with the normal static response), so the site can never break because of it
 *   - it never changes the app itself; real users still get the SPA
 */

export const config = {
    // Page routes only (skip anything with a file extension: /assets/*.js, images, etc.)
    matcher: ['/((?!.*\\..*).*)'],
};

const META_URL = '/og-meta.json';
const SHELL_URL = '/index.html';
const DEFAULT_OG_IMAGE = '/images/og-image.png';

let metaCache: Record<string, { t: string; d: string; i?: string }> | null = null;

function escapeAttr(value: string): string {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function inject(html: string, title: string, description: string, url: string, image: string): string {
    const t = escapeAttr(title);
    const d = escapeAttr(description);
    const u = escapeAttr(url);
    const img = escapeAttr(image);
    return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${u}$2`)
        .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`)
        .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`);
}

/**
 * Add the en / hi / x-default hreflang alternates to the shell (REQ-1012-16).
 * `base` is the page URL without any query string.
 */
function injectAlternates(html: string, base: string): string {
    const e = escapeAttr(base);
    const tags = [
        `<link rel="alternate" hreflang="en" href="${e}" />`,
        `<link rel="alternate" hreflang="hi" href="${e}?lang=hi" />`,
        `<link rel="alternate" hreflang="x-default" href="${e}" />`,
    ].join('\n        ');
    if (!html.includes('</head>')) return html;
    return html.replace('</head>', `        ${tags}\n    </head>`);
}

/** Is this a Career Counselling path (the index or a sub-page)? */
function isCareerPath(pathname: string): boolean {
    return pathname === '/career-counselling' || pathname.startsWith('/career-counselling/');
}

export default async function middleware(request: Request): Promise<Response | undefined> {
    try {
        if (request.method !== 'GET') return undefined;

        const url = new URL(request.url);
        const leaf = url.searchParams.get('leaf');
        const lang = url.searchParams.get('lang');

        let key: string | null = null;
        let careerHindi = false;
        if (leaf) {
            key = `${url.pathname}?leaf=${leaf}`;
        } else if (lang === 'hi' && isCareerPath(url.pathname)) {
            key = `${url.pathname}?lang=hi`;
            careerHindi = true;
        }
        if (!key) return undefined;

        if (!metaCache) {
            const metaRes = await fetch(`${url.origin}${META_URL}`);
            metaCache = metaRes.ok ? await metaRes.json() : {};
        }

        const entry = metaCache ? metaCache[key] : undefined;
        if (!entry) return undefined;

        const shellRes = await fetch(`${url.origin}${SHELL_URL}`);
        if (!shellRes.ok) return undefined;

        const image = `${url.origin}${entry.i || DEFAULT_OG_IMAGE}`;
        const html = await shellRes.text();
        let out = inject(html, entry.t, entry.d, `${url.origin}${url.pathname}${url.search}`, image);
        if (careerHindi) {
            out = injectAlternates(out, `${url.origin}${url.pathname}`);
        }

        return new Response(out, {
            headers: { 'content-type': 'text/html; charset=utf-8' },
        });
    } catch {
        // Never break the site: fall back to the normal response.
        return undefined;
    }
}
