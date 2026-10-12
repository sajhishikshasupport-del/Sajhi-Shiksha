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
 * Also generates a preview page for EVERY document (/view/<id>), so sharing a
 * document link shows that document's title + description instead of the
 * generic site preview. Document ids are the Drive file ids, which match the
 * keys in src/data/document-descriptions.json.
 *
 * Runs with plain Node (no dependencies). Fails the build loudly if the
 * expected tags are not found in dist/index.html, so a template change cannot
 * silently disable previews.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = 'https://www.sajhishiksha.in';
const DEFAULT_OG_IMAGE = '/images/og-image.png';

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
        ogImage: '/images/og-students.png',
    },
    {
        path: 'for-teachers',
        title: 'For Teachers — Teaching Resources — Sajhi Shiksha',
        description:
            'Teacher resources including TGT/PGT Maths materials, primary classes (1-5), circulars, formats, and KVS teaching resources.',
        ogImage: '/images/og-teachers.png',
    },
    {
        path: 'for-teachers/tgt-pgt',
        title: 'TGT/PGT Maths — Teaching Resources — Sajhi Shiksha',
        description:
            'TGT and PGT Mathematics teaching materials: question papers, question bank, holiday homework, lesson plans, PPTs and worksheets.',
        ogImage: '/images/og-tgt-pgt.png',
    },
    {
        path: 'for-teachers/circular-formats',
        title: 'Circulars & Formats — Sajhi Shiksha',
        description:
            'KVS circulars and office formats: GOI rules, KVS rules, admission, time table, CBSE/NIOS formats, morning assembly and more.',
        ogImage: '/images/og-circular.png',
    },
    {
        path: 'for-teachers/primary-hm',
        title: 'Primary Teachers & HM — Sajhi Shiksha',
        description:
            'Primary classes (1-5) teaching resources: lesson plans, worksheets, cycle tests, SRP, textbooks, split-ups, primary programmes, and Head Master materials.',
        ogImage: '/images/og-teachers.png',
    },
    {
        path: 'for-math-lovers',
        title: 'For Math Lovers — Explore the Beauty of Mathematics — Sajhi Shiksha',
        description:
            'Interesting math facts, puzzles, and blog posts about the beauty of mathematics.',
        ogImage: '/images/og-math-lovers.png',
    },
    {
        path: 'career-counselling',
        title: 'Career Counselling — Free Career Guidance for Students',
        description:
            'Free, research-backed career guidance for Indian students and parents — an interactive career explorer, stream selection, entrance exams, colleges, scholarships and more.',
        alternates: true,
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
    {
        path: 'search',
        title: 'Search — Sajhi Shiksha',
        description:
            'Search free study materials, question papers, and formats for students and teachers (Classes 1-12).',
        noindex: true,
    },
];

/** Data files whose documents get their own /view/<id> preview page. */
const CONTENT_FILES = [
    'teacher-contents.json',
    'teacher-contents-circular.json',
    'teacher-contents-primary.json',
    'math-lovers-contents.json',
];

const frontendDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(frontendDir, 'dist');
const distIndex = join(distDir, 'index.html');

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

/**
 * The en / hi / x-default hreflang alternates for a bilingual page
 * (REQ-1012-16). English is the default (no query); Hindi adds `?lang=hi`.
 */
function alternatesFor(url) {
    return [
        { hreflang: 'en', href: url },
        { hreflang: 'hi', href: `${url}?lang=hi` },
        { hreflang: 'x-default', href: url },
    ];
}

/** Insert `<link rel="alternate" hreflang="…">` tags just before </head>. */
function injectAlternates(html, alternates) {
    if (!alternates || alternates.length === 0) return html;
    if (!html.includes('</head>')) return html;
    const tags = alternates
        .map(
            (a) =>
                `<link rel="alternate" hreflang="${escapeAttr(a.hreflang)}" href="${escapeAttr(a.href)}" />`,
        )
        .join('\n        ');
    return html.replace('</head>', `        ${tags}\n    </head>`);
}

/** Render one preview page from the dist/index.html template. */
function renderPage(template, { url, title, description, ogImage, noindex, alternates }) {
    const titleAttr = escapeAttr(title);
    const descAttr = escapeAttr(String(description).slice(0, 200));
    const image = `${SITE_URL}${ogImage || DEFAULT_OG_IMAGE}`;

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
        /<meta property="og:image" content="[^"]*" \/>/,
        `<meta property="og:image" content="${image}" />`,
        'og:image',
    );
    html = replaceOnce(
        html,
        /<meta name="twitter:image" content="[^"]*" \/>/,
        `<meta name="twitter:image" content="${image}" />`,
        'twitter:image',
    );
    html = replaceOnce(
        html,
        /<title>[\s\S]*?<\/title>/,
        `<title>${titleAttr}</title>`,
        'title tag',
    );
    if (noindex) {
        html = replaceOnce(
            html,
            /<meta name="robots" content="[^"]*" \/>/,
            '<meta name="robots" content="noindex, follow" />',
            'robots tag',
        );
    }
    html = injectAlternates(html, alternates);
    return html;
}

function write(target, html) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, html);
}

const template = readFileSync(distIndex, 'utf8');

/**
 * Career Counselling sub-pages.
 *
 * Every `type=page` item in the manifest (plus every content file in
 * src/data/career-pages/) gets its own /career-counselling/<id> preview page,
 * mirroring the routes the app exposes. Title/description mirror useSEO:
 * `<page title> — Career Counselling — Sajhi Shiksha`.
 */
function buildCareerRoutes() {
    const routes = [];
    const pagesDir = join(frontendDir, 'src', 'data', 'career-pages');
    const readPage = (id) => {
        try {
            return JSON.parse(readFileSync(join(pagesDir, `${id}.json`), 'utf8'));
        } catch {
            return null;
        }
    };

    let manifest;
    try {
        manifest = JSON.parse(
            readFileSync(join(frontendDir, 'src', 'data', 'career-website-content.json'), 'utf8'),
        );
    } catch {
        return routes;
    }

    const sectionSubtitle = (manifest.section && manifest.section.subtitle) || 'Career Counselling';
    const covered = new Set();
    const pushRoute = (id, page, item) => {
        const title = (page && page.title) || (item && item.title) || id;
        const description =
            (page && page.intro_short) || (item && item.description) || sectionSubtitle;
        routes.push({
            path: `career-counselling/${id}`,
            title: `${title} — Career Counselling — Sajhi Shiksha`,
            description,
        });
        covered.add(id);
    };

    for (const item of manifest.items || []) {
        if (item.visible === false || item.type !== 'page') continue;
        pushRoute(item.id, readPage(item.id), item);
    }

    let files = [];
    try {
        files = readdirSync(pagesDir);
    } catch {
        files = [];
    }
    for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const id = file.slice(0, -'.json'.length);
        if (covered.has(id)) continue;
        pushRoute(id, readPage(id), null);
    }

    return routes;
}

const careerRoutes = buildCareerRoutes();

let generated = 0;

/* 1. Named routes */
for (const route of ROUTES) {
    const url = `${SITE_URL}/${route.path}`;
    const html = renderPage(template, {
        url,
        title: route.title,
        description: route.description,
        ogImage: route.ogImage,
        noindex: route.noindex,
        alternates: route.alternates ? alternatesFor(url) : undefined,
    });
    write(join(distDir, route.path, 'index.html'), html);
    generated += 1;
}

/* 1b. Career Counselling sub-pages -> /career-counselling/<id> preview pages */
for (const route of careerRoutes) {
    const url = `${SITE_URL}/${route.path}`;
    const html = renderPage(template, {
        url,
        title: route.title,
        description: route.description,
        alternates: alternatesFor(url),
    });
    write(join(distDir, route.path, 'index.html'), html);
    generated += 1;
}

/* 2. Every document -> /view/<id> preview page */
let descriptions = {};
try {
    descriptions = JSON.parse(
        readFileSync(join(frontendDir, 'src', 'data', 'document-descriptions.json'), 'utf8'),
    );
} catch {
    descriptions = {};
}

const seen = new Set();
for (const file of CONTENT_FILES) {
    let data;
    try {
        data = JSON.parse(readFileSync(join(frontendDir, 'src', 'data', file), 'utf8'));
    } catch {
        continue;
    }
    for (const key of Object.keys(data)) {
        if (key === '_comment') continue;
        const documents = (data[key] && data[key].documents) || [];
        for (const doc of documents) {
            if (!doc || !doc.id || seen.has(doc.id)) continue;
            seen.add(doc.id);
            const saved = descriptions[doc.id];
            const description =
                typeof saved === 'string' && saved.trim().length > 0
                    ? saved
                    : `View and download ${doc.title} — free study material on Sajhi Shiksha.`;
            const html = renderPage(template, {
                url: `${SITE_URL}/view/${doc.id}`,
                title: `${doc.title} — Sajhi Shiksha`,
                description,
                ogImage: DEFAULT_OG_IMAGE,
            });
            write(join(distDir, 'view', doc.id, 'index.html'), html);
            generated += 1;
        }
    }
}

/* 3. Leaf metadata for query-param URLs (?leaf=) -> og-meta.json for middleware */
const LEAF_SECTIONS = [
    { parent: 'for-teachers/tgt-pgt', cardId: 'tgt-pgt' },
    { parent: 'for-teachers/circular-formats', cardId: 'circular-formats' },
    { parent: 'for-teachers/primary-hm', cardId: 'primary-hm' },
];

try {
    const ogMeta = {};

    /* 3a. Leaf metadata (?leaf=) */
    try {
        const teachers = JSON.parse(readFileSync(join(frontendDir, 'src', 'data', 'teachers.json'), 'utf8'));
        const collectLeaves = (cards) => {
            const out = [];
            for (const c of cards || []) {
                if (c.subCards && c.subCards.length) out.push(...collectLeaves(c.subCards));
                else out.push(c);
            }
            return out;
        };
        for (const sec of LEAF_SECTIONS) {
            const main = (teachers.mainCards || []).find((m) => m.id === sec.cardId);
            if (!main) continue;
            for (const leaf of collectLeaves(main.subCards)) {
                ogMeta[`/${sec.parent}?leaf=${leaf.id}`] = {
                    t: `${leaf.title} — Sajhi Shiksha`,
                    d: (leaf.description || `${leaf.title} — KVS resources on Sajhi Shiksha.`).slice(0, 200),
                    i: `/images/og/leaves/${sec.cardId}__${leaf.id}.png`,
                };
            }
        }
    } catch (e) {
        console.error('generate-route-meta: leaf og-meta step failed:', e.message);
    }

    /* 3b. Career Counselling Hindi metadata (?lang=hi).
     * Query-param URLs have no file of their own, so the middleware reads this
     * map to inject the Hindi title/description + hreflang alternates
     * (REQ-1012-16). English pages get their own static shells instead. */
    try {
        const pagesDir = join(frontendDir, 'src', 'data', 'career-pages');
        let i18nHi = null;
        try {
            const i18n = JSON.parse(
                readFileSync(join(frontendDir, 'src', 'data', 'career-i18n.json'), 'utf8'),
            );
            i18nHi = i18n.hi || null;
        } catch {
            i18nHi = null;
        }
        const sectionName = (i18nHi && i18nHi.sectionName) || 'करियर काउंसलिंग';
        if (i18nHi && i18nHi.indexTitle) {
            ogMeta['/career-counselling?lang=hi'] = {
                t: `${i18nHi.indexTitle} — Sajhi Shiksha`,
                d: String(i18nHi.indexDescription || '').slice(0, 200),
            };
        }
        for (const route of careerRoutes) {
            const id = route.path.replace(/^career-counselling\//, '');
            let hi = null;
            try {
                hi = JSON.parse(readFileSync(join(pagesDir, `${id}.hi.json`), 'utf8'));
            } catch {
                hi = null;
            }
            if (!hi || !hi.title) continue;
            ogMeta[`/${route.path}?lang=hi`] = {
                t: `${hi.title} — ${sectionName} — Sajhi Shiksha`,
                d: String(hi.intro_short || route.description || '').slice(0, 200),
            };
        }
    } catch (e) {
        console.error('generate-route-meta: career Hindi og-meta step failed:', e.message);
    }

    writeFileSync(join(distDir, 'og-meta.json'), JSON.stringify(ogMeta));
    console.log(`generate-route-meta: wrote og-meta.json with ${Object.keys(ogMeta).length} entries`);
} catch (e) {
    console.error('generate-route-meta: og-meta.json step failed:', e.message);
}

/* 4. sitemap.xml -> dist/sitemap.xml (all indexable pages: sections + every document) */
try {
    const staticUrls = [
        { loc: '/', cf: 'weekly', pr: '1.0' },
        { loc: '/for-teachers', cf: 'weekly', pr: '0.9' },
        { loc: '/for-teachers/tgt-pgt', cf: 'weekly', pr: '0.8' },
        { loc: '/for-teachers/circular-formats', cf: 'weekly', pr: '0.8' },
        { loc: '/for-teachers/primary-hm', cf: 'weekly', pr: '0.8' },
        { loc: '/for-math-lovers', cf: 'weekly', pr: '0.8' },
        { loc: '/career-counselling', cf: 'weekly', pr: '0.8' },
        { loc: '/contribute', cf: 'monthly', pr: '0.5' },
        { loc: '/about', cf: 'monthly', pr: '0.5' },
        { loc: '/privacy-policy', cf: 'yearly', pr: '0.3' },
        { loc: '/terms', cf: 'yearly', pr: '0.3' },
    ];
    const sitemapUrls = staticUrls.map(
        (s) => `  <url><loc>${SITE_URL}${s.loc}</loc><changefreq>${s.cf}</changefreq><priority>${s.pr}</priority></url>`,
    );
    for (const route of careerRoutes) {
        sitemapUrls.push(`  <url><loc>${SITE_URL}/${route.path}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
    }
    const docIds = new Set();
    for (const file of CONTENT_FILES) {
        let data;
        try {
            data = JSON.parse(readFileSync(join(frontendDir, 'src', 'data', file), 'utf8'));
        } catch {
            continue;
        }
        for (const key of Object.keys(data)) {
            if (key === '_comment') continue;
            for (const doc of (data[key] && data[key].documents) || []) {
                if (doc && doc.id) docIds.add(doc.id);
            }
        }
    }
    for (const id of docIds) {
        sitemapUrls.push(`  <url><loc>${SITE_URL}/view/${id}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
    }
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`;
    writeFileSync(join(distDir, 'sitemap.xml'), xml);
    console.log(`generate-route-meta: wrote sitemap.xml with ${sitemapUrls.length} urls (${docIds.size} documents)`);
} catch (e) {
    console.error('generate-route-meta: sitemap step failed:', e.message);
}

console.log(`generate-route-meta: wrote ${generated} route preview pages (${seen.size} documents)`);
