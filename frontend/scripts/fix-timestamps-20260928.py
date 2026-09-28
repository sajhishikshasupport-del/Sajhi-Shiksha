#!/usr/bin/env python3
"""One-shot fix: correct 2 modifiedDate transcription slips in
teacher-contents-primary.json (Class 1 EVS Worksheet 5 and Worksheet 4)."""
import json
import pathlib

P = pathlib.Path(__file__).resolve().parents[1] / "src" / "data" / "teacher-contents-primary.json"
s = P.read_text(encoding="utf-8")

FIXES = [
    (
        '1hUJaWrdFOrknrsV7n51T02FiEaNxmXEZ/view","mimeType":"application/msword","modifiedDate":"2026-09-28T00:55:57.989Z"',
        '1hUJaWrdFOrknrsV7n51T02FiEaNxmXEZ/view","mimeType":"application/msword","modifiedDate":"2026-09-28T00:56:03.587Z"',
    ),
    (
        '1JfRrBPP73alNNezBCzw1iW_Ev5ahzBqa/view","mimeType":"application/msword","modifiedDate":"2026-09-28T00:55:52.066Z"',
        '1JfRrBPP73alNNezBCzw1iW_Ev5ahzBqa/view","mimeType":"application/msword","modifiedDate":"2026-09-28T00:55:57.989Z"',
    ),
]

for old, new in FIXES:
    count = s.count(old)
    assert count == 1, "anchor found %d times (expected 1): %s..." % (count, old[:60])
    s = s.replace(old, new)

json.loads(s)  # sanity: still valid JSON
P.write_text(s, encoding="utf-8")
print("fixed 2 timestamps; valid JSON; %d bytes" % len(s))
