#!/usr/bin/env python3
"""
Generate the Open Graph preview images (1200x630 PNG) into
frontend/public/images/. Design matches the site's neo-brutalist style:
cream background, thick black borders, colored accents, hard shadows.

Also generates the Career Counselling section's own preview images (the
section index plus one per career page), in English and Hindi, into
frontend/public/images/og/career/.

Requires Pillow (pip install pillow). Run from the repository root:
    python frontend/scripts/generate-og-images.py
"""
import json
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
CREAM = '#FFF8E7'
INK = '#1A1A1A'
SECONDARY = '#4A4A4A'
F_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def _deva_font_path():
    # Locate a Devanagari font: the exact Bold file first, then any Noto
    # Devanagari on the system (paths vary by distro/package).
    import glob
    for pat in (
        '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf',
        '/usr/share/fonts/**/NotoSansDevanagari-Bold.ttf',
        '/usr/share/fonts/**/NotoSansDevanagari*.ttf',
    ):
        hits = sorted(glob.glob(pat, recursive=True))
        if hits:
            return hits[0]
    return '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf'


F_DEVA = _deva_font_path()

SECTIONS = [
    {'file': 'og-image.png', 'accent': '#FFE066', 'title': 'Sajhi Shiksha',
     'subtitle': 'Free Study Materials for Students & Teachers',
     'tag': 'Sharing Knowledge — From You, For You'},
    {'file': 'og-students.png', 'accent': '#4ECDC4', 'title': 'For Students',
     'subtitle': 'Mathematics Resources for Classes 6–12',
     'tag': 'Question Papers · Notes · Worksheets'},
    {'file': 'og-teachers.png', 'accent': '#95E45C', 'title': 'For Teachers',
     'subtitle': 'Teaching Resources, Circulars & Formats',
     'tag': 'TGT/PGT Materials · KVS Resources'},
    {'file': 'og-tgt-pgt.png', 'accent': '#95E45C', 'title': 'TGT/PGT Maths',
     'subtitle': 'Question Papers, Banks, Lesson Plans & PPTs',
     'tag': 'Teaching Resources'},
    {'file': 'og-circular.png', 'accent': '#FF6B9D', 'title': 'Circulars & Formats',
     'subtitle': 'GOI/KVS Rules · Admission · CBSE/NIOS Formats',
     'tag': 'Office & School Formats'},
    {'file': 'og-math-lovers.png', 'accent': '#C084FC', 'title': 'For Math Lovers',
     'subtitle': 'Puzzles · Olympiad Material · Project Ideas',
     'tag': 'Explore the Beauty of Mathematics'},
]

# Career Counselling section accent (indigo, matches the manifest's section colour).
CAREER_ACCENT = '#818CF8'
CAREER_TAG = 'Career Counselling'


def font(size, path=F_BOLD):
    return ImageFont.truetype(path, size)


def fit_font(d, text, start, max_w, path=F_BOLD, min_size=20):
    size = start
    while size > min_size and d.textlength(text, font=font(size, path)) > max_w:
        size -= 2
    return font(size, path)


def draw_card(accent, title, subtitle, tag, title_path=F_BOLD, body_path=F_BOLD):
    """Draw one 1200x630 card and return the image."""
    img = Image.new('RGB', (W, H), CREAM)
    d = ImageDraw.Draw(img)

    # top accent bar + rule
    d.rectangle([0, 0, W, 36], fill=accent)
    d.rectangle([0, 36, W, 42], fill=INK)
    # outer border
    d.rectangle([0, 0, W, H], outline=INK, width=12)

    # badge with hard shadow + diamond
    bx, by, bs = W - 200, 100, 90
    d.rectangle([bx + 10, by + 10, bx + bs + 10, by + bs + 10], fill=INK)
    d.rectangle([bx, by, bx + bs, by + bs], fill=accent, outline=INK, width=6)
    d.polygon([(bx + bs // 2, by + 12), (bx + bs - 16, by + bs // 2),
               (bx + bs // 2, by + bs - 12), (bx + 16, by + bs // 2)], fill=INK)

    # site name
    d.text((90, 118), 'S A J H I   S H I K S H A', font=font(32), fill=SECONDARY)

    # title (shrink if wide) + underline
    tf = fit_font(d, title, 116, 780, title_path)
    d.text((90, 212), title, font=tf, fill=INK)
    tw = d.textlength(title, font=tf)
    d.rectangle([94, 362, 94 + min(int(tw), 800), 392], fill=accent, outline=INK, width=4)

    # subtitle (fit under 990)
    sf = fit_font(d, subtitle, 44, 990, body_path)
    d.text((92, 420), subtitle, font=sf, fill=INK)

    # URL pill (bottom right)
    uf = font(32)
    url = 'www.sajhishiksha.in'
    uw = d.textlength(url, font=uf)
    pill_right = W - 90
    pill_left = pill_right - int(uw) - 44
    py = H - 120
    d.rectangle([pill_left + 6, py + 6, pill_right + 6, py + 52 + 6], fill=INK)
    d.rectangle([pill_left, py, pill_right, py + 52], fill=CREAM, outline=INK, width=5)
    d.text((pill_left + 22, py + 7), url, font=uf, fill=INK)

    # tag (fit left of pill, on same baseline row)
    tagf = fit_font(d, tag, 30, pill_left - 92 - 50, body_path)
    d.text((92, py + 6), tag, font=tagf, fill=SECONDARY)

    return img


def short(text, limit=78):
    """Trim a long description to one readable line for the card subtitle."""
    text = (text or '').strip().replace('\n', ' ')
    if len(text) <= limit:
        return text
    cut = text[:limit]
    if ' ' in cut:
        cut = cut.rsplit(' ', 1)[0]
    return cut.rstrip(' ,;:—-·') + '…'


def save(img, out):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    # palette quantize for smaller files
    q = img.quantize(colors=48, method=Image.MEDIANCUT, dither=Image.Dither.NONE)
    q.save(out, 'PNG', optimize=True)
    print('wrote', out, os.path.getsize(out), 'bytes')


def main():
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    out_dir = os.path.join(root, 'public', 'images')
    os.makedirs(out_dir, exist_ok=True)

    # 1. Fixed section images.
    for s in SECTIONS:
        save(draw_card(s['accent'], s['title'], s['subtitle'], s['tag']),
             os.path.normpath(os.path.join(out_dir, s['file'])))

    # 2. Career Counselling section + per-page images (English + Hindi).
    data_dir = os.path.join(root, 'src', 'data')
    pages_dir = os.path.join(data_dir, 'career-pages')
    career_dir = os.path.join(out_dir, 'og', 'career')

    try:
        manifest = json.load(open(os.path.join(data_dir, 'career-website-content.json'), encoding='utf-8'))
    except Exception as e:
        print('career og: manifest read failed:', e)
        manifest = None

    if manifest:
        sec = manifest.get('section', {})
        save(draw_card(CAREER_ACCENT,
                       sec.get('title', 'Career Counselling'),
                       'Stream Selection · Entrance Exams · Colleges · Scholarships',
                       'Free, research-backed guidance'),
             os.path.normpath(os.path.join(out_dir, 'og-career-counselling.png')))

        # Hindi section card (uses the same Hindi strings the app uses).
        try:
            i18n = json.load(open(os.path.join(data_dir, 'career-i18n.json'), encoding='utf-8'))
            hi = i18n.get('hi', {})
            save(draw_card(CAREER_ACCENT,
                           hi.get('indexTitle', 'करियर काउंसलिंग'),
                           hi.get('indexDescription', 'छात्रों और अभिभावकों के लिए भरोसेमंद करियर मार्गदर्शन'),
                           'करियर काउंसलिंग', F_DEVA, F_DEVA),
                 os.path.normpath(os.path.join(out_dir, 'og-career-counselling.hi.png')))
        except Exception as e:
            print('career og: hi section card failed:', e)

        for item in manifest.get('items', []):
            if item.get('visible') is False or item.get('type') != 'page':
                continue
            pid = item.get('id')
            if not pid:
                continue

            # English card (falls back to the manifest entry when no page JSON exists).
            page = None
            try:
                page = json.load(open(os.path.join(pages_dir, f'{pid}.json'), encoding='utf-8'))
            except Exception:
                page = None
            title = (page or {}).get('title') or item.get('title') or pid
            subtitle = short((page or {}).get('intro_short') or item.get('description') or '')
            save(draw_card(CAREER_ACCENT, title, subtitle, CAREER_TAG),
                 os.path.normpath(os.path.join(career_dir, f'{pid}.png')))

            # Hindi card, when a Hindi page file exists.
            try:
                hi_page = json.load(open(os.path.join(pages_dir, f'{pid}.hi.json'), encoding='utf-8'))
                save(draw_card(CAREER_ACCENT,
                               hi_page.get('title', title),
                               short(hi_page.get('intro_short', '')),
                               'करियर काउंसलिंग', F_DEVA, F_DEVA),
                     os.path.normpath(os.path.join(career_dir, f'{pid}.hi.png')))
            except Exception as e:
                print('career og: hindi card failed:', e)

        # Stream guides (and any other page files) that are not top-level
        # manifest items — e.g. the four guides under career-guides-by-stream.
        covered = {i.get('id') for i in manifest.get('items', []) if i.get('type') == 'page'}
        try:
            for fn in sorted(os.listdir(pages_dir)):
                if not fn.endswith('.json') or fn.endswith('.hi.json'):
                    continue
                pid = fn[:-5]
                if pid in covered:
                    continue
                page = json.load(open(os.path.join(pages_dir, fn), encoding='utf-8'))
                save(draw_card(CAREER_ACCENT, page.get('title', pid),
                               short(page.get('intro_short', '')), CAREER_TAG),
                     os.path.normpath(os.path.join(career_dir, f'{pid}.png')))
                try:
                    hi_page = json.load(open(os.path.join(pages_dir, f'{pid}.hi.json'), encoding='utf-8'))
                    save(draw_card(CAREER_ACCENT, hi_page.get('title', pid),
                                   short(hi_page.get('intro_short', '')), 'करियर काउंसलिंग', F_DEVA, F_DEVA),
                         os.path.normpath(os.path.join(career_dir, f'{pid}.hi.png')))
                except Exception:
                    pass
        except Exception as e:
            print('career og: pages dir scan failed:', e)

    print('DONE')


if __name__ == '__main__':
    main()
