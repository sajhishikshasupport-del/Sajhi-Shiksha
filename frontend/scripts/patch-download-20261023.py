#!/usr/bin/env python3
"""Fix (23 Oct 2026): "Download" and "Open in New Tab" did the same thing.

Sir's report: on the /view/ page both buttons just opened the document, so
"Download" never actually downloaded.

Cause: ResourceViewPage.tsx had
    handleDownload  = window.open(resource.driveUrl)
    handleOpenInTab = window.open(resource.driveUrl)
- identical.

Now:
  * Download  -> Drive's download endpoint (uc?export=download&id=<fileId>),
                 which saves the file; the button is hidden for folders (a
                 folder cannot be downloaded).
  * Open in New Tab -> the normal Drive view page, as before.

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


P = 'frontend/src/features/viewer/components/ResourceViewPage.tsx'

patch(P, [
    (
        "    const handleDownload = () => {@@"
        "        trackEvent('document_open', { document_title: resource.title, source: 'resource_view' });@@"
        "        window.open(resource.driveUrl, '_blank');@@"
        "    };@@",
        "    // Drive files download through the uc endpoint; folders cannot be downloaded@@"
        "    // (their button is hidden below).@@"
        "    const driveFileId = (resource.driveUrl || '').match(/\\/d\\/([^/]+)/)?.[1] ?? '';@@"
        "    const isFolder =@@"
        "        (resource.driveUrl || '').includes('embeddedfolderview') ||@@"
        "        (resource.driveUrl || '').includes('/drive/folders/');@@"
        "    const downloadUrl = driveFileId@@"
        "        ? `https://drive.google.com/uc?export=download&id=${driveFileId}`@@"
        "        : resource.driveUrl;@@@@"
        "    const handleDownload = () => {@@"
        "        trackEvent('document_download', { document_title: resource.title, source: 'resource_view' });@@"
        "        window.open(downloadUrl, '_blank');@@"
        "    };@@",
        'view: real download url',
    ),
    (
        "                    {resource.driveUrl && (@@"
        "                        <Button@@"
        "                            variant=\"contained\"@@"
        "                            startIcon={<DownloadIcon />}@@",
        "                    {resource.driveUrl && !isFolder && (@@"
        "                        <Button@@"
        "                            variant=\"contained\"@@"
        "                            startIcon={<DownloadIcon />}@@",
        'view: hide download for folders',
    ),
])

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
