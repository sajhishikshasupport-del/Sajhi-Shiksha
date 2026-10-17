#!/usr/bin/env python3
"""REQ-1017-04: career Resources page - put 'Documents & Downloads' first."""
import json
import sys

DOC_EN = 'Documents'
DOC_HI = 'दस्तावेज़'

changed = []
for path in [
    'frontend/src/data/career-pages/resources.json',
    'frontend/src/data/career-pages/resources.hi.json',
]:
    d = json.load(open(path, encoding='utf-8'))
    secs = d.get('sections') or []
    idx = None
    for i, s in enumerate(secs):
        h = s.get('heading') or ''
        if DOC_EN in h or DOC_HI in h:
            idx = i
            break
    if idx is None:
        print('ERROR: no documents section in', path)
        sys.exit(1)
    if idx == 0:
        print('SKIP (already first):', path)
        continue
    secs.insert(0, secs.pop(idx))
    open(path, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=4))
    changed.append(path)
    print('reordered:', path, '->', [s.get('heading') for s in secs])

print('patched:', ', '.join(changed) if changed else 'nothing')
print('OK')
