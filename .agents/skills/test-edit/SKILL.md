---
name: test-edit
description: Add or edit corpus tests. Use when changing files under test/corpus or adding coverage for grammar behavior.
---

# Test Edit

## Coverage

Add thorough corpus coverage for new grammar constructs and regressions.

## Reference alignment

Keep tested syntax and expected behavior aligned with the ABL language reference where
it documents them. Do not trust the reference blindly or treat it as exhaustive: ABL
has substantial undocumented behavior, so preserve verified compiler behavior and
existing corpus evidence where the reference is silent or incomplete.

## Test integrity

Do not remove, weaken, or rewrite a test merely to make the suite pass. Fix the grammar
instead. Ask before removing a test whose syntax appears unsupported or illegal.

## Parse-tree validity

Treat every `(ERROR)` and `(MISSING)` node as a parsing failure that must be fixed.
Never add an `(ERROR)` node to an expected syntax tree.
Nodes like `terminator`, `terminator_dot` or rules prefixed with `_` (unless aliased) should never be visible in the syntax tree output.
