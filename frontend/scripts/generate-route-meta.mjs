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
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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

/** Render one preview page from the dist/index.html template. */
function renderPage(template, { url, title, description, ogImage, noindex }) {
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
    return html;
}

function write(target, html) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, html);
}

const template = readFileSync(distIndex, 'utf8');

let generated = 0;

/* 1. Named routes */
for (const route of ROUTES) {
    const html = renderPage(template, {
        url: `${SITE_URL}/${route.path}`,
        title: route.title,
        description: route.description,
        ogImage: route.ogImage,
        noindex: route.noindex,
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

/* 3. Section leaves that use a PATH segment (was ?leaf=) */
const SECTION_LEAVES = [
    { parent: 'for-teachers/primary-hm', cardId: 'primary-hm' },
];

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
    for (const sec of SECTION_LEAVES) {
        const main = (teachers.mainCards || []).find((m) => m.id === sec.cardId);
        if (!main) continue;
        for (const leaf of collectLeaves(main.subCards)) {
            const html = renderPage(template, {
                url: `${SITE_URL}/${sec.parent}/${leaf.id}`,
                title: `${leaf.title} — Sajhi Shiksha`,
                description: leaf.description || `${leaf.title} — KVS resources on Sajhi Shiksha.`,
                ogImage: DEFAULT_OG_IMAGE,
            });
            write(join(distDir, sec.parent, leaf.id, 'index.html'), html);
            generated += 1;
        }
    }
} catch {
    /* teachers.json missing — skip leaf pages */
}

console.log(`generate-route-meta: wrote ${generated} route preview pages (${seen.size} documents)`);
