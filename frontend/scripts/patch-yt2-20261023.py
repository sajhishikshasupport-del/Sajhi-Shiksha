#!/usr/bin/env python3
"""Fix 5 (23 Oct 2026): send YouTube links to m.youtube.com.

Sir's test on his phone: https://m.youtube.com/@KapilPundir opens fine, but
www.youtube.com (which YouTube normally redirects to m.youtube.com) is NOT
reachable on his network - and the redirect does not fire in the in-app
browser. So YouTube links now point at the mobile host, which works on both
phone and desktop.

  1. ResourceCard: one normalised URL (externalUrl) used by the card click and
     by every external <a href>.
  2. ContentBlock (Maths Lovers): normalise to m.youtube.com instead of www.

Idempotent. Newlines inside snippets are written as @@.
"""
import sys

NL = chr(10)
changes = []

CARD = 'frontend/src/components/ResourceCard/ResourceCard.tsx'
BLOCK = 'frontend/src/features/mathLovers/components/ContentBlock.tsx'


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


patch(CARD, [
    (
        "        const openExternalLink = () => {@@"
        "            window.open(resource.driveUrl, '_blank', 'noopener,noreferrer');@@"
        "        };@@",
        "        // YouTube's www host is unreachable on some mobile networks and the@@"
        "        // automatic m.youtube.com redirect does not fire in in-app browsers,@@"
        "        // so YouTube links are pointed at the mobile host directly.@@"
        "        const externalUrl = (resource.driveUrl || '')@@"
        "            .replace('//youtube.com/', '//m.youtube.com/')@@"
        "            .replace('//www.youtube.com/', '//m.youtube.com/');@@@@"
        "        const openExternalLink = () => {@@"
        "            window.open(externalUrl, '_blank', 'noopener,noreferrer');@@"
        "        };@@",
        'card: normalised external url + click',
    ),
])

# every external button on the card should use the normalised URL
t = open(CARD, encoding='utf-8').read()
if 'href={resource.driveUrl}' in t:
    open(CARD, 'w', encoding='utf-8').write(t.replace('href={resource.driveUrl}', 'href={externalUrl}'))
    changes.append('card: all external hrefs -> externalUrl')
else:
    print('SKIP (already applied): card: all external hrefs -> externalUrl')

patch(BLOCK, [
    (
        "                    // Bare youtube.com fails on some mobile networks - use www.@@"
        "                    driveUrl: link.url.replace('//youtube.com/', '//www.youtube.com/'),@@",
        "                    // www.youtube.com is unreachable on some mobile networks - use the@@"
        "                    // mobile host, which works on both phone and desktop.@@"
        "                    driveUrl: link.url@@"
        "                        .replace('//youtube.com/', '//m.youtube.com/')@@"
        "                        .replace('//www.youtube.com/', '//m.youtube.com/'),@@",
        'contentblock: youtube -> m.youtube.com',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
