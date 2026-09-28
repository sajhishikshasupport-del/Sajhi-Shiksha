#!/usr/bin/env python3
"""One-shot patch (29 Sep 2026) — pending sync + topic-wise segregation.

Applies, with full validation BEFORE any write:
1. teacher-contents-circular.json — (a) kvs-rules +1 new: KVS SOP 'Minor Name
   Correction of Student and Parents' (28.09.2026, moved from internal inbox);
   (b) admission (39 docs) + cbse (29 docs) topic-wise segregation (className).
2. teacher-contents-primary.json — programmes-misc 1 modifiedDate precision fix
   + latest-first resort of that leaf.
3. teacher-contents.json — project-ideas (183 docs) topic-wise segregation
   (5 topics, title-classified).

Makes 4 separate git commits in this order (sync first, then segregation),
then pushes once. Safe to re-run: already-applied changes are skipped.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parents[1] / "src" / "data"

SOP = {
    "id": "1Wloz1H3dYU5lP9GIdJUyDKd7LUjhkn45",
    "title": "KVS SOP - Minor Name Correction of Student and Parents (28.09.2026).pdf",
    "link": "https://drive.google.com/file/d/1Wloz1H3dYU5lP9GIdJUyDKd7LUjhkn45/view",
    "mimeType": "application/pdf",
    "modifiedDate": "2026-09-28T22:06:04.750Z",
}

PRIMARY_DATE_FIX = {
    "16mxOmZy4fa2RDtAju_mLRIRtqIpcYdg4": "2026-09-28T04:04:03.044Z",
}

ADMISSION_TOPICS = {
    "1p9KVrfhqkF9V8k2n3sjYGrxUVpa7rizGYM6CPjvI5mU": "Guidelines & Rules",
    "1M21TNowZ-KYaCIzrZarDBWsubrvfDPap": "Guidelines & Rules",
    "1dPvQ6fzVlWzNmK1LnEtaU_JQW0oKk4MM": "Guidelines & Rules",
    "1dJi_nKM6sXU8HcfP0yofqtf5g5BEnp9H": "Guidelines & Rules",
    "1cQ4ii8UBEnxjOd9SZJBmUmgumTBcahSL": "Guidelines & Rules",
    "1HtSApWWE3qBot3h4C0dtSVUbVXx7HFOp": "Guidelines & Rules",
    "19ICyaldI0uWNf9YMgwFj_debFGdRSHac": "Guidelines & Rules",
    "18xO-MdhxFCvWczugW8PY5_rQbEPd39g-": "Guidelines & Rules",
    "18pilTmxlWH2jA1bdFuTJ8bC5i3hDwEPA": "Guidelines & Rules",
    "1VDB8dWjuJo_lwzeMA9rzmcMSmQhMbUNH": "Guidelines & Rules",
    "15N1Tno4yWWKs0d3U239IpWVFODdReAEr": "Local Transfer & TC",
    "1c6DYtkIAqqsPD1pcmaSU8jlJ1B70RV2i": "Local Transfer & TC",
    "1VEb2Sj3JjzQZrIxdsgCDsDhTZAaW66TQ": "Local Transfer & TC",
    "1UxAY032P5HjE7PgmCjs_Ff3QuBd-jiwK": "Local Transfer & TC",
    "1KSgpK4KRX5GGX8WD-L63LIAejSB8u42t": "Forms & Proformas",
    "13ypgv_x7NLE95tqL25Vubt6zy1-s9-xo": "Forms & Proformas",
    "1nBK2cee4IfW4XXJa4SYc2zAEoOuAiuLb": "Forms & Proformas",
    "1DqrsQKv1HD3MTVbfKL-xEVZzHG9T3XUo": "Forms & Proformas",
    "183Sj3YSUpYEL_BKngBmFHJrRFDJNiSup": "Forms & Proformas",
    "17QrT4K3TnXTdmQY1bzoLQiypSIF1XyIG": "Forms & Proformas",
    "17GyN5RgcbLFZfyBC-nnIWboToUfbne1A": "Forms & Proformas",
    "1VF-bM-sht299UxbDiIveDFS3xefhth5x": "Forms & Proformas",
    "1V801eJpxmX44glP1lwbr1gD11yyDMq5n": "Forms & Proformas",
    "1V7WspV-Ma-3lDwSOUR1skPWrnOUgr4GG": "Forms & Proformas",
    "1V4nDzdDVfG9RmcUSjLods9NE92esTu4B": "Forms & Proformas",
    "1V43uE7TpXmmxkwydivU83bv6e3wi6V0L": "Forms & Proformas",
    "1V0ws_yA-VuFq1vUUAfAJJam6b4CAdDQl": "Forms & Proformas",
    "1UwmlbVm_H_ks9i7G29y6SqT9AcPS1AS_": "Forms & Proformas",
    "1Un3dVAPqOZOsZhpCTJhbpbIcF_QB-qq0": "Forms & Proformas",
    "1UgFTOlI0N6l0kQzh8p8NUhckEPEguO7n": "Forms & Proformas",
    "1KEofqm7fRnNv-S8txjkSS99rSQIPs-6-": "Schedules & Advertisements",
    "17-PPgH0RQnowwPCCOMldHTh-BluIGwRE": "Schedules & Advertisements",
    "16w4l3EXM7ZHSHVRWjxLnmeJkSo2qIfzG": "Schedules & Advertisements",
    "16sOkdSunIPjx_ogp6zS-3Grh_AQjRb72": "Schedules & Advertisements",
    "16phP50XHx7tq_UjQljIh27pCsGrlTuwT": "Schedules & Advertisements",
    "16n3edevRJeaSXqc6eO1Qh63I77lb6kRW": "Schedules & Advertisements",
    "16gTpv-tGVVU0fVPhHdOmWEoxN8Y3eKsY": "Schedules & Advertisements",
    "1V3LS1xu53kP0ObfXrUz8kxA9ufwM0upg": "Schedules & Advertisements",
    "1V-m90KUHdhimLpMkcbT1ndwHUCRxPH7V": "Schedules & Advertisements",
}

CBSE_TOPICS = {
    "1GoDi0NfrEgqg1lOokcOQXT52xOyHdw2n": "Circulars & Guidelines",
    "1zPhCj1PCZrb68AfOcATL65pMKee1KVCq": "Circulars & Guidelines",
    "1o0RooG-u6gpPszq7VQ0aVC2Xy6-dFILg": "Circulars & Guidelines",
    "1w1xv-DHMjwd5lxhYcp8XDBd44bgxvouB": "Circulars & Guidelines",
    "17-yVIcao4us9R1peppOshPeUm9X-eVve": "Circulars & Guidelines",
    "1QmhlM-kGfMrj_if1omJKdV2k_fKzS-pQ": "Circulars & Guidelines",
    "1QYhOjd4EAE7G_bD3WvwpXGAxc_8uoyo5": "Circulars & Guidelines",
    "1QYFQ-Ast7ubt0LDUMahVknNBIrwsgbGd": "Circulars & Guidelines",
    "1Gw8P22bb1rp6MWW45Y4L_Eh-m0k1qEsd": "Admission & Name Correction",
    "1lMiuYlLJIlNKQHakfChVttp4pUONzNmy": "Admission & Name Correction",
    "1QXpIf70TnXBEbVjt9JiJxsK0dKLQKn4i": "Admission & Name Correction",
    "1QSONftqH4hgYwaTl7NhsRI1_jGplL_mU": "Admission & Name Correction",
    "166KdDK99Dt7Fw7RdTwi5DHnpTeG3YGYV": "Exam & Award Formats",
    "1LyJSmMbBTlM4ESsJK__Dx3C0wLKza_zc": "Exam & Award Formats",
    "1LOaPxrskPm39YPTBnwzEvUWjA5UXRjHf": "Exam & Award Formats",
    "1_WQdRV5eEMFALPnW5HH2-pVleQ5rMG3F": "Exam & Award Formats",
    "1UXysUpKE4B3wiw8aAFnKUU3btjn3lVKA": "Exam & Award Formats",
    "1iyQmH2XGOh5iIdbtFzUgyJPMojK1PLgA": "Exam & Award Formats",
    "1deYDOqkyqiVqfwoGR7Q5m-UrLXRP9VOj": "Exam & Award Formats",
    "1kW4HDToOcT7ECWKRt0ukSBhHt-Id0d7P": "Exam & Award Formats",
    "1r0yIiENBKcV_n4TAj6rVbPN8VuYacUvN": "Exam & Award Formats",
    "1gzR3DbRsFJqDgJRYNxtisiJMbqhi3_SU": "Exam & Award Formats",
    "1EpMx_llL6v8OZZVbEM5fALjBxpIoPexi": "Exam & Award Formats",
    "1Hjj36BoM7bkQziN2PsVAmmDWCKDoXbyd": "Exam & Award Formats",
    "1y3NGNdydmPtKpJK5eH5z2g13t6bTRPar": "Exam & Award Formats",
    "1rjPtYsTO8IW7HlQofFCw8Oj-qcvLA--x": "TA/DA Bill Formats",
    "1ra93_sVufHvTuDH_NZB9x2doC5-bSBNX": "TA/DA Bill Formats",
    "1Md0tcmQJxug2hPnPH4zq5atDFNHM8UBc": "TA/DA Bill Formats",
    "1MbsycpoNB1w50LrBmCE_pD64XsFPDLHV": "TA/DA Bill Formats",
}

PI_OVERRIDES = {
    "tangent from an external point": "Geometry & Shapes",
    "largest area with equal rerimeter english": "Geometry & Shapes",
    "lunes of alhazen": "Geometry & Shapes",
    "lune of hippocrates": "Geometry & Shapes",
    "magnetic geometry": "Geometry & Shapes",
    "ice cream structure": "Geometry & Shapes",
    "magical ratio of a4": "Number & Algebra",
    "magic water tharmometer": "Physics & Science Toys",
    "light bulb mystery": "Physics & Science Toys",
    "optical bench": "Optics & Illusions",
}

RE_OPTICS = re.compile(
    r"ames room|colored shadow|colour shadow|kaleidoscope|periscope|mirror|laser star|"
    r"total internal|refraction|bird in cage|disappearing coin|microscope",
    re.I,
)
RE_PUZZLES = re.compile(
    r"puzzle|monty hall|magic|card flip|card sorting|non-transitive|nontransitive|"
    r"hamiltonian|handshak|missing area|trammel|1000 year|calender|calendar|"
    r"arrow sliding|stack it up|spooky|chitti|vasudev",
    re.I,
)
RE_NUMBER = re.compile(
    r"sum of|fractions|abc of math|amgmhm|\(a \+ b\)|\(a - b\)|a2 \+ b2|visual proof|hemchandra|gp\b|number",
    re.I,
)
RE_GEOMETRY = re.compile(
    r"flexagon|triangle|square|rectangle|polygon|hexagon|pentagon|octahedron|dodecahedron|"
    r"tetrahedron|icosahedron|cube|platonic|dual of|area of|pythagoras|law of cosines|angle|"
    r"golden|equilateral|reuleaux|circle|trapezium|geoboard|curve stitch|string art|"
    r"3d structures|shapes|box from|perimeter|geometry",
    re.I,
)


def pi_topic(title):
    s = title.strip().lower()
    for key, topic in PI_OVERRIDES.items():
        if key in s:
            return topic
    if RE_OPTICS.search(s):
        return "Optics & Illusions"
    if RE_PUZZLES.search(s):
        return "Puzzles & Brain Teasers"
    if RE_NUMBER.search(s):
        return "Number & Algebra"
    if RE_GEOMETRY.search(s):
        return "Geometry & Shapes"
    return "Physics & Science Toys"


def load(fn):
    return json.loads((DATA / fn).read_text(encoding="utf-8"))


def dump_min(fn, data):
    (DATA / fn).write_text(
        json.dumps(data, separators=(",", ":"), ensure_ascii=False), encoding="utf-8"
    )


def sh(*cmd):
    return subprocess.run(list(cmd), check=True, capture_output=True, text=True).stdout


def commit(msg, *files):
    sh("git", "add", *[str(f) for f in files])
    r = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if r.returncode == 0:
        print(f"  (skip, no changes: {msg})")
        return False
    sh("git", "commit", "-m", msg)
    print(f"  committed: {msg}")
    return True


def main():
    sh("git", "config", "user.name", "sajhishikshasupport-del")
    sh("git", "config", "user.email", "sajhishiksha@gmail.com")

    circular = load("teacher-contents-circular.json")
    primary = load("teacher-contents-primary.json")
    tc = load("teacher-contents.json")

    # ---------- apply (in memory) ----------
    # 1a. circular sync: SOP into kvs-rules (top, latest-first)
    kvs = circular["kvs-rules"]["documents"]
    sop_applied = any(d["id"] == SOP["id"] for d in kvs)
    if not sop_applied:
        kvs.insert(0, SOP)
        dates = [d["modifiedDate"] for d in kvs]
        assert dates == sorted(dates, reverse=True), "kvs-rules not latest-first after SOP insert"
    sop_exists = any(d["id"] == SOP["id"] for d in circular["kvs-rules"]["documents"])
    assert sop_exists, "SOP missing"

    # 1b. admission + cbse segregation
    for leaf, tmap in (("admission", ADMISSION_TOPICS), ("cbse", CBSE_TOPICS)):
        docs = circular[leaf]["documents"]
        ids = [d["id"] for d in docs]
        assert set(ids) == set(tmap), (
            f"{leaf}: doc ids and topic map mismatch: "
            f"missing_from_map={set(ids) - set(tmap)} unknown_in_map={set(tmap) - set(ids)}"
        )
        for d in docs:
            d["className"] = tmap[d["id"]]

    # 2. primary date fix + resort programmes-misc
    pm = primary["programmes-misc"]["documents"]
    for d in pm:
        if d["id"] in PRIMARY_DATE_FIX:
            d["modifiedDate"] = PRIMARY_DATE_FIX[d["id"]]
    pm.sort(key=lambda d: d["modifiedDate"], reverse=True)

    # 3. project-ideas segregation
    pi = tc["project-ideas"]["documents"]
    topics = {}
    for d in pi:
        t = pi_topic(d["title"])
        assert t, f"unclassified: {d['title']}"
        d["className"] = t
        topics[t] = topics.get(t, 0) + 1

    # ---------- validate ----------
    assert len(circular["kvs-rules"]["documents"]) == 12, "kvs-rules should have 12 docs"
    n_circ = sum(len(v["documents"]) for k, v in circular.items() if k != "_comment")
    n_prim = sum(len(v["documents"]) for k, v in primary.items() if k != "_comment")
    n_tc = sum(len(v["documents"]) for k, v in tc.items() if k != "_comment")
    assert n_circ == 157, f"circular doc count {n_circ} != 157"
    assert n_prim == 335, f"primary doc count {n_prim} != 335"
    assert n_tc == 381, f"tgt-pgt doc count {n_tc} != 381"
    assert all(d.get("className") for d in circular["admission"]["documents"])
    assert all(d.get("className") for d in circular["cbse"]["documents"])
    assert all(d.get("className") for d in tc["project-ideas"]["documents"])
    json.dumps(circular)
    json.dumps(primary)
    json.dumps(tc)
    print("validation OK:")
    print(f"  kvs-rules: 12 docs (SOP at top)")
    print(f"  admission topics: {sorted(set(ADMISSION_TOPICS.values()))}")
    print(f"  cbse topics: {sorted(set(CBSE_TOPICS.values()))}")
    print(f"  project-ideas topics: {topics}")

    # ---------- write + commit (sync first, then segregation) ----------
    # step 1: circular sync (SOP only)
    c1 = json.loads(json.dumps(circular))
    if not sop_applied:
        pass  # circular already includes SOP; for the sync-only commit, strip classNames
    for leaf in ("admission", "cbse"):
        for d in c1[leaf]["documents"]:
            d.pop("className", None)
    dump_min("teacher-contents-circular.json", c1)
    commit(
        "chore: nightly drive sync (circular-formats) — +1 new, -0 removed (KVS SOP: Minor Name Correction, 28.09.2026)",
        DATA / "teacher-contents-circular.json",
    )

    # step 2: primary sync
    dump_min("teacher-contents-primary.json", primary)
    commit(
        "chore: nightly drive sync (primary-hm) — 1 modifiedDate update",
        DATA / "teacher-contents-primary.json",
    )

    # step 3: circular segregation (full version with classNames)
    dump_min("teacher-contents-circular.json", circular)
    commit(
        "feat: topic-wise segregation for admission & cbse sections (68 docs)",
        DATA / "teacher-contents-circular.json",
    )

    # step 4: project-ideas segregation
    dump_min("teacher-contents.json", tc)
    commit(
        "feat: topic-wise segregation for project-ideas (183 docs, 5 topics)",
        DATA / "teacher-contents.json",
    )

    # final re-validation of what is on disk
    for fn in ("teacher-contents.json", "teacher-contents-circular.json", "teacher-contents-primary.json"):
        json.loads((DATA / fn).read_text(encoding="utf-8"))
    print("on-disk files re-validated (valid JSON)")
    sh("git", "push", "origin", "HEAD")
    print("pushed.")


if __name__ == "__main__":
    sys.exit(main())
