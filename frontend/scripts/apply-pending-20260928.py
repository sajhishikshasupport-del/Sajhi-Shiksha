#!/usr/bin/env python3
"""One-shot patch (28 Sep 2026) — pending Night Manager changes.

Applies, idempotently:
1. teacher-contents.json        — 13 title updates (Drive-side trailing whitespace)
2. teacher-contents-circular.json — 3 title updates + 1 modifiedDate update
3. teachers.json                — DIKSHA external-link leaf in circular-formats > miscellaneous (Content Scout)
4. math-lovers-contents.json   — ISI Test of Mathematics book (Maths Lovers > Olympiad)
5. sections.json                — link entry for the ISI book on ml-olympiad

Safe to re-run: already-applied changes are skipped.
"""
import json
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "src" / "data"

TC_TITLES = {
    "1aSN3Hwk9CDL9dSFX_WMZuMglFM0AsiMy": "12 assertion reasoning ",
    "1vNqpVNubHd8p54RE_Z2Dfg82FyJNTYH-": "11 case study ",
    "1aSQCYMudexIfaDU8fA3qC25rjElOO5jE": "11 assertion reasoning ",
    "14L58a3AxRtPBCUNTFBpL7J1z755Vkk9i": "Class 12 summer vacation HW ",
    "1K5zDvN2OI7ZuAlG9cfTCIkE309vXD_2U6useGs7GCes": "Class 8 (Part 2) Mathematics Lesson plan ",
    "1eOoqSlnwUERTzSkYlO5YswXWMbB9I1z_1bkw7xzhCRY": "Class 8 (Part 1) Mathematics Lesson plan ",
    "1847OycF-F74a8vMB-Vs0DAeqFhWWuT8Ezz_OwLe4Bqo": "Class 12 Mathematics Lesson plan ",
    "1YxS9baV0POJgQ5Yw8GAjzl2sip0otQpWJ9PVw0vca5c": "Class 10 Mathematics Lesson plan ",
    "1maiHyailZINUg4H3r5IBSl48z8Ic1v17d7TZItNFonI": "Class 11 Mathematics Lesson plan ",
    "19uSVjCzQO9gu2Iz2I48hTs-F8bX4joYQ8iaLX3CCQa0": "Class 7 (Part1) Mathematics Lesson plan ",
    "1yMNaGHHOjCVVARdhIoHsvLDFLbMTOJTpxqSG4j_YXpI": "Class 6 Mathematics Lesson plan ",
    "1iwQktJmqg2bN63EQlORJK_BVosg0VNk9MWbWSKK8XII": "How to make lesson plan with ChatGPT \n",
    "1v8zCo2Aa7ZwJP6K7jBA-3myxkBMH8PkYlGgRCf_O0-k": "Class 7 (Part 2) Mathematics Lesson plan ",
}

TCC_TITLES = {
    "1_ZAhxuLdH_xMzwKml_EF_5BHAXwHDEUf": "Revised chapter 21 accounts code ",
    "1GyIzXKsBlKVvWVAHq3ZFLtUQq0Tu_txX": "online APAR drafting tool by selecting options ",
    "1Wt32RW5XhVGPo0GMWux3rlMaROVjpQz-SMDmNsFvbr8": "Action Plan for Low achievement and remedial students ",
}
TCC_DATE = {"1vUROLmRVoEsPpBRxR5XKUQKBf3ySWEfo": "2026-09-26T04:07:46.508Z"}

ISI_KEY = "1LGH_sBiogqm4RCBT4D0t7pkLv0ro1HjS"
ISI_DOC = {
    "id": "1oSBDNoTBjCLnBCT5pRcO31LC8FK5vDIk",
    "title": "ISI Test of Mathematics at 10+2 Level Book (16th Edition)",
    "link": "https://drive.google.com/file/d/1oSBDNoTBjCLnBCT5pRcO31LC8FK5vDIk/view",
    "mimeType": "application/pdf",
    "modifiedDate": "2026-09-26T22:12:26.937Z",
}


def load(fn):
    return json.loads((DATA / fn).read_text(encoding="utf-8"))


def dump_min(fn, data):
    (DATA / fn).write_text(
        json.dumps(data, separators=(",", ":"), ensure_ascii=False), encoding="utf-8"
    )


def apply_json_updates(fn, titles, dates):
    data = load(fn)
    changed = 0
    for leaf, v in data.items():
        if leaf == "_comment" or not isinstance(v, dict):
            continue
        for doc in v.get("documents", []):
            fid = doc.get("id")
            if fid in titles and doc.get("title") != titles[fid]:
                doc["title"] = titles[fid]
                changed += 1
            if fid in dates and doc.get("modifiedDate") != dates[fid]:
                doc["modifiedDate"] = dates[fid]
                changed += 1
        if leaf != "kvs-tt-circulars":
            v["documents"].sort(key=lambda x: x.get("modifiedDate") or "", reverse=True)
    if changed:
        dump_min(fn, data)
    print(f"{fn}: {changed} field updates applied")
    return changed


def patch_teachers():
    fn = "teachers.json"
    raw = (DATA / fn).read_text(encoding="utf-8")
    if '"diksha-portal"' in raw:
        print(f"{fn}: DIKSHA leaf already present, skipping")
        return 0
    anchor = (
        '                            "driveUrl": "https://drive.google.com/embeddedfolderview'
        '?id=1NFdXj6ijN_NspZCQL-OQEHjRbg70qd3o#list"\n'
        "                        }\n"
        "                    ]"
    )
    if raw.count(anchor) != 1:
        print(f"ERROR: anchor not unique in {fn}", file=sys.stderr)
        sys.exit(1)
    leaf = (
        anchor[: -len("                    ]")].rstrip()
        + ",\n"
        + "                        {\n"
        '                            "id": "diksha-portal",\n'
        '                            "title": "DIKSHA - National Digital Platform (NCERT/MoE)",\n'
        '                            "description": "Sarkari (NCERT/Ministry of Education) digital '
        "platform - NCERT-aligned maths videos, practice exercises, question banks and textbook "
        'QR-code content, Class 1-12, 36 Indian languages. Free and official.",\n'
        '                            "driveUrl": "https://diksha.gov.in/"\n'
        "                        }\n"
        "                    ]"
    )
    raw = raw.replace(anchor, leaf, 1)
    json.loads(raw)  # validate
    (DATA / fn).write_text(raw, encoding="utf-8")
    print(f"{fn}: DIKSHA leaf added to miscellaneous")
    return 1


def patch_math_lovers():
    fn = "math-lovers-contents.json"
    data = load(fn)
    if ISI_KEY in data:
        print(f"{fn}: ISI entry already present, skipping")
        return 0
    data[ISI_KEY] = {"folders": [], "documents": [ISI_DOC]}
    dump_min(fn, data)
    print(f"{fn}: ISI book entry added")
    return 1


def patch_sections():
    fn = "sections.json"
    raw = (DATA / fn).read_text(encoding="utf-8")
    if ISI_KEY in raw:
        print(f"{fn}: ISI link already present, skipping")
        return 0
    lines = raw.split("\n")
    # locate the unique "Books and Notes PDFs" link, then its closing "}," line
    hits = [i for i, l in enumerate(lines) if '"Books and Notes PDFs"' in l]
    if len(hits) != 1:
        print(f"ERROR: 'Books and Notes PDFs' not unique in {fn}", file=sys.stderr)
        sys.exit(1)
    close = None
    for i in range(hits[0], min(hits[0] + 6, len(lines))):
        if lines[i].rstrip().endswith("},"):
            close = i
            break
    if close is None:
        print(f"ERROR: closing brace not found after link in {fn}", file=sys.stderr)
        sys.exit(1)
    ind_field = lines[hits[0]][: len(lines[hits[0]]) - len(lines[hits[0]].lstrip())]
    ind_brace = ind_field[:-4]
    block = [
        ind_brace + "{",
        ind_field + '"title": "ISI Test of Mathematics at 10+2 Level (16th Edition)",',
        ind_field
        + '"url": "https://drive.google.com/embeddedfolderview'
        f'?id={ISI_KEY}#list"',
        ind_brace + "},",
    ]
    lines[close + 1 : close + 1] = block
    raw = "\n".join(lines)
    json.loads(raw)  # validate
    (DATA / fn).write_text(raw, encoding="utf-8")
    print(f"{fn}: ISI link added to ml-olympiad")
    return 1


def main():
    apply_json_updates("teacher-contents.json", TC_TITLES, {})
    apply_json_updates("teacher-contents-circular.json", TCC_TITLES, TCC_DATE)
    patch_teachers()
    patch_math_lovers()
    patch_sections()
    # final validation of all five files
    for fn in [
        "teacher-contents.json",
        "teacher-contents-circular.json",
        "teachers.json",
        "math-lovers-contents.json",
        "sections.json",
    ]:
        json.loads((DATA / fn).read_text(encoding="utf-8"))
    print("All files valid JSON. Patch complete.")


if __name__ == "__main__":
    main()
