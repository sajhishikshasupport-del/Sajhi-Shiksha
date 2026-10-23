#!/usr/bin/env python3
"""Fix 2 (23 Oct 2026): external links must be real <a> tags, and folder links
must use the normal Drive folder URL.

Sir's report after the first fix:
  * "Open in New Tab" on a folder still showed an error -> the stored link is
    `drive.google.com/embeddedfolderview?id=...` which is an embed-only URL and
    cannot be opened in a tab.
  * YouTube links did not open on mobile -> the buttons used window.open(),
    which mobile browsers block as a popup. A real <a target="_blank"> works.

Changes:
  1. components/ResourceCard: the "Watch on YouTube" button becomes an <a>.
  2. components/IframeViewer: the fallback "Open in New Tab" button becomes an
     <a>, and folder links are rewritten to drive.google.com/drive/folders/<id>.

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


patch('frontend/src/components/ResourceCard/ResourceCard.tsx', [
    (
        "                            <Button@@"
        "                                size=\"small\"@@"
        "                                variant=\"contained\"@@"
        "                                startIcon={<OpenInNewIcon />}@@"
        "                                onClick={(e) => {@@"
        "                                    e.stopPropagation();@@"
        "                                    openExternalLink();@@"
        "                                }}@@",
        "                            <Button@@"
        "                                size=\"small\"@@"
        "                                variant=\"contained\"@@"
        "                                component=\"a\"@@"
        "                                href={resource.driveUrl}@@"
        "                                target=\"_blank\"@@"
        "                                rel=\"noopener noreferrer\"@@"
        "                                startIcon={<OpenInNewIcon />}@@"
        "                                onClick={(e) => {@@"
        "                                    e.stopPropagation();@@"
        "                                }}@@",
        'card: youtube button -> real link',
    ),
])

patch('frontend/src/components/IframeViewer/IframeViewer.tsx', [
    (
        "    const canEmbed = embedUrl !== '';@@",
        "    const canEmbed = embedUrl !== '';@@@@"
        "    // embeddedfolderview links are embed-only and cannot be opened in a@@"
        "    // tab - use the normal Drive folder URL instead.@@"
        "    const folderIdMatch = driveUrl.match(/id=([A-Za-z0-9_-]+)/);@@"
        "    const openUrl =@@"
        "        driveUrl.includes('embeddedfolderview') && folderIdMatch?.[1]@@"
        "            ? `https://drive.google.com/drive/folders/${folderIdMatch[1]}`@@"
        "            : driveUrl;@@",
        'iframe: normalise folder link',
    ),
    (
        "                    <Button@@"
        "                        variant=\"contained\"@@"
        "                        startIcon={<OpenInNewIcon />}@@"
        "                        onClick={() => window.open(driveUrl, '_blank')}@@",
        "                    <Button@@"
        "                        variant=\"contained\"@@"
        "                        component=\"a\"@@"
        "                        href={openUrl}@@"
        "                        target=\"_blank\"@@"
        "                        rel=\"noopener noreferrer\"@@"
        "                        startIcon={<OpenInNewIcon />}@@",
        'iframe: fallback button -> real link',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
