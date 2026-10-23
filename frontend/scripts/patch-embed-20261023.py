#!/usr/bin/env python3
"""Fix (23 Oct 2026): broken Drive embeds on the /view/ pages.

Problem (Sir's report):
  * Google retired the embedded Drive FOLDER view -> every folder link showed
    "500 That's an error" inside the /view/ page (Olympiad Books, Maths Project
    Ideas, etc.).
  * YouTube / normal website links were also being put in an iframe, which they
    refuse -> blank/error box.

Fix:
  1. lib/utils.ts  getDriveEmbedUrl(): return '' for folders and for any
     non-Drive URL, so no bad iframe is built.
  2. components/IframeViewer: when there is nothing embeddable, show the
     fallback panel (with the existing "Open in New Tab" button) instead of an
     empty iframe, and word the message for that case.

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


patch('frontend/src/lib/utils.ts', [
    (
        "export function getDriveEmbedUrl(driveUrl: string): string {@@"
        "    if (!driveUrl || driveUrl.trim() === '') return '';@@",
        "export function getDriveEmbedUrl(driveUrl: string): string {@@"
        "    if (!driveUrl || driveUrl.trim() === '') return '';@@@@"
        "    // Google retired the embedded Drive FOLDER view - embedding a folder@@"
        "    // shows a 500 error. The page shows the file list + an Open button instead.@@"
        "    if (driveUrl.includes('embeddedfolderview') || driveUrl.includes('/drive/folders/')) {@@"
        "        return '';@@"
        "    }@@@@"
        "    // Only Drive FILES can be previewed in an iframe. YouTube and normal@@"
        "    // websites refuse to be embedded, so those get a plain link instead.@@"
        "    if (!driveUrl.includes('drive.google.com')) {@@"
        "        return '';@@"
        "    }@@",
        'utils: no embed for folders / non-Drive URLs',
    ),
])

patch('frontend/src/components/IframeViewer/IframeViewer.tsx', [
    (
        "    const embedUrl = getDriveEmbedUrl(driveUrl);@@",
        "    const embedUrl = getDriveEmbedUrl(driveUrl);@@"
        "    const canEmbed = embedUrl !== '';@@",
        'iframe: add canEmbed',
    ),
    (
        "    if (error) {@@",
        "    if (error || !canEmbed) {@@",
        'iframe: show fallback when nothing to embed',
    ),
    (
        "                    The document could not be displayed in the viewer.@@",
        "                    {canEmbed@@"
        "                        ? 'The document could not be displayed in the viewer.'@@"
        "                        : 'This link opens on another website, so it cannot be shown inside this page. Use the button below.'}@@",
        'iframe: message for non-embeddable links',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
