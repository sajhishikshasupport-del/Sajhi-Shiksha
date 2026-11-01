#!/usr/bin/env python3
"""REQ-1031-02 (1 Nov 2026) - two viewer-facing bugs.

(a) Cookie banner covered the content (homepage hero search, tgt-pgt cards,
    calendar entry). It is position:fixed with zIndex 9999, and the page had no
    bottom room for it. Fix: make it compact and reserve space at the bottom of
    the page while it is visible.

(b) The career language toggle showed "LANGUAGE [English] [ ]" - the Hindi
    option rendered blank because the button used FONT_HEADING (Space Grotesk),
    which has no Devanagari glyphs, and the fallback chain was just
    "sans-serif". Fix: put Devanagari-capable families in the stack after
    Space Grotesk (Latin still renders in Space Grotesk).

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


CC = 'frontend/src/components/CookieConsent/CookieConsent.tsx'
LT = 'frontend/src/features/career/components/CareerLanguageToggle.tsx'

# ---------- (a) cookie banner ----------
patch(CC, [
    (
        "                p: { xs: 3, md: 4 },@@",
        "                p: { xs: 2, md: 3 },@@",
        'cookie: tighter padding',
    ),
    (
        "                    fontSize: '0.9rem',@@"
        "                    color: 'var(--color-text-secondary)',@@"
        "                    mb: 3,@@",
        "                    fontSize: '0.85rem',@@"
        "                    color: 'var(--color-text-secondary)',@@"
        "                    mb: 2,@@",
        'cookie: smaller text',
    ),
    (
        "    const handleAccept = () => {@@",
        "    // Keep the page content clear of the fixed banner while it is showing.@@"
        "    useEffect(() => {@@"
        "        if (!visible) return;@@"
        "        const prev = document.body.style.paddingBottom;@@"
        "        document.body.style.paddingBottom = '180px';@@"
        "        return () => {@@"
        "            document.body.style.paddingBottom = prev;@@"
        "        };@@"
        "    }, [visible]);@@@@"
        "    const handleAccept = () => {@@",
        'cookie: reserve page space',
    ),
])

# ---------- (b) language toggle Devanagari ----------
patch(LT, [
    (
        "                            cursor: 'pointer',@@"
        "                            fontFamily: FONT_HEADING,@@",
        "                            cursor: 'pointer',@@"
        "                            fontFamily:@@"
        "                                \"'Space Grotesk', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif\",@@",
        'toggle: devanagari fallback',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
