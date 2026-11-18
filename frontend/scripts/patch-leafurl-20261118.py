#!/usr/bin/env python3
"""REQ-A5 fix 2 (18 Nov 2026) - leaf URL galat tha.

tgt-pgt page ki leaf view sirf tab khulti hai jab `selectedLeaf` ho
(`if (selectedLeaf && currentLeaf)`). Maine `?folder=lesson-plan` bheja tha,
isliye page landing par gir gaya. Leaf-level subCard ke liye URL `?leaf=<id>`
hona chahiye (wahi canonicalPath bhi hai). Jin subCards ke apne subCards hain
unke liye `?folder=<id>` hi sahi hai.

Idempotent.
"""
import sys

P = 'frontend/src/lib/resourceAggregator.ts'
OLD = (
    "            if (sc.id === id) return `/for-teachers/${mc.id}?folder=${sc.id}`;"
)
NEW = (
    "            if (sc.id === id) {\n"
    "                // Jin subCards ke apne subCards hain unke liye ?folder=, leaf-level ke liye ?leaf=\n"
    "                // (tgt-pgt page ki leaf view sirf selectedLeaf par khulti hai).\n"
    "                const hasKids = !!(sc as { hasSubCards?: boolean; subCards?: unknown[] }).hasSubCards &&\n"
    "                    ((sc as { subCards?: unknown[] }).subCards?.length ?? 0) > 0;\n"
    "                return hasKids\n"
    "                    ? `/for-teachers/${mc.id}?folder=${sc.id}`\n"
    "                    : `/for-teachers/${mc.id}?leaf=${sc.id}`;\n"
    "            }"
)

t = open(P, encoding='utf-8').read()
if 'hasKids' in t:
    print('SKIP (already applied)')
elif OLD in t:
    t = t.replace(OLD, NEW, 1)
    open(P, 'w', encoding='utf-8').write(t)
    print('patched: leaf-level subCards now use ?leaf=')
else:
    print('ERROR: line not found'); sys.exit(1)
print('OK')
