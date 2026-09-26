/**
 * generate-route-meta.mjs
 *
 * Social link previews (WhatsApp, Facebook, Twitter) do not run JavaScript,
 * so every URL of this SPA would otherwise show the same static og: tags from
 * index.html. This script runs AFTER `vite build` and writes a copy of
 * dist/index.html for each known route with route-specific
 * <title>, description, canonical, og:* and twitter:* tags.
 *
 * Vercel serves the filesystem before applying the SPA rewrite in vercel.json,
 * so a request to /for-teachers picks up dist/for-teachers/index.html with the
 * correct preview tags, while the React app still boots from it (it references
 * the same hashed /assets/* bundles with absolute paths).
 *
 * Runs with plain Node (no dependencies). Fails the build loudly if the
 * expected tags are not found in dist/index.html, so a template change cannot
 * silently disable previews.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://www.sajhishiksha.in';

/**
 * Route-specific metadata. Titles mirror what the app's useSEO hook renders
 * in the browser tab so previews match what users see.
 */
const ROUTES = [
    {
        path: 'for-students',
        title: 'For Students — Mathematics Resources — Sajhi Shiksha',
        description:
            'Mathematics study materials for Classes 6 to 12. Free question papers, notes, and resources for KVS students.',
    },
    {
        path: 'for-teachers',
        title: 'For Teachers — Teaching Resources — Sajhi Shiksha',
        description:
            'Teacher resources including TGT/PGT Maths materials, circulars, formats, and KVS teaching resources.',
    },
    {
        path: 'for-teachers/tgt-pgt',
        title: 'TGT/PGT Maths — Teaching Resources — Sajhi Shiksha',
        description:
            'TGT and PGT Mathematics teaching materials: question papers, question bank, holiday homework, lesson plans, PPTs and worksheets.',
    },
    {
        path: 'for-teachers/circular-formats',
        title: 'Circulars & Formats — Sajhi Shiksha',
        description:
            'KVS circulars and office formats: GOI rules, KVS rules, admission, time table, CBSE/NIOS formats, morning assembly and more.',
    },
    {
        path: 'for-math-lovers',
        title: 'For Math Lovers — Explore the Beauty of Mathematics — Sajhi Shiksha',
        description:
            'Interesting math facts, puzzles, and blog posts about the beauty of mathematics.',
    },
    {
        path: 'contribute',
        title: 'Contribute — Sajhi Shiksha',
        description:
            'Share your knowledge with fellow teachers. Contribute study materials, question papers, and resources to help KVS students.',
    },
    {
        path: 'about',
        title: 'About Us — Sajhi Shiksha',
        description:
            'Learn about Sajhi Shiksha mission to provide free educational resources for KVS students and teachers. Meet our team.',
    },
    {
        path: 'developers',
        title: 'Developers — Sajhi Shiksha',
        description:
            'Meet the developers behind Sajhi Shiksha — the team that built this free educational platform for KVS students and teachers.',
    },
    {
        path: 'privacy-policy',
        title: 'Privacy Policy — Sajhi Shiksha',
        description:
            'Privacy Policy for Sajhi Shiksha. Learn how we handle your data, cookies, and third-party advertising including Google AdSense.',
    },
    {
        path: 'terms',
        title: 'Terms & Conditions — Sajhi Shiksha',
        description:
            'Terms and Conditions for using Sajhi Shiksha. Read our usage guidelines, content policies, and disclaimers.',
    },
];

const frontendDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distIndex = join(frontendDir, 'dist', 'index.html');

function escapeAttr(value) {
    return String(value)
        .replace(/&/g, '&' + 'amp;')
        .replace(/</g, '&' + 'lt;')
        .replace(/>/g, '&' + 'gt;')
        .replace(/"/g, '&' + 'quot;');
}

function replaceOnce(html, pattern, replacement, label) {
    if (!pattern.test(html)) {
        throw new Error(`generate-route-meta: could not find ${label} in dist/index.html`);
    }
    return html.replace(pattern, replacement);
}

const template = readFileSync(distIndex, 'utf8');

let generated = 0;
for (const route of ROUTES) {
    const url = `${SITE_URL}/${route.path}`;
    const titleAttr = escapeAttr(route.title);
    const descAttr = escapeAttr(route.description);

    let html = template;

    html = replaceOnce(
        html,
        /<meta name="description" content="[^"]*" \/>/,
        `<meta name="description" content="${descAttr}" />`,
        'meta description',
    );
    html = replaceOnce(
        html,
        /<link rel="canonical" href="[^"]*" \/>/,
        `<link rel="canonical" href="${url}" />`,
        'canonical link',
    );
    html = replaceOnce(
        html,
        /<meta property="og:url" content="[^"]*" \/>/,
        `<meta property="og:url" content="${url}" />`,
        'og:url',
    );
    html = replaceOnce(
        html,
        /<meta property="og:title" content="[^"]*" \/>/,
        `<meta property="og:title" content="${titleAttr}" />`,
        'og:title',
    );
    html = replaceOnce(
        html,
        /<meta property="og:description" content="[^"]*" \/>/,
        `<meta property="og:description" content="${descAttr}" />`,
        'og:description',
    );
    html = replaceOnce(
        html,
        /<meta name="twitter:title" content="[^"]*" \/>/,
        `<meta name="twitter:title" content="${titleAttr}" />`,
        'twitter:title',
    );
    html = replaceOnce(
        html,
        /<meta name="twitter:description" content="[^"]*" \/>/,
        `<meta name="twitter:description" content="${descAttr}" />`,
        'twitter:description',
    );
    html = replaceOnce(
        html,
        /<title>[\s\S]*?<\/title>/,
        `<title>${titleAttr}</title>`,
        'title tag',
    );

    const target = join(frontendDir, 'dist', route.path, 'index.html');
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, html);
    generated += 1;
}

console.log(`generate-route-meta: wrote ${generated} route preview pages`);
