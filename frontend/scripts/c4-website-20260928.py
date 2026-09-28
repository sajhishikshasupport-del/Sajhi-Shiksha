#!/usr/bin/env python3
"""One-shot patch: add 4 Class 4 MDP example docs to the programmes-mdp leaf."""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve()
TCP = HERE.parents[1] / "src" / "data" / "teacher-contents-primary.json"

DOCS = [{'id': '1SzJeDYBpNsO4LIbI4hdbqneZ4nqzcA4Q',
  'title': 'MDP Example - Class 4 Term 2.pdf',
  'modifiedDate': '2026-09-28T05:23:35.015Z',
  'mimeType': 'application/pdf'},
 {'id': '1r8Qht02sGkt47oVYaM5cWXuWccdtylle',
  'title': 'MDP Example - Class 4 Food (2).docx',
  'modifiedDate': '2026-09-28T05:23:28.137Z',
  'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'},
 {'id': '1WeaPHz194KeVVkeK5HQdQPQojHlNZiSb',
  'title': 'MDP Example - Class 4 Food and Nutrition.pdf',
  'modifiedDate': '2026-09-28T05:23:21.277Z',
  'mimeType': 'application/pdf'},
 {'id': '1Qe8IkkVTcygqSTyF2HLXTRejGodn9jFX',
  'title': 'MDP Example - Class 4 Food (KV 1STC Jabalpur).docx',
  'modifiedDate': '2026-09-28T05:23:14.688Z',
  'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}]

def main():
    s = TCP.read_text(encoding="utf-8")
    assert '"MDP Example - Class 4' not in s, "already patched"
    anchor = '"programmes-mdp":{"folders":[],"documents":['
    assert s.count(anchor) == 1, "anchor not unique"
    docs_json = ",".join(json.dumps(d, ensure_ascii=False, separators=(",", ":")) for d in DOCS)
    out = s.replace(anchor, anchor + docs_json + ",")
    tcp = json.loads(out)
    assert len(tcp["programmes-mdp"]["documents"]) == 16
    TCP.write_text(out, encoding="utf-8")
    print("programmes-mdp: 16 docs,", len(out), "bytes")

if __name__ == "__main__":
    main()
