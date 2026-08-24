---
name: conflict-fix
description: Diagnose and resolve Tree-sitter grammar conflict errors. Use whenever generation reports an unresolved conflict or when changing precedences or conflicts to resolve an ambiguity.
---

# Conflict Fix

Resolve the reported ambiguity without changing which valid ABL programs are accepted or how they are represented in the syntax tree.

## Procedure

1. Read the complete conflict report and locate the earliest token where the derivations diverge.
   - Treat keyword tokens shown in `{...}` as reliable evidence of the terminal sequence reaching the conflicting state.
   - Generated or deduplicated names such as `__browse_body_token7` are real internal symbols and can be useful clues, but their source-looking prefix is not unique provenance. Tree-sitter may reuse the same deduplicated grammar fragment or parse-table path in several contexts, while retaining a name derived from one occurrence.
   - Trace the surrounding named rules and reproduce the reported token sequence. Do not conclude that the conflict belongs to `browse` merely because a reused internal symbol is named `__browse_body_token7`.
2. Reduce the report to representative syntax for every competing derivation. Determine the intended tree for each relevant context, including whether both derivations are valid ABL.
3. Classify the ambiguity before choosing a mechanism:
   - A `conflicts` entry is correct only when one concrete input factually supports both competing syntax trees and both interpretations make sense as valid ABL at the same time.
   - Establish that fact with representative syntax and an explanation of both complete trees. A generator conflict, two valid prefixes, or uncertainty about the intended parse is not enough.
   - If this cannot be established with certainty, the ambiguity does not qualify for `conflicts` and must be resolved through rule structure or `grammar/precedences/*.js`.
4. When both parses are factually valid at once, add the corresponding `conflicts` entry. This is not a fallback after precedence fails; it describes a real property of the language.
5. Otherwise, correct an accidentally indistinguishable rule or add an explicit ordering in `grammar/precedences/*.js`. Conflicts should be rare because genuinely simultaneous valid parses are rare, not because they are a last-resort mechanism.

## Precedence diagnosis

- Never introduce or temporarily use static numeric precedence with `prec(<number>, ...)` or `prec.left/right(<number>, ...)` to resolve or diagnose a conflict, including during optimization experiments.
- Use explicit rule or named-precedence ordering in `grammar/precedences/*.js` whenever the parses are not factually ambiguous.
- Do not treat precedence tuning as equivalent to adding a `conflicts` entry: precedence chooses an interpretation, while a conflict preserves multiple interpretations for runtime resolution.
- Add purpose and representative-example comments for every precedence or conflict group that is introduced or changed.

## Validation

After changing precedence, manually parse representative snippets for every competing path and inspect the complete trees. Confirm that the selected interpretation, child order, fields, aliases, and associativity make semantic sense; a successful generation or corpus run alone is insufficient.

Add focused corpus coverage for each intended path and for the original regression, then run the full test suite. For an optimization, regenerate and compare parser metrics against the last accepted baseline. Reject the fix if it merely moves the misparse to another valid context.
