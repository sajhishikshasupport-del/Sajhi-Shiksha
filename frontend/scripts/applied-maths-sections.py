#!/usr/bin/env python3
"""One-shot patch: separate Class 11/12 Applied Maths sections in TeacherShared.tsx.

Applied Maths documents (question papers / question banks) get their own class
sections after the regular ones. Derived from the document title so files added
by the nightly Drive sync group automatically.
Idempotent: skips cleanly if the patch is already applied.
"""
import sys
from pathlib import Path

TARGET = Path("frontend/src/features/teachers/components/TeacherShared.tsx")
src = TARGET.read_text(encoding="utf-8")

if "effectiveClassName" in src:
    print("Patch already applied - nothing to do.")
    sys.exit(0)

def replace_once(s: str, old: str, new: str) -> str:
    count = s.count(old)
    assert count == 1, f"Expected exactly 1 occurrence, found {count}:\n{old[:120]}"
    return s.replace(old, new, 1)

# 1. CLASS_ORDER: add the two Applied Maths labels at the end
src = replace_once(
    src,
    "const CLASS_ORDER = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];",
    "const CLASS_ORDER = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Class 11 Applied Maths', 'Class 12 Applied Maths'];",
)

# 2. effectiveClassName helper after classSlug
src = replace_once(
    src,
    "const classSlug = (name: string): string => name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();",
    "const classSlug = (name: string): string => name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();\n\n"
    "// Applied Maths documents (question papers / question banks) get their own class\n"
    "// sections after the regular ones. Derived from the title so that files added by the\n"
    "// nightly Drive sync (\"...Applied Maths...\" / \"12_Appliedmath_...\") group automatically.\n"
    "const APPLIED_MATHS_TITLE = /applied[\\s_-]*math/i;\n"
    "const effectiveClassName = (doc: DriveDocument): string | null => {\n"
    "    const isApplied = APPLIED_MATHS_TITLE.test(doc.title);\n"
    "    if (doc.className) return isApplied ? `${doc.className} Applied Maths` : doc.className;\n"
    "    if (!isApplied) return null;\n"
    "    const m = doc.title.match(/(?:^|\\D)(6|7|8|9|10|11|12)(?:\\D|$)/);\n"
    "    return `Class ${m ? m[1] : '12'} Applied Maths`;\n"
    "};",
)

# 3. DocCard: derive the class label once + use it in the analytics event
src = replace_once(
    src,
    "const DocCard: React.FC<{ doc: DriveDocument; showClass?: boolean }> = ({ doc, showClass }) => {\n"
    "    const openDoc = () => {",
    "const DocCard: React.FC<{ doc: DriveDocument; showClass?: boolean }> = ({ doc, showClass }) => {\n"
    "    const classLabel = showClass ? effectiveClassName(doc) : null;\n"
    "    const openDoc = () => {",
)
src = replace_once(
    src,
    "            document_class: doc.className ?? null,",
    "            document_class: effectiveClassName(doc),",
)

# 4. DocCard chip: show the derived (Applied) label
src = replace_once(
    src,
    "            {showClass && doc.className && (\n"
    "                <Chip\n"
    "                    label={doc.className}",
    "            {classLabel && (\n"
    "                <Chip\n"
    "                    label={classLabel}",
)

# 5. DocumentList grouping: group by the derived class name
src = replace_once(
    src,
    "        const key = doc.className || 'Other';",
    "        const key = effectiveClassName(doc) || 'Other';",
)

TARGET.write_text(src, encoding="utf-8")
print("Patch applied successfully.")
