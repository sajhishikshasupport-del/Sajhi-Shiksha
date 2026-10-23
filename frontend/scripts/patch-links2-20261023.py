#!/usr/bin/env python3
"""Fix 3 (23 Oct 2026): the GRID view of ResourceCard still used window.open()
for the YouTube / website buttons - the first fix only caught the LIST view.
The Maths Lovers page renders cards in grid mode, so its YouTube buttons did
nothing on mobile (popups are blocked).

Both grid buttons now render as real <a target="_blank"> links.

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


CARD = 'frontend/src/components/ResourceCard/ResourceCard.tsx'

OLD_BTN = (
    "                        <Button@@"
    "                            size=\"small\"@@"
    "                            variant=\"contained\"@@"
    "                            startIcon={<OpenInNewIcon />}@@"
    "                            onClick={(e) => {@@"
    "                                e.stopPropagation();@@"
    "                                openExternalLink();@@"
    "                            }}@@"
)
NEW_BTN = (
    "                        <Button@@"
    "                            size=\"small\"@@"
    "                            variant=\"contained\"@@"
    "                            component=\"a\"@@"
    "                            href={resource.driveUrl}@@"
    "                            target=\"_blank\"@@"
    "                            rel=\"noopener noreferrer\"@@"
    "                            startIcon={<OpenInNewIcon />}@@"
    "                            onClick={(e) => {@@"
    "                                e.stopPropagation();@@"
    "                            }}@@"
)

patch(CARD, [
    (
        "                    {isYoutube ? (@@" + OLD_BTN,
        "                    {isYoutube ? (@@" + NEW_BTN,
        'card grid: youtube button -> real link',
    ),
    (
        "                    ) : isWebsite ? (@@" + OLD_BTN,
        "                    ) : isWebsite ? (@@" + NEW_BTN,
        'card grid: website button -> real link',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
