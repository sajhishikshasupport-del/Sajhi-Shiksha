#!/usr/bin/env python3
"""One-shot fix (16 Oct 2026) - two bugs found while verifying the sitemap work.

BUG 1 - sitemap had bogus Hindi URLs.
  generate-route-meta.mjs -> buildCareerRoutes() lists every *.json in
  career-pages/, including the *.hi.json files, so it created routes like
  /career-counselling/arts-humanities-guide.hi (a 404). Fix: skip .hi.json.

BUG 2 - Hindi OG cards showed empty boxes for Latin text.
  The Devanagari font has no Latin glyphs, so any Latin in a Hindi title
  rendered as tofu. Fix: sanitise the Hindi card text - transliterate common
  course/exam abbreviations, drop remaining Latin letters, and drop any
  parenthetical left empty (the Latin gloss in a Hindi title).

Idempotent: re-running changes nothing.
Newlines inside the snippets below are written as @@.
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
        if new in t and old not in t:
            print('SKIP (already applied):', label)
            continue
        if old not in t:
            print('ERROR: pattern not found for', label, 'in', path)
            sys.exit(1)
        t = t.replace(old, new, 1)
        changes.append(label)
    if t != orig:
        open(path, 'w', encoding='utf-8').write(t)


# --- BUG 1: sitemap .hi routes -------------------------------------------
patch('frontend/scripts/generate-route-meta.mjs', [
    (
        "        if (!file.endsWith('.json')) continue;@@"
        "        const id = file.slice(0, -'.json'.length);@@"
        "        if (covered.has(id)) continue;@@",
        "        if (!file.endsWith('.json')) continue;@@"
        "        if (file.endsWith('.hi.json')) continue;@@"
        "        const id = file.slice(0, -'.json'.length);@@"
        "        if (covered.has(id)) continue;@@",
        'skip .hi.json in buildCareerRoutes',
    ),
])

# --- BUG 2: Hindi OG text sanitising -------------------------------------
GEN = 'frontend/scripts/generate-og-images.py'
HELPER = (
    "# --- Hindi card text ---------------------------------------------------@@"
    "# The Devanagari font has no Latin glyphs, so Latin in a Hindi card would@@"
    "# render as empty boxes. Transliterate the common course/exam@@"
    "# abbreviations, drop remaining Latin letters, then drop any parenthetical@@"
    "# left empty (the Latin gloss in a Hindi title).@@"
    "HI_LATIN = [@@"
    "    ('B.Tech', 'बी.टेक'),@@"
    "    ('B.Com', 'बी.कॉम'),@@"
    "    ('MBBS', 'एमबीबीएस'),@@"
    "    ('NIRF', 'एनआईआरएफ'),@@"
    "    ('BBA', 'बीबीए'),@@"
    "    ('PCB', 'पीसीबी'),@@"
    "    ('PCM', 'पीसीएम'),@@"
    "]@@"
    "@@"
    "@@"
    "def _drop_empty_parens(t):@@"
    "    out = []@@"
    "    i = 0@@"
    "    while i < len(t):@@"
    "        if t[i] == '(':@@"
    "            j = t.find(')', i)@@"
    "            if j != -1:@@"
    "                inner = t[i + 1:j]@@"
    "                keep = any('\u0900' <= ch <= '\u097f' or ch.isdigit() for ch in inner)@@"
    "                out.append(t[i:j + 1] if keep else ' ')@@"
    "                i = j + 1@@"
    "                continue@@"
    "        out.append(t[i])@@"
    "        i += 1@@"
    "    return ''.join(out)@@"
    "@@"
    "@@"
    "def hi_text(text):@@"
    "    t = text or ''@@"
    "    for k, v in HI_LATIN:@@"
    "        t = t.replace(k, v)@@"
    "    t = ''.join(ch for ch in t if not ('a' <= ch.lower() <= 'z'))@@"
    "    t = _drop_empty_parens(t)@@"
    "    while '  ' in t:@@"
    "        t = t.replace('  ', ' ')@@"
    "    return t.strip()@@"
    "@@"
    "@@"
    "def font(size, path=F_BOLD):"
)

t = open(GEN, encoding='utf-8').read()
if 'def hi_text(text):' in t:
    print('SKIP (already applied): add hi_text helper')
else:
    old_font = 'def font(size, path=F_BOLD):'
    if old_font not in t:
        print('ERROR: font() definition not found')
        sys.exit(1)
    t = t.replace(old_font, HELPER.replace('@@', NL), 1)
    open(GEN, 'w', encoding='utf-8').write(t)
    changes.append('add hi_text helper')

patch(GEN, [
    (
        "hi_page.get('title', title),",
        "hi_text(hi_page.get('title', title)),",
        'sanitise manifest-loop HI title',
    ),
    (
        "hi_page.get('title', pid),",
        "hi_text(hi_page.get('title', pid)),",
        'sanitise pages-dir HI title',
    ),
])

# the Hindi subtitle appears in both loops -> replace every occurrence
t = open(GEN, encoding='utf-8').read()
old_sub = "short(hi_page.get('intro_short', '')),"
new_sub = "short(hi_text(hi_page.get('intro_short', ''))),"
if new_sub in t and old_sub not in t:
    print('SKIP (already applied): sanitise HI subtitle')
elif old_sub in t:
    t = t.replace(old_sub, new_sub)
    open(GEN, 'w', encoding='utf-8').write(t)
    changes.append('sanitise HI subtitle')
else:
    print('ERROR: HI subtitle pattern not found')
    sys.exit(1)

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
