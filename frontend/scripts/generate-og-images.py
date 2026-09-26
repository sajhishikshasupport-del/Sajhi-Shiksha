#!/usr/bin/env python3
"""
Generate the per-section Open Graph preview images (1200x630 PNG) into
frontend/public/images/. Design matches the site's neo-brutalist style:
cream background, thick black borders, colored accents, hard shadows.

Requires Pillow (pip install pillow). Run from the repository root:
    python frontend/scripts/generate-og-images.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
CREAM = '#FFF8E7'
INK = '#1A1A1A'
SECONDARY = '#4A4A4A'
F_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

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


def font(size):
    return ImageFont.truetype(F_BOLD, size)


def fit_font(d, text, start, max_w, min_size=20):
    size = start
    while size > min_size and d.textlength(text, font=font(size)) > max_w:
        size -= 2
    return font(size)


def main():
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'images')
    os.makedirs(out_dir, exist_ok=True)

    for s in SECTIONS:
        img = Image.new('RGB', (W, H), CREAM)
        d = ImageDraw.Draw(img)

        # top accent bar + rule
        d.rectangle([0, 0, W, 36], fill=s['accent'])
        d.rectangle([0, 36, W, 42], fill=INK)
        # outer border
        d.rectangle([0, 0, W, H], outline=INK, width=12)

        # badge with hard shadow + star
        bx, by, bs = W - 200, 100, 90
        d.rectangle([bx + 10, by + 10, bx + bs + 10, by + bs + 10], fill=INK)
        d.rectangle([bx, by, bx + bs, by + bs], fill=s['accent'], outline=INK, width=6)
        d.polygon([(bx + bs // 2, by + 12), (bx + bs - 16, by + bs // 2),
                   (bx + bs // 2, by + bs - 12), (bx + 16, by + bs // 2)], fill=INK)

        # site name
        d.text((90, 118), 'S A J H I   S H I K S H A', font=font(32), fill=SECONDARY)

        # title (shrink if wide) + underline
        tf = fit_font(d, s['title'], 116, 780)
        d.text((90, 212), s['title'], font=tf, fill=INK)
        tw = d.textlength(s['title'], font=tf)
        d.rectangle([94, 362, 94 + min(int(tw), 800), 392], fill=s['accent'], outline=INK, width=4)

        # subtitle (fit under 990)
        sf = fit_font(d, s['subtitle'], 44, 990)
        d.text((92, 420), s['subtitle'], font=sf, fill=INK)

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
        tagf = fit_font(d, s['tag'], 30, pill_left - 92 - 50)
        d.text((92, py + 6), s['tag'], font=tagf, fill=SECONDARY)

        # palette quantize for smaller files
        q = img.quantize(colors=48, method=Image.MEDIANCUT, dither=Image.Dither.NONE)
        out = os.path.normpath(os.path.join(out_dir, s['file']))
        q.save(out, 'PNG', optimize=True)
        print('wrote', out, os.path.getsize(out), 'bytes')

    print('DONE')


if __name__ == '__main__':
    main()
