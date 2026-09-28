#!/usr/bin/env python3
"""One-shot patch: add Class 2 leaves + Programmes & Common group to the
Primary Teachers & HM section (teacher-contents-primary.json + teachers.json)."""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve()
FE = HERE.parents[1]  # frontend/
TCP = FE / "src" / "data" / "teacher-contents-primary.json"
TJ = FE / "src" / "data" / "teachers.json"

MIME = {
    "D": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "W": "application/msword",
    "P": "application/pdf",
    "X": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "T": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}

DATA = {
    "class-2-lesson-plans": [
        "1tGVFER_Uywr3665QzYvLMRllalwvGsaO|Class 2 English - Lesson Plan 1.docx|2026-09-28T03:58:36.504Z|D|Class 2",
        "1tGqNCaqt2AmecOp-UdS0LJAc_ghXmwH-|Class 2 Maths - Lesson Plan 1.docx|2026-09-28T03:58:36.106Z|D|Class 2",
        "1sYznFUPHFM7GlsaKlh0xLKsaCisbfOXK|Class 2 Maths - Lesson Plan (A Day at the Beach).docx|2026-09-28T03:58:36.026Z|D|Class 2",
        "1tGwVUT201zQa-JpjFAXMs4v_nKwaP9uK|Class 2 EVS - Lesson Plan 1.docx|2026-09-28T03:58:35.901Z|D|Class 2",
    ],
    "class-2-worksheets": [
        "1ZUzeV2_RaB57lT0TSfCaCf2KoB4isN1P|Class 2 Maths - Worksheet.pdf|2026-09-28T03:59:52.171Z|P|Class 2",
        "1zftnqRHBOaRGtzjEyZ1TzTO2VMqQOR4y|Class 2 Hindi - Worksheet 1.pdf|2026-09-28T03:59:43.429Z|P|Class 2",
        "1GiR_ro09s0xXz3wC8fUCGfSWQSvckQFy|Class 2 Hindi - Worksheet (New).pdf|2026-09-28T03:59:38.572Z|P|Class 2",
        "1sdOKu7Y3aQnDtiYvdLSWvJsji9IstGpF|Class 2 EVS - Worksheet 2.pdf|2026-09-28T03:59:38.292Z|P|Class 2",
        "1Zj29SXmSI5lBXM45TJNk5z5e9KNEQc2G|Class 2 EVS - Worksheet.pdf|2026-09-28T03:59:38.269Z|P|Class 2",
        "1AllwqH1dHC7H_PrxYioJdiVaEZKMPbRI|Class 2 English - Worksheet.pdf|2026-09-28T03:59:10.655Z|P|Class 2",
        "1qHyVgp0LEyVTziLjw18887ZhBrYIkPFa|Class 2 English - Worksheet 8.docx|2026-09-28T03:59:09.665Z|D|Class 2",
        "1JarEeXH117MgHy-ewncLsdpxhyIAf1UC|Class 2 English - Worksheet 7.docx|2026-09-28T03:59:09.102Z|D|Class 2",
        "1B3-67UH7ogbTV8ZjKmjm0G1MoLVEi7yp|Class 2 English - Worksheet 6.docx|2026-09-28T03:59:06.387Z|D|Class 2",
        "1a3CUl4ez9jAPoO_kYJJhLuiRTsbAK549|Class 2 English - Worksheet 2.docx|2026-09-28T03:59:05.451Z|D|Class 2",
        "1Uap6ze4WX1uRC6X1AdofxBcH-OYr3dMP|Class 2 English - Worksheet 4.docx|2026-09-28T03:59:05.037Z|D|Class 2",
        "1OQ1-dmpgf9YT2AtQsDLOmVGUPtnZ9yJm|Class 2 English - Worksheet 1.docx|2026-09-28T03:59:03.803Z|D|Class 2",
    ],
    "class-2-question-papers": [
        "1dL8U2jw9RTgTwkpCHDvjFeDgT77N2Ww0|Class 2 EVS - Cycle Test 6 (2).docx|2026-09-28T03:59:57.315Z|D|Class 2",
        "1KjxaOdMQKPNXNzpHVjf07puCbPgxF8wD|Class 2 Maths - Objective Type Questions.pdf|2026-09-28T03:59:52.157Z|P|Class 2",
        "1T9DufpVa0Y0ESRW_24dA66WHSsgPfgje|Class 2 Maths - Cycle Test (2).docx|2026-09-28T03:59:51.243Z|D|Class 2",
        "1xGPieiwoptXqJYDw1sh82WWZXlwYVr6t|Class 2 Maths - Cycle Test.docx|2026-09-28T03:59:49.982Z|D|Class 2",
        "1C1B4E2BZXdq3xQ-VGUPkMpgTOlULBdcE|Class 2 Maths - Cycle Test 1 (April).docx|2026-09-28T03:59:48.077Z|D|Class 2",
        "1klOu98f6b8OY-doMayy5e9bBMuM3hVUC|Class 2 Maths - Cycle Test 7.docx|2026-09-28T03:59:45.534Z|D|Class 2",
        "1lp3_paQrMIeyFWHfMHOCSn2gDTnpu-QY|Class 2 Hindi - Cycle Test 2.pdf|2026-09-28T03:59:44.740Z|P|Class 2",
        "1e1CkSmLt9Ni3YE6-eoybYVWNvdxH8NnE|Class 2 Maths - Cycle Test 3.pdf|2026-09-28T03:59:44.689Z|P|Class 2",
        "17AdqYH2rdE9M0l0rDzO3QDYPzHqU-5BN|Class 2 Hindi - Objective Type Questions.pdf|2026-09-28T03:59:41.889Z|P|Class 2",
        "18exgybf7U5a0y0P4duWVt6Js2RCJiE51|Class 2 EVS - Objective Type Questions.pdf|2026-09-28T03:59:36.616Z|P|Class 2",
        "1QnbE68i0IfIdHqgFFblHDE7x0sGRtVrh|Class 2 EVS - Cycle Test C.docx|2026-09-28T03:59:35.166Z|D|Class 2",
        "1sjr31Qa9AALNPVOZX1J6_hl46H3LLh6u|Class 2 EVS - Cycle Test B.docx|2026-09-28T03:59:33.526Z|D|Class 2",
        "1l3VigOzz5To14TtrkKwvICw1XFkuIG5L|Class 2 EVS - Cycle Test A.pdf|2026-09-28T03:59:31.848Z|P|Class 2",
        "1uSdzxtDWMqT3_zhPY68DO9cHAHMQQZBq|Class 2 EVS - Cycle Test (PDF Version).pdf|2026-09-28T03:59:31.292Z|P|Class 2",
        "1h9Cl4QrdnUuEmAL5crUu_wAqUMQvLiVL|Class 2 EVS - Cycle Test.docx|2026-09-28T03:59:30.075Z|D|Class 2",
        "153CZz8XzrObJ2hrO9AR366YC32k-5mD8|Class 2 EVS - Cycle Test (November).docx|2026-09-28T03:59:28.554Z|D|Class 2",
        "1tZOGFXDNwZjzL6lYlFStKlXMGAm021XW|Class 2 EVS - Cycle Test (March).docx|2026-09-28T03:59:26.593Z|D|Class 2",
        "14Blw6S4pBLh2eFQ4guvyC8oUjX3N676R|Class 2 EVS - Cycle Test (July 2).docx|2026-09-28T03:59:24.957Z|D|Class 2",
        "1RDcP-tQC23QOfcgmhhTRk-E-EAOZCXqk|Class 2 EVS - Cycle Test (July).docx|2026-09-28T03:59:24.314Z|D|Class 2",
        "1fTT19W7LnwvPA-q1eyQKgyuIkGtZS15C|Class 2 EVS - Cycle Test (January).docx|2026-09-28T03:59:22.798Z|D|Class 2",
        "1x5FqMQjOcecVnB9dFMCi0_0gUUKN3jUd|Class 2 EVS - Cycle Test (February).docx|2026-09-28T03:59:21.563Z|D|Class 2",
        "1A66uXrt_bSmSaKQyUB3mItEGvoV3m5Ax|Class 2 EVS - Cycle Test (August).docx|2026-09-28T03:59:19.556Z|D|Class 2",
        "11kESx3ACRfycfGsxquVhi2ZLHjGpiCSR|Class 2 EVS - Cycle Test 6.docx|2026-09-28T03:59:18.194Z|D|Class 2",
        "1xlKT_VjwXlG9joyL6A69FN_uN01iVWqo|Class 2 EVS - Cycle Test 4.docx|2026-09-28T03:59:17.332Z|D|Class 2",
        "1qtaW4b84T4QD-m2vcGU5UG0ztiFFhVcp|Class 2 EVS - Cycle Test 3 (PDF).pdf|2026-09-28T03:59:15.693Z|P|Class 2",
        "16e-gexcYW9-cN4nOgvMC2g5GDkKleGc0|Class 2 EVS - Cycle Test 3 (v3).docx|2026-09-28T03:59:14.515Z|D|Class 2",
        "1ANyZITuVj8YscLCzAbBIoaXdO-_hb3E8|Class 2 EVS - Cycle Test 3 (v2).docx|2026-09-28T03:59:12.301Z|D|Class 2",
        "18ZGelJHtj-C7U_RChwcYT-mrHwW4KaRZ|Class 2 EVS - Cycle Test 2.docx|2026-09-28T03:59:11.237Z|D|Class 2",
        "1EmBNsZTpb6JZ3tkU4QApW5iwvHCO347K|Class 2 English - Cycle Test 3.docx|2026-09-28T03:59:00.253Z|D|Class 2",
        "1pFivgKMKmrCFpFNoFyntnl3EfP90dkfm|Class 2 English - Cycle Test 8.docx|2026-09-28T03:58:58.742Z|D|Class 2",
        "1rvTnUj_g-CBnIwCFBt20gCHPQrukhZXo|Class 2 English - Cycle Test 7.docx|2026-09-28T03:58:57.345Z|D|Class 2",
    ],
    "class-2-textbook": [
        "18HnNbEJziZx3K7MpI3y01wKGhy9Nb0Jy|Class 2 Maths - Textbook.pdf|2026-09-28T03:58:57.452Z|P|Class 2",
        "1UxTuu44H2uIqzLpM8waZT6gSFgJAgJeo|Class 2 Hindi - Textbook.pdf|2026-09-28T03:58:56.710Z|P|Class 2",
        "1LUo9adwLeJPcBNBumuMyDydjnWugIeib|Class 2 EVS - Split-up.pdf|2026-09-28T03:58:53.371Z|P|Class 2",
        "1CLPuDnnyh1dF6jJb2fB2VZM_cqtvSEU7|Class 2 English - Textbook.pdf|2026-09-28T03:58:51.716Z|P|Class 2",
        "1qe8xLvdQkOaND-bpUUD_0nstzp1o1f_U|Class 2 Hindi - Split-up.pdf|2026-09-28T03:58:50.461Z|P|Class 2",
        "1PIQKQz5QfGS-p5qyr_xXvbq9xRzZt658|Class 2 Maths - Split-up.pdf|2026-09-28T03:58:50.454Z|P|Class 2",
        "1e9U4mBlyehpxMDs0GKCrlk1vP2tZES5T|Class 2 - Learning Outcomes Brochure.pdf|2026-09-28T03:58:48.095Z|P|Class 2",
        "1fgXbeq968GA6GJcYZRSYu5Pwqtb1ylWb|Class 2 English - Split-up.pdf|2026-09-28T03:58:30.873Z|P|Class 2",
    ],
    "programmes-misc": [
        "1aTEkePgUl4nW_upzTP5Ssmq8EAZwniAk|Primary EVS - Skills in Environmental Studies.pdf|2026-09-28T03:59:55.114Z|P|General",
        "16mxOmZy4fa2RDtAju_mLRIRtqIpcYdg4|Primary EVS - Module II (Teacher Training).pdf|2026-09-28T04:05:00.000Z|P|General",
    ],
}

GROUPS = [{'id': 'primary-class-2',
  'title': 'Class 2',
  'description': 'Class 2 lesson plans, worksheets, question papers, textbooks and split-ups',
  'icon': 'School',
  'hasSubCards': True,
  'subCards': [{'id': 'class-2-lesson-plans',
                'title': 'Lesson Plans',
                'description': 'Class 2 lesson plans (EVS, English, Maths)',
                'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1CDV00lkdtQBW8_U0Xj5JIrZ-rew1cvJJ#list'},
               {'id': 'class-2-worksheets',
                'title': 'Worksheets',
                'description': 'Class 2 worksheets (English, EVS, Hindi, Maths)',
                'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1BYLnzjEo9Az9GtmXBP4v8sz40I6PuCG0#list'},
               {'id': 'class-2-question-papers',
                'title': 'Question Papers',
                'description': 'Class 2 cycle tests and question papers',
                'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1sVTbXNeFWNrj2-D3W5KdhJkx829l_zDs#list'},
               {'id': 'class-2-textbook',
                'title': 'Textbook, Split-up & TLO',
                'description': 'Class 2 textbooks, split-ups and learning outcomes',
                'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1fnM1e5pBF5EPaHEe1AX6C8dwTWbCZfhI#list'}]},
 {'id': 'programmes-common',
  'title': 'Programmes & Common',
  'description': 'Common primary programmes and teacher resources',
  'icon': 'Campaign',
  'hasSubCards': True,
  'subCards': [{'id': 'programmes-misc',
                'title': 'Miscellaneous',
                'description': 'Teacher training and resource materials',
                'driveUrl': 'https://drive.google.com/embeddedfolderview?id=19pbEhZbnm0b04kdsuUQHlh_r8MCo8kpG#list'}]}]


def main():
    # ---- teacher-contents-primary.json ----
    s = TCP.read_text(encoding="utf-8")
    assert '"class-2-lesson-plans"' not in s, "already patched"
    new_leaves = {}
    for leaf, rows in DATA.items():
        docs = []
        for row in rows:
            fid, title, date, code, cls = row.split("|", 4)
            mime = MIME.get(code, code)
            docs.append({"id": fid, "title": title,
                         "link": "https://drive.google.com/file/d/%s/view" % fid,
                         "mimeType": mime, "modifiedDate": date, "className": cls})
        docs.sort(key=lambda d: d["modifiedDate"], reverse=True)
        new_leaves[leaf] = {"folders": [], "documents": docs}
    insert = "," + json.dumps(new_leaves, ensure_ascii=False, separators=(",", ":"))[1:-1]
    idx = s.rfind("}")
    out = s[:idx] + insert + s[idx:]
    json.loads(out)
    TCP.write_text(out, encoding="utf-8")
    print("teacher-contents-primary.json: +5 leaves,", len(out), "bytes")

    # ---- teachers.json ----
    t = TJ.read_text(encoding="utf-8")
    assert '"primary-class-2"' not in t, "already patched"
    tail = "                }\n            ]\n        }\n    ]\n}\n"
    assert t.endswith(tail), "unexpected teachers.json tail"
    blocks = []
    for g in GROUPS:
        b = json.dumps(g, ensure_ascii=False, indent=4).replace("\n", "\n" + " " * 12)
        blocks.append(" " * 12 + b)
    newt = t[: -len(tail)] + "                },\n" + ",\n".join(blocks) + "\n            ]\n        }\n    ]\n}\n"
    json.loads(newt)
    TJ.write_text(newt, encoding="utf-8")
    print("teachers.json: +2 groups,", len(newt), "bytes")


if __name__ == "__main__":
    main()
