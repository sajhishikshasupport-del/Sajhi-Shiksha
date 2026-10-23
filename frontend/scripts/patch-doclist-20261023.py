#!/usr/bin/env python3
"""Fix (23 Oct 2026): document-list clicks must open OUR /view/<id> page, not Drive.

Sir's report: clicking a document anywhere opened Google Drive directly, so the
900+ /view/<id> pages we submitted for indexing were never used - no visitor
ever saw them and Google had no reason to crawl them.

Cause: TeacherShared.tsx -> DocCard -> openDoc() called
window.open(doc.link) (the raw Drive URL).

Now: if the document has a resource (i.e. our /view/ page exists) we navigate to
/view/<id>; the page shows the title, description, preview and the Drive
download/open buttons. Only if no resource exists do we fall back to opening
Drive directly, so nothing breaks.

Idempotent. Newlines inside snippets are written as @@.
"""
import sys

NL = chr(10)
changes = []


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


P = 'frontend/src/features/teachers/components/TeacherShared.tsx'

patch(P, [
    (
        "import React from 'react';@@",
        "import React from 'react';@@"
        "import { useNavigate } from '@tanstack/react-router';@@",
        'import useNavigate',
    ),
    (
        "import { teacherCardToResource } from '@/lib/utils';@@",
        "import { teacherCardToResource } from '@/lib/utils';@@"
        "import { getResourceById } from '@/lib/resourceAggregator';@@",
        'import getResourceById',
    ),
    (
        "const DocCard: React.FC<{ doc: DriveDocument; showClass?: boolean }> = ({ doc, showClass }) => {@@"
        "    const classLabel = showClass ? effectiveClassName(doc) : null;@@",
        "const DocCard: React.FC<{ doc: DriveDocument; showClass?: boolean }> = ({ doc, showClass }) => {@@"
        "    const navigate = useNavigate();@@"
        "    const classLabel = showClass ? effectiveClassName(doc) : null;@@",
        'DocCard: useNavigate',
    ),
    (
        "        window.open(doc.link, '_blank', 'noopener,noreferrer');@@"
        "    };@@",
        "        // Open our own /view/<id> page (it shows the description, a preview and@@"
        "        // the Drive buttons). Fall back to Drive only if no page exists, so a@@"
        "        // document never becomes unreachable.@@"
        "        if (getResourceById(doc.id)) {@@"
        "            navigate({ to: '/view/$id', params: { id: doc.id } });@@"
        "        } else {@@"
        "            window.open(doc.link, '_blank', 'noopener,noreferrer');@@"
        "        }@@"
        "    };@@",
        'DocCard: open our /view page',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
