#!/usr/bin/env python3
"""Olympiad section rebuild (23 Oct 2026) - Sir approved.

Sir: (1) official free links + more olympiad content, (2) book list with buy
links. (3) Our own guide: later. (4) The Drive folder stays.

The old "Olympiad Books" entry was a link to a folder that also holds pirated
and commercial-publisher books, so it is replaced by:
  * official / genuinely free resources (HBCSE, MTA-IOQM, IMO, EGMO, AoPS,
    Evan Chen's free handouts and beginner guide), and
  * a book list that links to a bookseller SEARCH page (buying the book is
    legal; no file is republished).

Idempotent. Writes back with 2-space JSON formatting.
"""
import json

P = 'frontend/src/data/sections.json'

LINKS = [
    # --- official / free ---
    {'title': 'IOQM Official Website (MTA India)', 'url': 'https://www.mtai.org.in/ioqm-2026/'},
    {'title': 'Stages of Maths Olympiad (HBCSE)', 'url': 'https://olympiads.hbcse.tifr.res.in/about-olympiads/stages/mathematical-olympiad/'},
    {'title': 'Eligibility Criteria (IOQM 2024-25)', 'url': 'https://olympiads.hbcse.tifr.res.in/wp-content/uploads/2024/06/elcrIOQM20242025.pdf'},
    {'title': 'Syllabus', 'url': 'https://olympiads.hbcse.tifr.res.in/how-to-prepare/syllabus/'},
    {'title': 'Previous Year Question Papers (HBCSE)', 'url': 'https://olympiads.hbcse.tifr.res.in/how-to-prepare/past-papers/'},
    {'title': 'Collection of last 40 years (47 countries) Olympiad Problems', 'url': 'https://mathnet.csail.mit.edu/explorer.html'},
    {'title': 'International Mathematical Olympiad - Official Website', 'url': 'https://www.imo-official.org/'},
    {'title': 'HBCSE Olympiad - Official Website', 'url': 'https://olympiads.hbcse.tifr.res.in/'},
    {'title': 'Art of Problem Solving - Contest Collections', 'url': 'https://artofproblemsolving.com/community/c13_contest_collections'},
    {'title': 'Evan Chen - Free Olympiad Handouts', 'url': 'https://web.evanchen.cc/olympiad.html'},
    {'title': 'Evan Chen - Where to Start (Beginner Guide)', 'url': 'https://web.evanchen.cc/wherestart.html'},
    {'title': "European Girls' Mathematical Olympiad (EGMO)", 'url': 'https://www.egmo.org/'},
    # --- recommended books (buy links; no file republished) ---
    {'title': 'Book: Pathfinder for Olympiad Mathematics (Arihant)', 'url': 'https://www.amazon.in/s?k=pathfinder+for+olympiad+mathematics'},
    {'title': 'Book: Problem-Solving Strategies (Arthur Engel)', 'url': 'https://www.amazon.in/s?k=problem+solving+strategies+arthur+engel'},
    {'title': 'Book: The Art and Craft of Problem Solving (Paul Zeitz)', 'url': 'https://www.amazon.in/s?k=the+art+and+craft+of+problem+solving+zeitz'},
    {'title': 'Book: Mathematical Circles - Russian Experience (Fomin)', 'url': 'https://www.amazon.in/s?k=mathematical+circles+russian+experience'},
    {'title': 'Book: Euclidean Geometry in Mathematical Olympiads (Evan Chen)', 'url': 'https://www.amazon.in/s?k=euclidean+geometry+in+mathematical+olympiads'},
    {'title': 'Book: The USSR Olympiad Problem Book (Shklarsky)', 'url': 'https://www.amazon.in/s?k=ussr+olympiad+problem+book'},
    {'title': 'Book: Challenge and Thrills of Pre-College Mathematics (V. Krishnamurthy)', 'url': 'https://www.amazon.in/s?k=challenge+and+thrills+of+pre+college+mathematics'},
]

d = json.load(open(P, encoding='utf-8'))
oly = d['mathLovers']['olympiadSection']

if oly.get('links') == LINKS:
    print('SKIP (already applied): olympiad links')
else:
    oly['links'] = LINKS
    json.dump(d, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(P, 'a', encoding='utf-8').write(chr(10))
    print('patched: olympiad section rebuilt with', len(LINKS), 'links')
print('OK')
