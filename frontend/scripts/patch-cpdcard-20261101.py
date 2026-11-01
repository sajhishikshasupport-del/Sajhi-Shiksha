#!/usr/bin/env python3
"""REQ-1031-03 (1 Nov 2026) - CPD app ka card Teachers' Corner par.

App live hai (https://www.sajhishiksha.in/cpd-certificate/) par kisi nav/card se
linked nahi tha, isliye teachers use dhoondh nahi paate the. Card ek seedha <a>
hai (React route nahi - page static HTML hai), site ke style me, yellow accent
se baaki cards se alag dikhta hai.

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


CARD = (
    "            {/* Tool: CPD certificate generator (static page, not a React route) */}@@"
    "            <Box@@"
    "                component=\"a\"@@"
    "                href=\"/cpd-certificate/\"@@"
    "                sx={{@@"
    "                    display: 'block',@@"
    "                    mt: 4,@@"
    "                    bgcolor: 'var(--color-yellow)',@@"
    "                    border: `3px solid ${BORDER}`,@@"
    "                    boxShadow: `5px 5px 0px ${SHADOW}`,@@"
    "                    p: { xs: 3, md: 4 },@@"
    "                    textDecoration: 'none',@@"
    "                    color: '#1A1A1A',@@"
    "                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',@@"
    "                    '&:hover': { transform: 'translate(-3px, -3px)', boxShadow: `8px 8px 0px ${SHADOW}` },@@"
    "                }}@@"
    "            >@@"
    "                <Typography sx={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: { xs: '1.2rem', md: '1.5rem' }, mb: 0.5 }}>@@"
    "                    CPD Certificate Generator@@"
    "                </Typography>@@"
    "                <Typography sx={{ fontSize: '0.95rem', color: 'rgba(26, 26, 26, 0.78)' }}>@@"
    "                    School ke staff ke CPD certificates ek hi PDF me - free tool@@"
    "                </Typography>@@"
    "                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mt: 1.5, fontFamily: FONT_MONO, fontSize: '0.85rem', fontWeight: 700 }}>@@"
    "                    Open tool <ArrowForwardIcon sx={{ fontSize: 18 }} />@@"
    "                </Box>@@"
    "            </Box>@@@@"
)

patch('frontend/src/routes/for-teachers.index.tsx', [
    (
        "            <PageIntro page=\"for-teachers\" />@@",
        CARD + "            <PageIntro page=\"for-teachers\" />@@",
        'teachers: CPD tool card',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
