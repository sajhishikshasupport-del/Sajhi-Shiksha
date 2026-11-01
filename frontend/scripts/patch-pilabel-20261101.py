#!/usr/bin/env python3
"""REQ-1031-01 (1 Nov 2026) - project-ideas card ka label.

The leaf 'project-ideas' has 183 documents whose own Drive folder (1hB7zZC...)
is dead - Drive returns "unavailable" for it. The card therefore points at our
own Maths Lab folder (1GFcIZIZ...), which is correct, but the label still said
just "Maths Project Ideas", so the folder a teacher lands in looked wrong.

Fix: label the leaf "Maths Project Ideas (Maths Lab)" so it matches where the
link actually goes. No data, no ids, no docs change.

Idempotent.
"""
import json

P = 'frontend/src/data/teachers.json'
OLD = 'Maths Project Ideas'
NEW = 'Maths Project Ideas (Maths Lab)'

d = json.load(open(P, encoding='utf-8'))
changed = []


def walk(o):
    if isinstance(o, dict):
        if o.get('id') == 'project-ideas' and o.get('title') == OLD:
            o['title'] = NEW
            changed.append('project-ideas title')
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for v in o:
            walk(v)


walk(d)
if changed:
    json.dump(d, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(P, 'a', encoding='utf-8').write(chr(10))
    print('patched:', ', '.join(changed))
else:
    print('SKIP (already applied or title differs)')
print('OK')
