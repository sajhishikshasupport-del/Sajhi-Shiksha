#!/usr/bin/env python3
"""Fix (23 Oct 2026): broken / copyright-risky links on the Maths Lovers page
and the dead project-ideas folder.

Found on inspection:
  * sections.json mathLovers.blocks[1] "Maths Project Ideas" had two links to
    "https://drive.google.com/embeddedfolderview" - with NO folder id at all,
    so they always showed a 500 error.
  * sections.json mathLovers.olympiadSection.links[0] "Olympiad Books" pointed
    at the same id-less URL. That folder (10tgDz7r...) also holds pirated /
    commercial-publisher books, so it must not be linked.
  * sections.json mathLovers.blocks[0] link "Puzzles & Games YouTube Playlist"
    was "https://youtube.com/playlist" with no ?list= id.
  * teachers.json leaf "project-ideas" driveUrl pointed at the external folder
    1hB7zZC... which Drive reports as unavailable.

What this does (Sir approved):
  * Maths Project Ideas now links to the Maths Lab leaf pages on our own site,
    where the 183 project PDFs are already published (no duplicate list).
  * The dead "Olympiad Books" and empty playlist links are removed.
  * teachers.json leaf project-ideas points at our own Maths Lab folder.

Idempotent. Writes the files back with the same 2-space JSON formatting.
"""
import json

changes = []

# ---------- sections.json ----------
P = 'frontend/src/data/sections.json'
d = json.load(open(P, encoding='utf-8'))
ml = d['mathLovers']

proj = None
for b in ml.get('blocks', []):
    if b.get('id') == 'ml-projects':
        proj = b
if proj is not None:
    want = [
        {'title': 'Maths Project Ideas (Maths Lab)', 'url': '/for-teachers/tgt-pgt?folder=maths-lab&leaf=project-ideas'},
        {'title': 'Maths Lab Activities', 'url': '/for-teachers/tgt-pgt?folder=maths-lab&leaf=lab-activities'},
    ]
    if proj.get('links') != want:
        proj['links'] = want
        changes.append('sections: ml-projects -> Maths Lab links')

for b in ml.get('blocks', []):
    if b.get('id') == 'ml-puzzles':
        keep = [l for l in (b.get('links') or []) if 'playlist' not in (l.get('url') or '')]
        if keep != b.get('links'):
            b['links'] = keep
            changes.append('sections: removed empty puzzles playlist link')

oly = ml.get('olympiadSection') or {}
keep = [l for l in (oly.get('links') or []) if 'embeddedfolderview' not in (l.get('url') or '')]
if keep != oly.get('links'):
    oly['links'] = keep
    changes.append('sections: removed Olympiad Books folder link (copyright + dead id)')

if changes:
    json.dump(d, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(P, 'a', encoding='utf-8').write(chr(10))

# ---------- teachers.json ----------
P2 = 'frontend/src/data/teachers.json'
t = json.load(open(P2, encoding='utf-8'))
ML_LAB = 'https://drive.google.com/drive/folders/1GFcIZIZ-aH8hT3SUBe8yb81v2kNmEsaA'
hit = False


def walk(o):
    global hit
    if isinstance(o, dict):
        if o.get('id') == 'project-ideas' and 'embeddedfolderview' in (o.get('driveUrl') or ''):
            o['driveUrl'] = ML_LAB
            hit = True
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for v in o:
            walk(v)


walk(t)
if hit:
    json.dump(t, open(P2, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(P2, 'a', encoding='utf-8').write(chr(10))
    changes.append('teachers: project-ideas driveUrl -> our Maths Lab folder')

print('patched:', ', '.join(changes) if changes else 'nothing')
print('OK')
