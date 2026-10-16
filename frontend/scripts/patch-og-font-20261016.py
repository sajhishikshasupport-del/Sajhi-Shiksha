#!/usr/bin/env python3
"""One-shot OG font fix - generator part (16 Oct 2026).

Why: the OG workflow only installed the DejaVu (Latin) font, never a
Devanagari one. So on the runner F_DEVA did not exist, every Hindi card
failed inside a bare except/pass, and resources.hi.png was never written
(the older .hi.png files came from an earlier run).

This script only touches the generator. The workflow file itself is updated
separately, because the Actions GITHUB_TOKEN is not allowed to create or
update files under .github/workflows/.

Idempotent: re-running changes nothing.
Newlines inside the snippets below are written as @@.
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
        if new in t and old not in t:
            print('SKIP (already applied):', label)
            continue
        if old not in t:
            print('ERROR: pattern not found for', label, 'in', path)
            sys.exit(1)
        t = t.replace(old, new, 1)
        changes.append(label)
    if t != orig:
        open(path, 'w', encoding='utf-8').write(t)


GEN = 'frontend/scripts/generate-og-images.py'
patch(GEN, [
    (
        "F_DEVA = '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf'",
        "def _deva_font_path():@@"
        "    # Locate a Devanagari font: the exact Bold file first, then any Noto@@"
        "    # Devanagari on the system (paths vary by distro/package).@@"
        "    import glob@@"
        "    for pat in (@@"
        "        '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf',@@"
        "        '/usr/share/fonts/**/NotoSansDevanagari-Bold.ttf',@@"
        "        '/usr/share/fonts/**/NotoSansDevanagari*.ttf',@@"
        "    ):@@"
        "        hits = sorted(glob.glob(pat, recursive=True))@@"
        "        if hits:@@"
        "            return hits[0]@@"
        "    return '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf'@@"
        "@@"
        "@@"
        "F_DEVA = _deva_font_path()",
        'F_DEVA resolver',
    ),
])

# make the silent Hindi-card failure visible
t = open(GEN, encoding='utf-8').read()
old_pass = "            except Exception:" + NL + "                pass" + NL
new_pass = "            except Exception as e:" + NL + "                print('career og: hindi card failed:', e)" + NL
if new_pass in t:
    print('SKIP (already applied): hindi card error print')
elif old_pass in t:
    t = t.replace(old_pass, new_pass, 1)
    open(GEN, 'w', encoding='utf-8').write(t)
    changes.append('hindi card error print')
else:
    print('ERROR: silent-except pattern not found')
    sys.exit(1)

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
