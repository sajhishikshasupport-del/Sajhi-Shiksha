#!/usr/bin/env python3
"""One-shot patch: add HM Corner group (materials + records) to the primary section."""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve()
FE = HERE.parents[1]
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
    "hm-materials": [
        "1dHYKBonwf1PqWmWwD_5Auxnf8NXgyuP7|Records - Presentation.pptx|2026-09-28T06:21:31.816Z|application/vnd.ms-powerpoint|HM",
        "1tCG1ETdfnfZhaW8flpsycb9U0Eug4k96|APAR.xlsx|2026-09-28T06:04:47.642Z|X|HM",
        "1f8KNrmu58QqjgRLTQIBs_K7sbYDQuFVP|class supervision.docx|2026-09-28T06:03:43.882Z|D|HM",
        "1O1r-OEwRc7mVTz1wdFpsvWdpTRcuIy1G|pims Observation format.pdf|2026-09-28T06:03:42.096Z|P|HM",
        "1hbr47sJjU98OsTJ-GLRF6OS_gvDILvIZ|inspection check list.pdf|2026-09-28T06:03:41.254Z|P|HM",
        "1VG5qyV4ivx7Ei4WxTASSPZSSwjZp2urR|edu-code-25-04-13.pdf|2026-09-28T06:03:40.111Z|P|HM",
        "1aQdP9tu-_BefY79XcXPyzwwWcAl6Zc5t|apar-kvs.pdf|2026-09-28T06:02:27.542Z|P|HM",
        "1S-Gzc8vpANGyz43BGwFSUY1xa1xlfndA|class supervision-1.docx|2026-09-28T06:02:27.209Z|D|HM",
        "1xU9699Zg4dBZEko2A1OFRSZFA1fsqFkD|Teacher's profile.xlsx|2026-09-28T06:02:24.716Z|X|HM",
        "1FD5J4kvVqA2NERE8-B8vMy4M4Js0_fu0|Submission of teaching diaries.xlsx|2026-09-28T06:02:14.096Z|X|HM",
        "1sMzqWlyyGn4OmnPDzbSJzL0Mu7T6bajq|Teacher self evaluation framework teacher's hand book.docx|2026-09-28T06:02:12.947Z|D|HM",
        "1XbU8QrPUvJzb7t-MYHl6x18G9SRESOS0|Supervision Report.docx|2026-09-28T06:02:10.838Z|D|HM",
        "1PISBIawXL9JaoO23tUC8EMjVCL7ddZqa|SUBMISSION OF TRS. DIARY.doc|2026-09-28T06:02:07.919Z|W|HM",
        "1AEsacJNpOicn0Er-WPQmeFsdRhFEDyj-|Roles_and_Responsibilities_of_an_Effective_Administrator.pptx|2026-09-28T06:02:05.724Z|T|HM",
        "1AI2MMIDCiAPCsfD1vw-TYbpph0ce2XnJ|Reference material-HMs Induction course.pdf|2026-09-28T06:02:01.951Z|P|HM",
        "1AB854n7aIKjQsJxcpkffqTBee50gVbRC|Period guideline kv.pdf|2026-09-28T06:01:57.771Z|P|HM",
        "1cyXD2OZGrwoRI8HivoLHBZtaREolTQMp|Proposed duties of HMs for Education Code.docx|2026-09-28T06:01:53.881Z|D|HM",
        "1MYYy8ODH6XomJ0QnsMb5i-EkMPTmnNRu|Performance Appraisal, Writing APAR, Personnel Development.pptx|2026-09-28T06:01:52.650Z|T|HM",
        "1d4f_LwUplAexYQZeeUM2TUisiP0SV8k2|Notebook checking proforma.docx|2026-09-28T06:01:47.824Z|D|HM",
        "1quQeyp45mbfJew0mFrVqwEqxkCEYdFtH|NOTEBOOK SCRUTINY MONITORING TOOL.docx.pdf|2026-09-28T06:01:42.912Z|P|HM",
        "1vdKIkoyoUs_FmORIaRCQl_Dp4sKs6YSj|Note Books Correction.xlsx|2026-09-28T06:01:42.865Z|X|HM",
        "1XpLkBKFrQ0b0v-vp-zFg_5_uzjKNFXF9|NOTE BOOK OBSERVATION.doc|2026-09-28T06:01:37.427Z|W|HM",
        "1GugWqffVIDdZKo3Hf43ShbtC7z7Nro8-|NOTE BOOK PROFORMA.doc|2026-09-28T06:01:35.003Z|W|HM",
        "1DInX5I-xuIXEc6QkfFIQR97DRAXhM_57|FLAGSHIP.pptx|2026-09-28T06:01:28.951Z|T|HM",
        "10DssiFKBk8RAeg79GqzxsX-FEAbQk_SL|INSPECTION PROFORMA - FOR TEACHER (PROFORMA A) & CLASS OBSERVATION BY INSPECTION TEAM (PROFORMA C).doc|2026-09-28T06:01:28.404Z|W|HM",
        "1A_e_odZMqed8CsH8rS5R4QeWpDy74r1Z|DOPT APAR WRITING AUTHORITY.pdf|2026-09-28T06:01:24.509Z|P|HM",
        "1AUoD_KLMtrCJqxGU79zMsQije917Lnk1|Classroom Observation.docx|2026-09-28T06:01:17.847Z|D|HM",
        "1YVm16HexVFEPzxaywi_FK2s9AiaE22yy|Classroom_Supervision.pptx|2026-09-28T06:01:17.302Z|T|HM",
        "1C3Sf7QMF-IBTyMCtZ8wx3dK8bxFSCgna|DOPT HANDBOOK FOR INQUIRY OFFICERS & DISCIPLINARY AUTHOIRITIES.pdf|2026-09-28T06:01:15.559Z|P|HM",
        "1qSdoJu_84zcG9NayAFqVVX1UxRtTpZq8|Administration of Primary Section-1.pptx|2026-09-28T06:01:08.924Z|T|HM",
        "1WvoXvO1bYrsmC06O9Od_negUMjf9pE4Y|Change in APAR authorities Ammendment in Article-87 of Education Code.pdf|2026-09-28T06:01:05.081Z|P|HM",
        "18CoXRxiSTDknj3DMB6Xvx4honnjJ62Jl|CLASS OBSERVATION.doc|2026-09-28T06:01:04.777Z|W|HM",
        "1LTGKt2k9UHTd5C2CM0AsEJLvWN7IuiWO|Administration of Primary Section.pptx|2026-09-28T06:01:04.575Z|T|HM",
        "1goD43IIsxcVbe6UQvHlaszrFwXfa0di2|APAR SOFTWARE.xlsx|2026-09-28T06:01:01.262Z|X|HM",
        "1VwLikuJEThcoE96-zxiVw8eOovqkO9At|APAR REPORTING SOFTWARE.xlsx|2026-09-28T06:00:53.940Z|X|HM",
        "1yD1qe40tjGc8G_9LNNbNdf3H0Wg8J99X|APAR IN WORD FORMAT.doc|2026-09-28T06:00:47.925Z|W|HM",
    ],
    "hm-records": [
        "1TtmWIYUMTT8jP2eIBVNQ-7rDT_nhKscV|Notebook Checking Index.pdf|2026-09-28T06:21:39.260Z|P|HM",
        "1wj7rNU1rQvLnggZOt4Ro44ur5NXiKMkb|Student Profile - Competencies.xlsx|2026-09-28T06:21:37.246Z|application/vnd.ms-excel|HM",
        "1M6245gwwBbxOPUarLvTvRyEgz_SDx3OA|Late Bloomers - Special Classes Record.docx|2026-09-28T06:21:35.419Z|W|HM",
        "1Y4ePHhrXvrYbI-hN1-XYzIR_fXz-1a_s|Hindi Activity Record (Scanned).pdf|2026-09-28T06:21:33.730Z|P|HM",
        "1mPdxSt2U3OpVs421XzkWkrOw8cgyN2YL|resourceroom teacher & class wise proforma.docx|2026-09-28T06:04:47.685Z|D|HM",
        "12qx_Srm_GvmH_Gc-OcIe89D0tZSCkzxW|performance  portfolio sheet.docx|2026-09-28T06:04:46.839Z|D|HM",
        "1dztQ0lUugpj0-EEmawuYJmReUt45Zy4n|daily activity plan.docx|2026-09-28T06:04:46.579Z|D|HM",
        "1WeQe7isYa7sMO8mJzRD4uLc8EcC5nAeT|cal-tal class&teacherwise.docx|2026-09-28T06:04:39.568Z|D|HM",
        "1GLMAH7rlTWLx_KYdw7nQNel-0HMxvCnO|TLM Class & teacher  wise.docx|2026-09-28T06:04:39.566Z|D|HM",
        "1-ptTUm93j-ISAyEbxWUdTxrlY-jK0yEj|filmshow teacher&classwise.docx|2026-09-28T06:04:39.225Z|D|HM",
        "1B-xrBOg7HSncmBdrkI5gKwgd9AGiCzJd|late bloomers list.docx|2026-09-28T06:04:37.902Z|D|HM",
        "10NpWtl_d4-M0KW2LW2CojNinpP4Ir4e3|Student Profile |2026-09-28T06:04:27.270Z|D|HM",
        "16xhc-dcDk-DKRzBvJHwZkouzuewWPApN|Students Activity record.pdf|2026-09-28T06:04:23.686Z|P|HM",
        "14M0EOm1jx11TkJHJKOx51FOScdOWuJo7|Student Anecdotal Record.docx|2026-09-28T06:04:23.068Z|D|HM",
        "1sjXG2oqsdQ1QiD4pvEVnMgk91Y1Y6vUh|SLOWACHIEVERS PROFORMA.docx|2026-09-28T06:04:22.997Z|D|HM",
        "1jIEHB4rOWGGi0D4HjzwNGdpHj7gfjzlg|SIOP RECORDS.xlsx|2026-09-28T06:04:16.786Z|X|HM",
        "1_F1LoWxQGdLufnzyWKiMG_gQAtmlRkO7|STOCK IN CLASS.xls|2026-09-28T06:04:13.888Z|application/vnd.ms-excel|HM",
        "1Kmxg07FGmPx2omiDdjyfcPoe82h1LQ_u|Records to be maintained in the Primary Section.pdf|2026-09-28T06:04:12.979Z|P|HM",
        "1cYA1IkOKhE-kWyYvSIi74_1q_a8HWyjv|SCHEDULE FOR THE SUBMISSION OF NOTEBOOKS.docx|2026-09-28T06:04:12.492Z|D|HM",
        "1GlBmsCOTOIepTdgyDvKRPEEVkqA7qTK-|PTA proforma.docx|2026-09-28T06:04:05.659Z|D|HM",
        "1fwyu_lIpxAhUs61uJvPdvU7bSDLdTWE_|PREPARATION OF TLM.doc|2026-09-28T06:04:03.450Z|W|HM",
        "1jb9K-P9RuCEGSEzhL7erdvsHUZpghFkL|Records in Primary Section.pdf|2026-09-28T06:04:03.214Z|P|HM",
        "1A6lZUubBtWiWuVZBeOIFq6R3d8cCkefM|NOTE BOOK SUBMISSION.docx|2026-09-28T06:04:01.629Z|D|HM",
        "1Cv_-PpXJTQekHBOKiiF7dk1ogvfVTUJH|Class Library Record.pdf|2026-09-28T06:04:01.383Z|P|HM",
        "1XhK9YZa6ChBdb_GzKn9K7fljOk9JNGZx|INNOVATION.xlsx|2026-09-28T06:03:53.954Z|X|HM",
        "1J4AFWn24cg07JbTOKDpSDBhIUF1W0Eid|LIST OF ITEMS FOR CLASS I (2).doc|2026-09-28T06:03:51.469Z|W|HM",
        "1hvDojRguyRW6xYUGLONdBx0f1SYh-7uw|LAT REPORTING FORMAT.docx|2026-09-28T06:03:51.405Z|D|HM",
        "1wb7rRahHInPFu_5B9Yz1hpbhR_4upRqC|Film Show Review.pdf|2026-09-28T06:03:51.319Z|P|HM",
        "1m4EXQs-KeCki8xY3GJ4f50FV9Y23iKch|ACTION PLAN ON WORKSHEETS PRINT |2026-09-28T06:03:51.031Z|D|HM",
        "1lBEQ4WV_s0MClymxFG-8Sh1v5iVMBFgX|FILM SHOWS LOG BOOK.pdf|2026-09-28T06:03:49.786Z|P|HM",
        "1HJqzDd6Z9gxJzWYKNNnXSkoUuIrtlvxb|CB Test item format.docx|2026-09-28T06:03:41.430Z|D|HM",
        "1wvF1V6ijonFRIXsDbvjScpNG3NL1il33|ANECDOTAL RECORD.docx|2026-09-28T06:03:40.867Z|D|HM",
    ],
}

GROUP = {'id': 'hm-corner',
 'title': 'HM Corner',
 'description': 'Resources for Head Masters and primary section administration',
 'icon': 'School',
 'hasSubCards': True,
 'subCards': [{'id': 'hm-materials',
               'title': 'HM Materials',
               'description': 'APAR, supervision, inspection and administration resources for Head Masters',
               'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1NlSxEdmT0nr7xeP-GDKGUzEDtcLCR7N9#list'},
              {'id': 'hm-records',
               'title': 'Records & Registers',
               'description': 'Records, registers and proformas to be maintained in the primary section',
               'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1XpgkM4M0JII04J5jEt4O3zRX1WtNUtRp#list'}]}


def main():
    # ---- teacher-contents-primary.json ----
    s = TCP.read_text(encoding="utf-8")
    assert '"hm-materials"' not in s, "already patched"
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
    print("tcp:", len(out), "bytes")

    # ---- teachers.json ----
    t = TJ.read_text(encoding="utf-8")
    assert '"hm-corner"' not in t, "already patched"
    tail = "                ]\n            }\n            ]\n        }\n    ]\n}\n"
    assert t.endswith(tail), "unexpected teachers.json tail"
    g = " " * 12 + json.dumps(GROUP, ensure_ascii=False, indent=4).replace("\n", "\n" + " " * 12)
    t3 = t[: -len(tail)] + "                ]\n            },\n" + g + "\n            ]\n        }\n    ]\n}\n"
    json.loads(t3)
    TJ.write_text(t3, encoding="utf-8")
    print("teachers.json:", len(t3), "bytes")


if __name__ == "__main__":
    main()
