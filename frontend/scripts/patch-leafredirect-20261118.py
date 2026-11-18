#!/usr/bin/env python3
"""REQ-A5 (18 Nov 2026) - /view/<leaf-id> ko us leaf ke asli page par bhejo.

Problem: leaf/subCard ids bhi resource ki tarah resolve hote hain, isliye
/view/lesson-plan ek document jaisa page dikhata hai (Download nahi, sirf
"Open in New Tab") - jabki teacher wahan lesson plans ki LIST chahta hai.
GA4: /view/lesson-plan par 747 landings, engagement sirf 42%.

Fix: resourceAggregator me getLeafRouteForId() - teachers.json ke mainCards/
subCards me id dhoondh ke us leaf ka asli route lauta do. view.$id.tsx us route
par <Navigate replace> kar dega. Purane share kiye link kaam karte rahenge.

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


AGG = 'frontend/src/lib/resourceAggregator.ts'
VIEW = 'frontend/src/routes/view.$id.tsx'

HELPER = (
    "// REQ-A5: leaf/subCard ids bhi resource ki tarah resolve hote hain. Un ids ke liye@@"
    "// asli section page lauta do, taaki /view/<leaf-id> document jaisa na dikhe.@@"
    "export function getLeafRouteForId(id: string): string | null {@@"
    "    for (const mc of teachersData.mainCards) {@@"
    "        for (const sc of mc.subCards ?? []) {@@"
    "            if (sc.id === id) return `/for-teachers/${mc.id}?folder=${sc.id}`;@@"
    "            for (const leaf of sc.subCards ?? []) {@@"
    "                if (leaf.id === id) return `/for-teachers/${mc.id}?folder=${sc.id}&leaf=${leaf.id}`;@@"
    "            }@@"
    "        }@@"
    "    }@@"
    "    return null;@@"
    "}@@@@"
)

# 1) add the helper right after getTeacherLeafTitle()
patch(AGG, [
    (
        "function getTeacherLeafTitle(leafId: string): string {",
        HELPER + "function getTeacherLeafTitle(leafId: string): string {",
        'aggregator: getLeafRouteForId helper',
    ),
])

# 2) redirect in the view route
patch(VIEW, [
    (
        "import { createRoute, useNavigate, useParams } from '@tanstack/react-router';@@",
        "import { createRoute, useNavigate, useParams, Navigate } from '@tanstack/react-router';@@",
        'view: import Navigate',
    ),
    (
        "import { getResourceById } from '@/lib/resourceAggregator';@@",
        "import { getResourceById, getLeafRouteForId } from '@/lib/resourceAggregator';@@",
        'view: import helper',
    ),
    (
        "    const resource = useMemo(() => getResourceById(id), [id]);@@",
        "    const resource = useMemo(() => getResourceById(id), [id]);@@"
        "    // Leaf/subCard id par aaye to uske asli section page par bhej do (REQ-A5).@@"
        "    const leafRoute = useMemo(() => getLeafRouteForId(id), [id]);@@",
        'view: compute leaf route',
    ),
    (
        "    const handleBack = (): void => {@@",
        "    // Saare hooks ke BAAD redirect - hook order same rahe.@@"
        "    if (leafRoute) {@@"
        "        return <Navigate to={leafRoute} replace />;@@"
        "    }@@@@"
        "    const handleBack = (): void => {@@",
        'view: redirect (after hooks)',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
