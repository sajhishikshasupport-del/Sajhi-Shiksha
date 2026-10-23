#!/usr/bin/env python3
"""Step 1 of the Core Web Vitals work (23 Oct 2026) - Sir approved.

Problem: the main JavaScript bundle is ~878 KB, and ~246 KB of that is two
lookup tables that are only needed AFTER the page has painted:
  * document-descriptions.json (214 KB)
  * page-intros.json (32 KB)
Because they are `import`ed, Vite bakes them into the bundle, so a phone must
download and parse all of it before anything renders -> LCP > 2.5s, INP > 200ms.

What this does:
  1. Copies both files to frontend/public/data/ so they are served as static
     files. The originals stay in src/data/ because the build scripts
     (generate-route-meta.mjs) read them from there.
  2. Adds lib/runtimeData.ts - a tiny cached fetch + hook.
  3. Swaps the imports for the hook in the four files that used them.
     The aggregator no longer composes the long description (it only had the
     table for that); the /view/ page and its SEO meta now pull it from the
     runtime table instead, so nothing is lost once the data arrives.

Idempotent. Newlines inside snippets are written as @@.
"""
import os
import shutil
import sys

NL = chr(10)
changes = []
SRC = 'frontend/src/data'
PUB = 'frontend/public/data'


def move(name):
    os.makedirs(PUB, exist_ok=True)
    src = os.path.join(SRC, name)
    dst = os.path.join(PUB, name)
    if not os.path.exists(src):
        print('ERROR: missing', src)
        sys.exit(1)
    if os.path.exists(dst) and os.path.getsize(dst) == os.path.getsize(src):
        print('SKIP (already copied):', name)
        return
    shutil.copyfile(src, dst)
    changes.append('copied to public/data: ' + name)


def patch(path, pairs):
    t = open(path, encoding='utf-8').read()
    orig = t
    for old, new, label in pairs:
        old = old.replace('@@', NL)
        new = new.replace('@@', NL)
        if new in t:
            print('SKIP (already applied):', label)
            continue
        if old not in t:
            print('ERROR: pattern not found for', label, 'in', path)
            sys.exit(1)
        t = t.replace(old, new, 1)
        changes.append(label)
    if t != orig:
        open(path, 'w', encoding='utf-8').write(t)


move('document-descriptions.json')
move('page-intros.json')

# ---------- PageIntro ----------
patch('frontend/src/components/PageIntro.tsx', [
    (
        "import pageIntros from '@/data/page-intros.json';@@",
        "import { useJsonData } from '@/lib/runtimeData';@@",
        'PageIntro: import',
    ),
    (
        "    const intro = (pageIntros as unknown as Record<string, { short: string; full: string } | undefined>)[page];@@",
        "    const pageIntros = useJsonData<Record<string, { short: string; full: string } | undefined>>(@@"
        "        '/data/page-intros.json',@@"
        "        {}@@"
        "    );@@"
        "    const intro = pageIntros[page];@@",
        'PageIntro: runtime data',
    ),
])

# ---------- TeacherShared (DocCard) ----------
patch('frontend/src/features/teachers/components/TeacherShared.tsx', [
    (
        "import documentDescriptions from '@/data/document-descriptions.json';@@",
        "import { useJsonData } from '@/lib/runtimeData';@@",
        'TeacherShared: import',
    ),
    (
        "    const description = doc.description || (documentDescriptions as Record<string, string>)[doc.id];@@",
        "    const documentDescriptions = useJsonData<Record<string, string>>(@@"
        "        '/data/document-descriptions.json',@@"
        "        {}@@"
        "    );@@"
        "    const description = doc.description || documentDescriptions[doc.id];@@",
        'TeacherShared: runtime data',
    ),
])

# ---------- resourceAggregator ----------
patch('frontend/src/lib/resourceAggregator.ts', [
    (
        "import documentDescriptions from '@/data/document-descriptions.json';@@",
        "// Document descriptions are large, so they are fetched at runtime@@"
        "// (see lib/runtimeData.ts) instead of being bundled here.@@",
        'resourceAggregator: import',
    ),
    (
        "                description: [(documentDescriptions as Record<string, string>)[docId] || (typeof doc.description === 'string' ? doc.description : ''), leafTitle, className].filter(Boolean).join(' \\u2014 ') || 'Teacher-shared document',@@",
        "                description: [typeof doc.description === 'string' ? doc.description : '', leafTitle, className].filter(Boolean).join(' \\u2014 ') || 'Teacher-shared document',@@",
        'resourceAggregator: drop bundled table',
    ),
])

# ---------- ResourceViewPage ----------
patch('frontend/src/features/viewer/components/ResourceViewPage.tsx', [
    (
        "import { trackEvent } from '@/hooks/useAnalytics';@@",
        "import { trackEvent } from '@/hooks/useAnalytics';@@"
        "import { useJsonData } from '@/lib/runtimeData';@@",
        'ResourceViewPage: import',
    ),
    (
        "    const borderColor = 'var(--color-border)';@@"
        "    const shadowColor = 'var(--color-shadow)';@@",
        "    const borderColor = 'var(--color-border)';@@"
        "    const shadowColor = 'var(--color-shadow)';@@"
        "    // Fetched at runtime (kept out of the bundle) - must run before any@@"
        "    // early return so the hook order stays stable.@@"
        "    const documentDescriptions = useJsonData<Record<string, string>>(@@"
        "        '/data/document-descriptions.json',@@"
        "        {}@@"
        "    );@@"
        "    const richDescription = resource@@"
        "        ? documentDescriptions[resource.id] || resource.description@@"
        "        : '';@@",
        'ResourceViewPage: runtime description',
    ),
    (
        "                    {resource.description}@@",
        "                    {richDescription}@@",
        'ResourceViewPage: render rich description',
    ),
])

# ---------- view route (SEO meta) ----------
patch('frontend/src/routes/view.$id.tsx', [
    (
        "import { getResourceById } from '@/lib/resourceAggregator';@@",
        "import { getResourceById } from '@/lib/resourceAggregator';@@"
        "import { useJsonData } from '@/lib/runtimeData';@@",
        'view route: import',
    ),
    (
        "    const resource = useMemo(() => getResourceById(id), [id]);@@",
        "    const resource = useMemo(() => getResourceById(id), [id]);@@"
        "    const documentDescriptions = useJsonData<Record<string, string>>(@@"
        "        '/data/document-descriptions.json',@@"
        "        {}@@"
        "    );@@",
        'view route: runtime descriptions',
    ),
    (
        "        description: resource ? `View and download ${resource.title}. ${resource.description}` : 'The requested resource could not be found.',@@",
        "        description: resource@@"
        "            ? `View and download ${resource.title}. ${documentDescriptions[resource.id] || resource.description}`@@"
        "            : 'The requested resource could not be found.',@@",
        'view route: meta description',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
