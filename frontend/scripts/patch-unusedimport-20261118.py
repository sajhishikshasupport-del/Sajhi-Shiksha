#!/usr/bin/env python3
"""BUILD FIX (18 Nov 2026) - CareerLanguageToggle me unused FONT_HEADING import.

1 Nov ki Hindi-toggle fix ne button ka fontFamily FONT_HEADING se badal ke
Devanagari stack kar diya, par import reh gaya. tsconfig me noUnusedLocals: true
hai, isliye `vite build` (tsc) fail hua aur 1 Nov se Vercel ke SAARE deploys
fail ho rahe the - website par koi code change live nahi hua.

Fix: import se FONT_HEADING hatao (FONT_MONO wahi rehta hai, wo use hota hai).

Idempotent.
"""
import sys

P = 'frontend/src/features/career/components/CareerLanguageToggle.tsx'
OLD = "import { FONT_HEADING, FONT_MONO } from '@/lib/constants';"
NEW = "import { FONT_MONO } from '@/lib/constants';"

t = open(P, encoding='utf-8').read()
if NEW in t and OLD not in t:
    print('SKIP (already applied)')
elif OLD in t:
    t = t.replace(OLD, NEW, 1)
    open(P, 'w', encoding='utf-8').write(t)
    print('patched: removed unused FONT_HEADING import')
else:
    print('ERROR: import line not found'); sys.exit(1)
print('OK')
