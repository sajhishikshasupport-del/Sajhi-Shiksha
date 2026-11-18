#!/usr/bin/env python3
"""REQ-A5 follow-up (18 Nov 2026) - redirect actually fire kare.

Pehla attempt <Navigate to="/for-teachers/tgt-pgt?folder=lesson-plan" /> use karta
tha. TanStack Router ka `to` ek ROUTE leta hai, query-string wala URL nahi, isliye
redirect fire nahi hua (page waisa hi dikha raha tha).

Fix: useEffect ke andar window.location.replace() - exact URL, koi router
parsing ka jhanjhat nahi. <Navigate> import hata diya (noUnusedLocals build todta).

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


VIEW = 'frontend/src/routes/view.$id.tsx'

patch(VIEW, [
    # drop the Navigate import (not used any more; noUnusedLocals would fail the build)
    (
        "import { createRoute, useNavigate, useParams, Navigate } from '@tanstack/react-router';@@",
        "import { createRoute, useNavigate, useParams } from '@tanstack/react-router';@@",
        'view: drop Navigate import',
    ),
    # useEffect import
    (
        "import { Suspense, lazy, useMemo } from 'react';@@",
        "import { Suspense, lazy, useEffect, useMemo } from 'react';@@",
        'view: import useEffect',
    ),
    # replace the render-time redirect with an effect that does a hard replace
    (
        "    // Saare hooks ke BAAD redirect - hook order same rahe.@@"
        "    if (leafRoute) {@@"
        "        return <Navigate to={leafRoute} replace />;@@"
        "    }@@@@",
        "    // Leaf/subCard id par aaye to uske asli section page par bhej do (REQ-A5).@@"
        "    // window.location.replace: exact URL, router ko query-string parse nahi karni padti.@@"
        "    useEffect(() => {@@"
        "        if (leafRoute) window.location.replace(leafRoute);@@"
        "    }, [leafRoute]);@@@@",
        'view: location.replace redirect',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
