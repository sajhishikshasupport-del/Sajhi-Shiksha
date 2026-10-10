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
 * generated /og-meta.json, and injects the leaf's own title/description into the
 * SPA shell before it is sent. It is deliberately conservative:
 *   - only GET requests that carry a ?leaf= value are touched
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

let metaCache: Record<string, { t: string; d: string }> | null = null;

function escapeAttr(value: string): string {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function inject(html: string, title: string, description: string, url: string): string {
    const t = escapeAttr(title);
    const d = escapeAttr(description);
    const u = escapeAttr(url);
    return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${u}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
        .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
        .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`);
}

export default async function middleware(request: Request): Promise<Response | undefined> {
    try {
        if (request.method !== 'GET') return undefined;

        const url = new URL(request.url);
        const leaf = url.searchParams.get('leaf');
        if (!leaf) return undefined;

        const key = `${url.pathname}?leaf=${leaf}`;

        if (!metaCache) {
            const metaRes = await fetch(`${url.origin}${META_URL}`);
            metaCache = metaRes.ok ? await metaRes.json() : {};
        }

        const entry = metaCache ? metaCache[key] : undefined;
        if (!entry) return undefined;

        const shellRes = await fetch(`${url.origin}${SHELL_URL}`);
        if (!shellRes.ok) return undefined;

        const html = await shellRes.text();
        const out = inject(html, entry.t, entry.d, `${url.origin}${url.pathname}${url.search}`);

        return new Response(out, {
            headers: { 'content-type': 'text/html; charset=utf-8' },
        });
    } catch {
        // Never break the site: fall back to the normal response.
        return undefined;
    }
}
