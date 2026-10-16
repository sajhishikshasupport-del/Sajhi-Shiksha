#!/usr/bin/env python3
"""One-shot SEO patch (16 Oct 2026) for frontend/scripts/generate-route-meta.mjs.

REQ-1013-02: add /for-students to the sitemap staticUrls.
REQ-1015-02: add <lastmod> to every sitemap <url> (documents use their real
             modifiedDate; sections/career routes use the build date).

Runs on the GitHub Actions runner so the 20KB generator file is never
transcribed by hand. Idempotent: re-running changes nothing.
Newlines inside the JS snippets below are written as @@ so this file stays
free of escape sequences.
"""
import sys

NL = chr(10)
P = 'frontend/scripts/generate-route-meta.mjs'
t = open(P, encoding='utf-8').read()
orig = t
changes = []


def rep(old, new, label):
    global t
    old = old.replace('@@', NL)
    new = new.replace('@@', NL)
    if new in t and old not in t:
        print('SKIP (already applied):', label)
        return
    if old not in t:
        print('ERROR: pattern not found for', label)
        sys.exit(1)
    t = t.replace(old, new, 1)
    changes.append(label)


# 1. build-date constant + /for-students entry
rep(
    "    const staticUrls = [@@        { loc: '/', cf: 'weekly', pr: '1.0' },@@",
    "    const today = new Date().toISOString().split('T')[0];@@"
    "    const staticUrls = [@@"
    "        { loc: '/for-students', cf: 'weekly', pr: '0.8' },@@"
    "        { loc: '/', cf: 'weekly', pr: '1.0' },@@",
    'staticUrls: today + /for-students',
)

# 2. lastmod on static urls
rep(
    "(s) => `  <url><loc>${SITE_URL}${s.loc}</loc><changefreq>${s.cf}</changefreq><priority>${s.pr}</priority></url>`,",
    "(s) => `  <url><loc>${SITE_URL}${s.loc}</loc><lastmod>${today}</lastmod><changefreq>${s.cf}</changefreq><priority>${s.pr}</priority></url>`,",
    'lastmod on static urls',
)

# 3. lastmod on career routes
rep(
    "sitemapUrls.push(`  <url><loc>${SITE_URL}/${route.path}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);",
    "sitemapUrls.push(`  <url><loc>${SITE_URL}/${route.path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);",
    'lastmod on career routes',
)

# 4. documents: keep their real modifiedDate
rep("    const docIds = new Set();@@", "    const docDates = new Map();@@", 'docIds -> docDates')
rep(
    "                if (doc && doc.id) docIds.add(doc.id);@@",
    "                if (doc && doc.id && !docDates.has(doc.id)) {@@"
    "                    const md = typeof doc.modifiedDate === 'string' ? doc.modifiedDate.slice(0, 10) : '';@@"
    "                    const ok = md.length === 10 && md[4] === '-' && md[7] === '-';@@"
    "                    docDates.set(doc.id, ok ? md : today);@@"
    "                }@@",
    'document dates captured',
)
rep(
    "    for (const id of docIds) {@@"
    "        sitemapUrls.push(`  <url><loc>${SITE_URL}/view/${id}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`);@@"
    "    }@@",
    "    for (const [id, lastmod] of docDates) {@@"
    "        sitemapUrls.push(`  <url><loc>${SITE_URL}/view/${id}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);@@"
    "    }@@",
    'lastmod on document urls',
)
rep("(${docIds.size} documents)", "(${docDates.size} documents)", 'log line docDates')

if t == orig:
    print('No change needed (already patched).')
else:
    open(P, 'w', encoding='utf-8').write(t)
    print('patched:', ', '.join(changes))

if 'docIds' in t:
    print('ERROR: docIds still referenced')
    sys.exit(1)
print('OK')
