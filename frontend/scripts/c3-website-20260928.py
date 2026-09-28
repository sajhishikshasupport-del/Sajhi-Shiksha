#!/usr/bin/env python3
"""One-shot patch: add Class 3 (textbooks) + MDP programme leaf to the
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
    "class-3-textbook": [
        "1N6HmgiOiEKhsDYS-VZ4hNdr8u9UBHQQL|Class 3 Hindi - Textbook (Veena).pdf|2026-09-28T04:58:49.530Z|P|Class 3",
        "1ZXwNCW8U9nE4o-uihfiYPINokUuJGvzT|Class 3 Maths - Textbook (Maths Mela).pdf|2026-09-28T04:58:42.219Z|P|Class 3",
        "1x81DQWiBFUXhzhlUtAc6VTWbSiXII3i4|Class 3 English - Textbook (Santoor).pdf|2026-09-28T04:58:34.536Z|P|Class 3",
    ],
    "programmes-mdp": [
        "1jRfqDoI_l_NcLxHA3uIWWjoZDARcM4eM|MDP Example - Class 3 Water (2).pdf|2026-09-28T05:00:19.712Z|P|General",
        "1CjCJwKUuNdSTFASM0EWUbLvDqzpPIa-r|MDP Example - Class 3 Food (2).docx|2026-09-28T05:00:11.181Z|D|General",
        "1t8tfyXaTteDGFOgWXF3RaDJFTnKL1FwF|MDP Example - Class 3 Food.pdf|2026-09-28T05:00:01.707Z|P|General",
        "1BlXIuBSVgcNwJgdY0hS6nf_99-AXy_D6|MDP Example - Class 3 Food & Animals.pdf|2026-09-28T04:59:51.491Z|P|General",
        "12_uqFllAZaZQ_Ls_6JyBlWXWtbZRUG3L|MDP Example - Class 3 Family.pdf|2026-09-28T04:59:44.940Z|P|General",
        "1JkpoC1zIzS_sO97aM1OCV_5r0OR4y2uu|Subject Enrichment Activities - Guidelines (CBSE-KVS).pdf|2026-09-28T04:59:37.398Z|P|General",
        "1o1qmte1j-iXaTkQVBtsU7Exc-jgAQTfg|MDP - Submission Template.docx|2026-09-28T04:59:30.929Z|D|General",
        "1V7atiHlgwke6SQpmmXsk5D2W1Wz5wx8g|MDP - Rubrics.pptx|2026-09-28T04:59:24.524Z|T|General",
        "17GzR_fYj_hRwJcDgf7ATg3PoF49cBODp|MDP Newsletter - KVS RO Guwahati.pdf|2026-09-28T04:59:18.256Z|P|General",
        "1-Ln13g78jptJaVkHn0CHyCv_yDLqOke9|MDP - Training Material.pdf|2026-09-28T04:59:11.047Z|P|General",
        "1lShDDJfWkXsIeMIgih8WHSstEB8vBxjx|MDP Example - Class 3 Water.pdf|2026-09-28T04:59:03.617Z|P|General",
        "11vV4Ynm1mxLtHU62ezf_wt8fEsfwDcVZ|MDP - Guidelines.docx|2026-09-28T04:58:56.615Z|D|General",
    ],
}

GROUPS = [{'id': 'primary-class-3',
  'title': 'Class 3',
  'description': 'Class 3 textbooks (new NCERT 2024 series)',
  'icon': 'School',
  'hasSubCards': True,
  'subCards': [{'id': 'class-3-textbook',
                'title': 'Textbook',
                'description': 'Class 3 textbooks: Santoor (English), Veena (Hindi), Maths Mela',
                'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1P9r30_bU-bjGPwzuJvJ_KZCyr7gAN1wo#list'}]}]

MDP_LEAF = {'id': 'programmes-mdp',
 'title': 'Multidisciplinary Project (MDP)',
 'description': 'MDP guidelines, rubrics, templates and project examples',
 'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1YYh-NpCKLHtNturPUKgwTTl3ZDaSPNzm#list'}


def main():
    # ---- teacher-contents-primary.json ----
    s = TCP.read_text(encoding="utf-8")
    assert '"class-3-textbook"' not in s, "already patched"
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
    print("teacher-contents-primary.json: +2 leaves,", len(out), "bytes")

    # ---- teachers.json ----
    t = TJ.read_text(encoding="utf-8")
    assert '"primary-class-3"' not in t, "already patched"
    # 1) insert class-3 group before programmes-common group
    anchor_a = '            },\n            {\n                "id": "programmes-common"'
    assert t.count(anchor_a) == 1, "anchor A not unique"
    c3_block = " " * 12 + json.dumps(GROUPS[0], ensure_ascii=False, indent=4).replace("\n", "\n" + " " * 12)
    t2 = t.replace(anchor_a, "            },\n" + c3_block + ",\n            {\n                \"id\": \"programmes-common\"")
    # 2) insert MDP leaf into programmes-common subCards (file tail)
    tail = "                    }\n                ]\n            }\n            ]\n        }\n    ]\n}\n"
    assert t2.endswith(tail), "unexpected teachers.json tail"
    mdp_block = " " * 20 + json.dumps(MDP_LEAF, ensure_ascii=False, indent=4).replace("\n", "\n" + " " * 20)
    t3 = t2[: -len(tail)] + "                    },\n" + mdp_block + "\n                ]\n            }\n            ]\n        }\n    ]\n}\n"
    json.loads(t3)
    TJ.write_text(t3, encoding="utf-8")
    print("teachers.json: +1 group, +1 leaf,", len(t3), "bytes")

if __name__ == "__main__":
    main()
