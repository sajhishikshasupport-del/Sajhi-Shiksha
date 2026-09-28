#!/usr/bin/env python3
"""One-shot patch: add CMP / FLN / Cub Bulbul / Toy Based Pedagogy leaves + 37 misc docs."""
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
    "programmes-cmp": [
        "1hRW7dhVeLiSRc5px36aqrR5C9dDNhRNk|CMP Newsletter Example - 2 (Word).docx|2026-09-28T05:58:12.636Z|D",
        "1xIf4Ff8rR4YwHOufwTbelClrifAy97HA|CMP Newsletter Example - First Quarter.pdf|2026-09-28T05:58:12.421Z|P",
        "1syxCeZ5m60Pbh5VgtWGz3oDmDTbeEilH|CMP Newsletter Example - KV Uttarkashi.pdf|2026-09-28T05:58:06.948Z|T",
        "1nUlwn3s_dFBjIPYDFQcJWkDkuGUxtr4b|CMP Newsletter Example - KV STA.pdf|2026-09-28T05:58:06.778Z|P",
        "11jkOnLJ9SxyegdSfCis-HG58BcXXiV3k|CMP Newsletter Example - KV Rewa.pdf|2026-09-28T05:58:05.929Z|P",
        "1ctKDe_il3OEU8ngrwNXdF3L9mRY8GIvG|CMP Newsletter Example - KV Panna.pdf|2026-09-28T05:58:05.503Z|P",
        "1g_9PLLNfCCHDroi5rKM0WxfKQ7jBeJq0|CMP Newsletter Example - KV NKJ.pdf|2026-09-28T05:58:04.690Z|P",
        "1LCCBRHmLRFuyrHxpKb3hRRQgKDeuOz5n|CMP Newsletter Example - KV FCI.pdf|2026-09-28T05:58:04.576Z|P",
        "1o24dpU9Df76cjdVxqX0_My0pgiDsPjxX|CMP Newsletter Example - KV Chitrakoot.pdf|2026-09-28T05:57:59.709Z|P",
        "1nhbu5SFDhO_WZscj-WflnBs7z0jhyi6a|CMP Newsletter Example - KV AFS.pdf|2026-09-28T05:57:59.659Z|P",
        "1ybk3vs6Pd7HhMUfLV5QRg1npaf4PkM8e|CMP Newsletter Example - KV Loktak.docx|2026-09-28T05:57:59.567Z|D",
        "1JNaUlN_R_zJh7XQS0R9NkMxLgidDGG6c|CMP Newsletter Example - KV Karimnagar.pdf|2026-09-28T05:57:58.343Z|P",
        "1GverHzUoy0cTph4UFZ9chEkU1EHV61jv|CMP Newsletter Example - KV Churachandpur.pdf|2026-09-28T05:57:57.942Z|P",
        "1XIRB67B4m83L2N1Xd29w68XQxUL9WgIM|CMP - Funday Activities.pdf|2026-09-28T05:57:56.865Z|P",
        "1Uw5Xad8Rz1FmHMYS2p6fM1iVrf3NLIgl|CMP - Guidelines to Prepare Time Table.ppt|2026-09-28T05:57:52.069Z|application/vnd.ms-powerpoint",
        "1xO4FVZIDB0XhLjnTTPwMB7sPwbnLZS84|CMP Report - Example.docx|2026-09-28T05:57:51.654Z|D",
        "1QNA3jLu5vpnNSAfW6rqmOoOI1LzyhjAU|CMP - Checklist.docx|2026-09-28T05:57:51.618Z|D",
        "1SAZ7Neoy_RB9e-TJw9NqELPWyyQSjqTQ|Time Table Framing, CCA, Sports & Games.pptx|2026-09-28T05:57:51.483Z|T",
        "127m5WnqRFJXiuEPFcBU2iEzwNk3ZTKdb|CMP - Training Manual, Holistic Assessment.pdf|2026-09-28T05:57:51.120Z|P",
        "1BSe2k9nvyCL5FhYChKP0lRR7TgUVMqp5|CMP - Time Table Module (KVS).pdf|2026-09-28T05:57:51.046Z|P",
    ],
    "programmes-fln": [
        "1c4GPU_9EUDXlgcVE7mUbfZbfSDJXfgb_|FLN - PPT 4.pdf|2026-09-28T06:04:38.434Z|T",
        "1In-jLglOUf_ACOUxFLSSAr6lIYZbGmpA|FLN - Possibilities for Further Improvement.docx|2026-09-28T05:59:33.590Z|D",
        "1L0wsUi7HZmcJvU6q_P7W0z401wdzZfzQ|NIPUN - Resource 1.pdf|2026-09-28T05:59:29.810Z|P",
        "1MACdPQvbEPXhT3sRf88WUyweavAKbNRl|NIPUN - Resource 2.pdf|2026-09-28T05:59:27.447Z|P",
        "1Gj6zfe5ytnVw5zQASaNxcz1v3VKBxLOP|Vidya Pravesh - Goal 2.pdf|2026-09-28T05:59:27.237Z|P",
        "1CuhLbB3Es7hOVdHJqJSVCN71lM-L_Vzb|Vidya Pravesh - Goal 3.pdf|2026-09-28T05:59:26.946Z|P",
        "1K8y9JGyX-UgcugYmfInVVsH1Ndu-9aKi|Vidya Pravesh - Goal 1 Homework.pdf|2026-09-28T05:59:26.635Z|P",
        "17Bto5mowqQAVb087EhooKoKGcncQczc5|Numeracy Compendium - Grade 3 (Hindi).pdf|2026-09-28T05:59:26.533Z|P",
        "1nSZN_GsHbWwz2nvzDop3KdE2brPF4vX1|Teacher Activity Checklist.pdf|2026-09-28T05:59:23.258Z|P",
        "15e-q0Uq117f88RRY3cFOVQ9xeiEfI21r|Numeracy Compendium - Grade 2 (Hindi).pdf|2026-09-28T05:59:20.722Z|P",
        "1mDnfpnmnRSSEHlOBs6AIQrHzl80oQImK|Numeracy Compendium - Grade 1 (Hindi).pdf|2026-09-28T05:59:20.638Z|P",
        "1GemRQbppSgq97uhr9T5DlFL4UpikcbWh|Nipun Bharat Mission & FLN.pdf|2026-09-28T05:59:19.689Z|P",
        "1ns1eh45Edc7PRg2HxCmcFmp_P-kZMS4j|Nipun Bharat Mission & FLN.pptx|2026-09-28T05:59:19.270Z|T",
        "1NP459MRxazVd_AAQCabjxpAJYu_yKT_l|NIPUN Targets - All Classes.pdf|2026-09-28T05:59:15.925Z|P",
        "1W06-jEChBWddfbraUSw6pz2LR2cXThoS|NIPUN Targets - Numeracy B3-C3.pdf|2026-09-28T05:59:15.884Z|P",
        "1NKNDKpjxaXWIzKrV5I1KBwfeqGb5llzu|NIPUN Targets - Literacy & Numeracy B3-C3.pdf|2026-09-28T05:59:12.626Z|P",
        "14yzhCKckjjjrmPKSOrZY1c4g7C9c9pT-|NIPUN - Guidelines, Pledge & Resources.pdf|2026-09-28T05:59:12.594Z|P",
        "1AUedwNYWoH4bXwiu4W7D7ZEXfC3PbFDV|NIPUN FLN - Simplified.pdf|2026-09-28T05:59:12.173Z|P",
        "1Pn1QswtJvYGNDpgZCjj__C38bmp6kFLY|NIPUN - Document.pdf|2026-09-28T05:59:11.984Z|P",
        "10cuimkCZIf97ObHE3LIVhpnvormQds9P|NIPUN Bharat Mission.pdf|2026-09-28T05:59:08.926Z|P",
        "1ZJZvSkMp4OdxfquSyzeja4a6k1UVqBO_|NIPUN - Assessment of Classroom Management.doc|2026-09-28T05:59:08.601Z|W",
        "1zGGqK8lCa2xa5G-V7_JBtVPDFoglHpSM|Literacy Compendium - Grade 2.pdf|2026-09-28T05:59:06.621Z|P",
        "1dXKAeHDkVS4sAk4bZmJGGFRbDt3tuEp7|Literacy Compendium - Grade 3.pdf|2026-09-28T05:59:06.501Z|P",
        "1TJqaZAFhJ2Lwug0vMNFhlL5gKnazr-Mh|Literacy Compendium - Grade 1.pdf|2026-09-28T05:59:05.712Z|P",
        "1RlMvtpURh0p10aA8s738hngzdCOOdval|FLN Worksheets - Class 2 English.pdf|2026-09-28T05:59:05.026Z|D",
        "1ZgP_vGErtw1VXDVoO-XDTcdbx9kmYRKB|FLN Worksheets - Class 1 Maths.docx|2026-09-28T05:59:01.333Z|D",
        "1sZ_L0tr1WcTtTESfh4IwlJLuQNk59D4i|FLN Worksheets - Class 1 Hindi.pdf|2026-09-28T05:59:01.208Z|D",
        "1SvaXVLQXhFfu2tlNqDCmHFu61Mdsmxcz|FLN Worksheets - Class 1 EVS.docx|2026-09-28T05:58:58.917Z|D",
        "1DfnZyNu91ybJ2TkzL-v6qEQMKGeVFVM3|FLN Worksheets - Class 3.pdf|2026-09-28T05:58:58.902Z|P",
        "1l4rASguxHGbX5mDbdH9iPPxax5rcDgEZ|FLN Rubrics - Class 3 Entry Level.pdf|2026-09-28T05:58:58.074Z|D",
        "1M6VIylsDZRIwHIeifafhAKVnZELsRp03|FLN Rubrics - Class 2 Final.pdf|2026-09-28T05:58:56.981Z|P",
        "1PCrkJ3OuogsEaNzx1DT5JY0XjWdORBub|FLN Rubrics - Class 2 Entry Level.pdf|2026-09-28T05:58:53.450Z|D",
        "1UEx3_FQwY9GnrhUFHpmN_0rLWmb6I8gV|FLN Rubrics - Balvatika 3 Monthly Sheet.pdf|2026-09-28T05:58:52.885Z|P",
        "1UzvUbis62SJ2vnkGr2wJLAq6JWayUna_|FLN - PPT 5.pdf|2026-09-28T05:58:52.080Z|P",
        "1Ln3ycjISllwKbEF3d4Vj9Jp52brzEAP0|FLN - PPT 3.pdf|2026-09-28T05:58:51.228Z|P",
        "12pesncL8vF2_F-__ZbXbxOdWu-oLEtk3|FLN - PPT 2.pptx|2026-09-28T05:58:51.121Z|T",
        "1ypfuyjGb1frcMkJzPtzW45K9S6r0IAw5|FLN - PPT 1.pptx|2026-09-28T05:58:49.860Z|T",
        "1NEfR6pOdqjfs6w-RqqnjtWyf6ccv9tqF|FLN and NIPUN under NEP 2020.pdf|2026-09-28T05:58:46.191Z|P",
        "158UskO4_PatIFBJcG7BfBw8oJXAzIBtG|FLN Assessment - Literacy.xlsx|2026-09-28T05:58:44.694Z|X",
        "1EMxGL6e6B7Ja5QNa-fV3xemWP8HMEPWi|FLN Assessment - Hindi Classes 1, 2 & 3.pdf|2026-09-28T05:58:44.641Z|P",
        "1bOW91j0Y08G_kS1OygCZHJf2kLmq74PV|FLN - Modules.pdf|2026-09-28T05:58:44.245Z|P",
        "1XOoOGZZcMgdJtpRsIG78sZghd4mzHme7|FLN Assessment - Class 2.xlsx|2026-09-28T05:58:42.451Z|X",
        "1Acwwf81f590Lv9CO5fusQEHjQ9OZeZKn|FLN Assessment - Classes 1, 2 & 3.xlsx|2026-09-28T05:58:40.922Z|X",
        "1RIiKBcLqTsJ23VWCr9iFYvvlBOl4DmR9|FLN Activities - Example (KV Tehri).pdf|2026-09-28T05:58:37.126Z|T",
        "1hr2VLZHzBdBGXdiljlll9eNrPzsv3Gpg|FLN Activities - Class 2.docx|2026-09-28T05:58:36.959Z|D",
        "1L1v1xXik71CfcRUkxDifieQDcJzeyELS|FLN Activities - Class 3.docx|2026-09-28T05:58:36.819Z|D",
        "1wlpXCfRniGI6kFCM7YTckoKUSfJ58w6a|FLN Activities - Class 1.docx|2026-09-28T05:58:36.404Z|D",
        "1Jq1H2hib3qm4qmLxfo3bRIUJ1Rv1tbnY|FLN Workshop Resource.pdf|2026-09-28T05:58:36.316Z|P",
        "13tKmDKjL3nlllcPoF78AcHc_KA3aSihC|FLN Workshop Resource 2.pdf|2026-09-28T05:58:35.020Z|P",
        "1MqNfa2MYAmMNDB07dlh_tKCGIdsiOos3|FLN Targets - Class 3 Exit Level.pdf|2026-09-28T05:58:29.811Z|P",
        "1Om0ABe-0v9RiZcdj8-ergCV3_ZGcR7XD|FLN Assessment - Format 1A.xlsx|2026-09-28T05:58:29.598Z|X",
        "1hkRASlVylWXOjEUVCcsYrOb_0_rqtM9r|FLN - Academic Approaches to Improve.pdf|2026-09-28T05:58:29.162Z|D",
    ],
    "programmes-cub": [
        "1ALV7KndD0hzWRfq2th-UGcxGHIB19z44|Cub Bulbul Utsav - Overview.docx|2026-09-28T05:58:22.617Z|D",
        "1iff_sghl-6kCs2q48EdFEWuBIPBKklWd|Cub Bulbul Utsav - Schedule Example.docx|2026-09-28T05:58:22.166Z|D",
        "1hTiF9eWMNdVmr2Rp8Sp0qvnHIxLUJ4Uy|Cub Bulbul - All Faith Prayer Songs.pdf|2026-09-28T05:58:21.865Z|P",
        "1_DBs2IPeP9VIhRf9e3WQHNvthaEc1THx|Cub Bulbul Logbook.pdf|2026-09-28T05:58:21.454Z|P",
        "1eZS98AfJEoY_DTbmvFIyqlik4X7XxaIN|Cub Bulbul Logbook Example.pdf|2026-09-28T05:58:18.402Z|P",
        "1I4dQm7a5GfDowIQBOfN5eXQlZPRbKuQh|Cub Bulbul Logbook Example - Handwritten.pdf|2026-09-28T05:58:14.617Z|P",
        "1wRQHEH_Z9OsrJmqt4ay_c5CM25gj6oly|Cub Bulbul Logbook Example - Mumbai Region.pdf|2026-09-28T05:58:14.433Z|P",
        "13R6UGN2ExPGc1WrNKh8joIPLTkxt2nNj|Cub Bulbul Logbook Example - Kolkata Region.pdf|2026-09-28T05:58:14.102Z|P",
        "1VuOHOH3oz-YU3lI09JYb8ozuZIHfAwTC|Cub Bulbul - APRO III Complete Book.pdf|2026-09-28T05:58:13.436Z|P",
    ],
    "programmes-toy": [
        "1ubpJCd2XfrK_wM8vmZvDSWjQBvCKffZZ|Toy Based Pedagogy - PPT 3.pdf|2026-09-28T05:58:28.968Z|T",
        "1qKRS2zdhnKb8bJRP-CAzXZQXogB6gizU|Toy Based Pedagogy - PPT 2.pdf|2026-09-28T05:58:28.345Z|T",
        "1oIu8fHkDyUfp1pbYMXgCdu8X5zN0NK0z|Toy Based Pedagogy - PPT 1.pdf|2026-09-28T05:58:26.734Z|P",
        "10E0y61wJc6aOrN_35b9DvIFOYsALVRqF|Attributes of a Good Toy.pptx|2026-09-28T05:58:22.313Z|T",
    ],
    "programmes-misc-ADD": [
        "1tKtuu0Sqm8TIRSdYZT6uaLvrb-cYZ1q2|Action Research Document - HM.docx|2026-09-28T06:00:45.704Z|D",
        "1EXcLXr9zV-CygiRfypfCOzUgvxXl6PPw|NEP 2020 - Overview (Hindi).pptx|2026-09-28T06:00:41.011Z|T",
        "1ZrrcSytaL_XZ8A9wRxiVMc5i7n6aWD6U|Competency Based Assessment - Training.pdf|2026-09-28T06:00:40.895Z|P",
        "1YzeOuy904rqGZTKXZPqWGFYlx3QF6yUo|Rajbhasha.pptx|2026-09-28T06:00:32.299Z|T",
        "1xsorkl0byoCSOgpTrn5mQZPSa7kXihnK|TLO - CBSE Secondary.pdf|2026-09-28T06:00:28.828Z|P",
        "1ioBu_eDPxfilah-ZlpMnJjY6utJCs0Py|TLO - All Primary Classes.pdf|2026-09-28T06:00:23.134Z|P",
        "1kgvd6uf9kWiTWhmDh21gvbe90jrTWqTN|Holistic Progress Card - Classes 1 & 2.pdf|2026-09-28T06:00:22.952Z|P",
        "1sUPoNble4e5UQQNl4GU2iy8leuo7q6nq|TLO - CBSE.pdf|2026-09-28T06:00:20.762Z|P",
        "1GzQZbHs1WSYhnDo5DRzMmIX_Rdkk9sM7|Activity Book - Developing Sense of History.pdf|2026-09-28T06:00:12.165Z|P",
        "1v6GLxNBdnNl3ITXMTChobttbyrMuk-Tr|Teaching Language Skills Through Games.pdf|2026-09-28T06:00:08.375Z|P",
        "1bPnILVTdKQFLos4PVtPFKNpxLYMOx1EM|Activity Book for Balvatika.pdf|2026-09-28T06:00:05.941Z|P",
        "1yifqKPsmgvHCUB5D068yDj8ZjUkNPsw6|eBook of Folk Tales.pdf|2026-09-28T06:00:05.096Z|P",
        "1Li3v3b9AdGnfzznfYodfuMnIbjIsFWZT|BALA - Building as Learning Aid.pptx|2026-09-28T06:00:03.806Z|T",
        "10Nk2teSAQbSu78MvIvbzTH5rQRdNAr5J|TLM - Guidelines.docx|2026-09-28T06:00:03.691Z|D",
        "1E2xfre1RB8xwuH8L2YnFl36Nq3uLNj_0|TLM - Matter.docx|2026-09-28T05:59:58.178Z|D",
        "1jC_Q-J-dJA4g486FACtak-zl__2qHpyh|TARA Training Material for KVS Teachers.pptx|2026-09-28T05:59:57.127Z|T",
        "1nyKFakSEpScwS1EfSVt2cabodWISkV_3|POCSO Act 2012.pdf|2026-09-28T05:59:56.527Z|P",
        "1LTMj3_z2ag9nbFKycDCk-PkS4_qW_hlG|POCSO Act - Training 2024.pdf|2026-09-28T05:59:55.891Z|P",
        "1_iJgwa0Vys26qMm4TCM65Sbcp2XB5LNK|Manual - School Safety and Security.pptx|2026-09-28T05:59:55.768Z|T",
        "1q4MHobTJzlGlZ4s-XhMSgJYAFPFeL5eP|Child Rights and NCPCR - Training 2024.pdf|2026-09-28T05:59:55.722Z|P",
        "12fkeAOmY97n1Ujqj4v6uoV6zaHk5DNdV|Checklist - Safety and Security of Schools.pdf|2026-09-28T05:59:50.870Z|P",
        "1-GAWSQp2Z2dMALEgDgRggcQ_XjuSCX6C|Craft Syllabi.docx|2026-09-28T05:59:49.056Z|D",
        "1oZ1ZXWNr9EtgNnKJcgAtcFktuLBpuaTI|Curricular Expectations - Hindi.docx|2026-09-28T05:59:48.875Z|D",
        "1D-CpzyDKdDjpbNrtVb20m38oo14SxjDf|Developmental Characteristics of Children Aged 4-6 Years.docx|2026-09-28T05:59:48.831Z|D",
        "1I9qyuMlP7oa_bn4l9wCi_2NLsfQ1apVT|Curricular Expectations - English.docx|2026-09-28T05:59:48.483Z|D",
        "1xoNrpvGQhxjhS-L-TheeCaKjLNdVP7uo|Draft Learning Outcomes.pdf|2026-09-28T05:59:48.334Z|P",
        "1usf6q9BUp7LtJjoASu8qBDPc1NjWg2p5|ECCE - Early Childhood Care and Education.pdf|2026-09-28T05:59:43.635Z|P",
        "1E6ao0sSoGzI1LTITsGDeNJ88OOVRCh5-|Pedagogical Shift Suggested by NEP 2020.pptx|2026-09-28T05:59:41.747Z|T",
        "1MUZ12IRrJreaQrxKe84NxnrATjhMMma_|Learning Outcomes at Elementary Stage (NCERT).pdf|2026-09-28T05:59:41.340Z|P",
        "1IoT_xldsKJpuPX-ezc5nztDNCEIbKgeV|Learning Outcomes - CBSE.pdf|2026-09-28T05:59:41.329Z|P",
        "1Vid_ft3VRdVDE5-fRujKBkV6ceomyguU|Learning Outcome Based Lesson Planning.pdf|2026-09-28T05:59:41.060Z|P",
        "1Nsv-10QGJ587LJJ812OMQ6XcuXFCc6y-|Integration of ICT in Teaching & Administration.pptx|2026-09-28T05:59:40.638Z|T",
        "1BtLbvgPuO1NPwRdD53Q7dE5WobAK8opH|Integration of ICT in Teaching & Administration.pdf|2026-09-28T05:59:36.707Z|P",
        "1mfroxZiq5o-gnvJEVK2hzUcpRM-Pcity|Holistic Assessment.pdf|2026-09-28T05:59:34.499Z|P",
        "1HTR6-j4MaKhJ5cSplM66LC3J5D5E38Ba|CPD - Continuous Professional Development.pdf|2026-09-28T05:59:33.885Z|P",
        "1d4XnGtLM4ko_KFEfc-ljH0ga3ivez7Ne|Experiential Learning.pdf|2026-09-28T05:59:33.672Z|P",
        "1uFm47vqAkmtECehWxBFaS5wo38vFS8tn|CPD - Guidelines.pdf|2026-09-28T05:59:33.601Z|P",
    ],
}

LEAVES = [{'id': 'programmes-cmp',
  'title': 'Common Minimum Programme (CMP)',
  'description': 'CMP guidelines, training material and newsletter examples',
  'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1YV_qLv0CZrcnEJTocqSP0ZZ5GxueJrwx#list'},
 {'id': 'programmes-fln',
  'title': 'FLN / NIPUN Bharat',
  'description': 'NIPUN Bharat mission resources, targets, rubrics and assessments',
  'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1FeULgFG8Rw4mJQ2_CIdS4OTxzsgy6kvT#list'},
 {'id': 'programmes-cub',
  'title': 'Cub Bulbul (Scouts & Guides)',
  'description': 'APRO book, logbook examples and Utsav resources for Cub Bulbul section',
  'driveUrl': 'https://drive.google.com/embeddedfolderview?id=1VYD_eb_h2QaNcf62e1rvsi3634690l5F#list'},
 {'id': 'programmes-toy',
  'title': 'Toy Based Pedagogy',
  'description': 'Toy Based Pedagogy training presentations (NEP 2020)',
  'driveUrl': 'https://drive.google.com/embeddedfolderview?id=15MnfWOvrGSlBcVYB0D55VWtsWwuqSOEH#list'}]


def docs_of(rows):
    docs = []
    for row in rows:
        parts = row.split("|")
        fid, title, date, code = parts[0], parts[1], parts[2], parts[3]
        cls = parts[4] if len(parts) > 4 else "General"
        mime = MIME.get(code, code)
        docs.append({"id": fid, "title": title,
                     "link": "https://drive.google.com/file/d/%s/view" % fid,
                     "mimeType": mime, "modifiedDate": date, "className": cls})
    docs.sort(key=lambda d: d["modifiedDate"], reverse=True)
    return docs


def main():
    # ---- teacher-contents-primary.json ----
    s = TCP.read_text(encoding="utf-8")
    assert '"programmes-cmp"' not in s, "already patched"
    new_leaves = {}
    for leaf in ("programmes-cmp", "programmes-fln", "programmes-cub", "programmes-toy"):
        new_leaves[leaf] = {"folders": [], "documents": docs_of(DATA[leaf])}
    insert = "," + json.dumps(new_leaves, ensure_ascii=False, separators=(",", ":"))[1:-1]
    idx = s.rfind("}")
    out = s[:idx] + insert + s[idx:]
    # misc additions at front of its documents array
    anchor = '"programmes-misc":{"folders":[],"documents":['
    assert out.count(anchor) == 1, "misc anchor not unique"
    misc_docs = docs_of(DATA["programmes-misc-ADD"])
    docs_json = ",".join(json.dumps(d, ensure_ascii=False, separators=(",", ":")) for d in misc_docs)
    out = out.replace(anchor, anchor + docs_json + ",")
    tcp = json.loads(out)
    assert len(tcp["programmes-misc"]["documents"]) == 39
    assert len(tcp["programmes-fln"]["documents"]) == 52
    TCP.write_text(out, encoding="utf-8")
    print("tcp:", len(out), "bytes")

    # ---- teachers.json ----
    t = TJ.read_text(encoding="utf-8")
    assert '"programmes-cmp"' not in t, "already patched"
    tail = "                    }\n                ]\n            }\n            ]\n        }\n    ]\n}\n"
    assert t.endswith(tail), "unexpected teachers.json tail"
    blocks = []
    for leaf in LEAVES:
        blocks.append(" " * 20 + json.dumps(leaf, ensure_ascii=False, indent=4).replace("\n", "\n" + " " * 20))
    t3 = t[: -len(tail)] + "                    },\n" + ",\n".join(blocks) + "\n                ]\n            }\n            ]\n        }\n    ]\n}\n"
    json.loads(t3)
    TJ.write_text(t3, encoding="utf-8")
    print("teachers.json:", len(t3), "bytes")


if __name__ == "__main__":
    main()
