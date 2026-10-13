#!/usr/bin/env python3
"""One-shot CEO orders (13 Oct 2026) - applied on the GitHub Actions runner so
no large file is ever transcribed by hand. Idempotent / safe to re-run.

1. About page: remove the Arattai card; WhatsApp channel -> new link; email fix.
2. Contribute page: email fix.
3. Career Counselling: default language English.
4. For Students: add NCERT Laboratory Manuals link.
"""
import json
import sys

ROOT = 'frontend/src'
changed_any = False


def note(msg):
    global changed_any
    changed_any = True
    print('CHANGED:', msg)


# ---- 1. contact.json (About page contact info) ----
p = f'{ROOT}/data/contact.json'
d = json.load(open(p, encoding='utf-8'))
if d.get('email') != 'sajhishiksha@gmail.com':
    d['email'] = 'sajhishiksha@gmail.com'
    note('contact.json email')
if 'arattai' in d:
    d.pop('arattai')
    note('contact.json arattai removed')
if d.get('whatsappChannel') != 'https://whatsapp.com/channel/0029VbDa3av5a24BxxTR3d1A':
    d['whatsappChannel'] = 'https://whatsapp.com/channel/0029VbDa3av5a24BxxTR3d1A'
    note('contact.json whatsappChannel')
open(p, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=4) + '\n')

# ---- 2. contributors.json (Contribute page email) ----
p = f'{ROOT}/data/contributors.json'
t = open(p, encoding='utf-8').read()
if 'sajhishikshasupport@gmail.com' in t:
    t = t.replace('sajhishikshasupport@gmail.com', 'sajhishiksha@gmail.com')
    open(p, 'w', encoding='utf-8').write(t)
    note('contributors.json email')

# ---- 3. AboutPage.tsx: drop the Arattai card + its now-unused import ----
p = f'{ROOT}/features/about/components/AboutPage.tsx'
t = open(p, encoding='utf-8').read()
START = '                {/* Arattai */}'
END = '                {/* WhatsApp Group */}'
i, j = t.find(START), t.find(END)
if i != -1 and j != -1 and i < j:
    t = t[:i] + t[j:]
    note('AboutPage Arattai block')
OLD_IMP = "import { CheckCircleIcon, EmailIcon, WhatsAppIcon, LinkIcon } from '@/components/Icons';"
NEW_IMP = "import { CheckCircleIcon, EmailIcon, WhatsAppIcon } from '@/components/Icons';"
if OLD_IMP in t:
    t = t.replace(OLD_IMP, NEW_IMP)
    note('AboutPage LinkIcon import')
open(p, 'w', encoding='utf-8').write(t)
if 'arattai' in t.lower():
    print('ERROR: "arattai" still present in AboutPage.tsx')
    sys.exit(1)

# ---- 4. useCareerLang.ts: default English ----
p = f'{ROOT}/features/career/useCareerLang.ts'
t = open(p, encoding='utf-8').read()
OLD_FN = """/** The last language the visitor chose, or null when none was stored. */
function readStoredLang(): CareerLang | null {
    if (typeof window === 'undefined') return null;
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return isLang(value) ? value : null;
    } catch {
        return null;
    }
}

"""
if OLD_FN in t:
    t = t.replace(OLD_FN, '')
    note('useCareerLang readStoredLang removed')
OLD_INIT = "useState<CareerLang>(() => readUrlLang() ?? readStoredLang() ?? 'en')"
NEW_INIT = "useState<CareerLang>(() => readUrlLang() ?? 'en')"
if OLD_INIT in t:
    t = t.replace(OLD_INIT, NEW_INIT)
    note('useCareerLang default English')
open(p, 'w', encoding='utf-8').write(t)

# ---- 5. students.json: add NCERT Laboratory Manuals ----
p = f'{ROOT}/data/students.json'
d = json.load(open(p, encoding='utf-8'))
if not any(l.get('id') == 'ncert-lab-manuals' for l in d.get('officialLinks', [])):
    d['officialLinks'].append({
        'id': 'ncert-lab-manuals',
        'title': 'NCERT Laboratory Manuals',
        'description': 'Official NCERT science laboratory manuals for Classes 6-12 - practical work, experiments and activities',
        'url': 'https://ncert.nic.in/science-laboratory-manual.php?ln=en',
        'icon': 'Description',
    })
    note('students.json NCERT lab manuals')
open(p, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=4) + '\n')

print('done. changed_any =', changed_any)
