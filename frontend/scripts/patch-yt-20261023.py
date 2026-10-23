#!/usr/bin/env python3
"""Fix 4 (23 Oct 2026): normalise YouTube links to www.youtube.com.

Sir's report: on the phone the Maths Lovers YouTube cards opened a browser page
saying "site can't be reached", while the same link worked inside the YouTube
app. The stored URL (https://youtube.com/@kapilpundir) is valid and redirects
to www.youtube.com, but some mobile networks/browsers fail on the bare
youtube.com host, so we normalise it before rendering.

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


patch('frontend/src/features/mathLovers/components/ContentBlock.tsx', [
    (
        "                    driveUrl: link.url,@@"
        "                    urlType: getUrlType(link.url),@@",
        "                    // Bare youtube.com fails on some mobile networks - use www.@@"
        "                    driveUrl: link.url.replace('//youtube.com/', '//www.youtube.com/'),@@"
        "                    urlType: getUrlType(link.url),@@",
        'contentblock: normalise youtube host to www',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
