#!/usr/bin/env python3
"""One-shot patch: add 2 Class 5 MDP example docs to the programmes-mdp leaf."""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve()
TCP = HERE.parents[1] / "src" / "data" / "teacher-contents-primary.json"

DOCS = [{'id': '1kBFprydaL6vtKfATneKmKeKW7yY936I9',
  'title': 'MDP Example - Class 5 Term 2.pdf',
  'modifiedDate': '2026-09-28T05:36:39.861Z',
  'mimeType': 'application/pdf'},
 {'id': '1HHYU4_sKC5BH9vTPSa7Dmox3Il6a7AxL',
  'title': 'MDP Example - Class 5 Types of Fever.docx',
  'modifiedDate': '2026-09-28T05:36:32.885Z',
  'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}]

def main():
    s = TCP.read_text(encoding="utf-8")
    assert '"MDP Example - Class 5' not in s, "already patched"
    anchor = '"programmes-mdp":{"folders":[],"documents":['
    assert s.count(anchor) == 1, "anchor not unique"
    docs_json = ",".join(json.dumps(d, ensure_ascii=False, separators=(",", ":")) for d in DOCS)
    out = s.replace(anchor, anchor + docs_json + ",")
    tcp = json.loads(out)
    assert len(tcp["programmes-mdp"]["documents"]) == 18
    TCP.write_text(out, encoding="utf-8")
    print("programmes-mdp: 18 docs,", len(out), "bytes")

if __name__ == "__main__":
    main()
