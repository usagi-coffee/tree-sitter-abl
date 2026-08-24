---
name: conflict-fix
description: Diagnose and resolve Tree-sitter grammar conflict errors. Use whenever generation reports an unresolved conflict or when changing precedence, associativity, or conflicts to resolve an ambiguity.
---

# Conflict Fix

Resolve the reported ambiguity without changing which valid ABL programs are accepted or how they are represented in the syntax tree.

## Procedure

1. Read the complete conflict report and locate the earliest token where the derivations diverge.
   - Treat keyword tokens shown in `{...}` as reliable evidence of the terminal sequence reaching the conflicting state.
   - Generated or deduplicated names such as `__browse_body_token7` are real internal symbols and can be useful clues, but their source-looking prefix is not unique provenance. Tree-sitter may reuse the same deduplicated grammar fragment or parse-table path in several contexts, while retaining a name derived from one occurrence.
   - Trace the surrounding named rules and reproduce the reported token sequence. Do not conclude that the conflict belongs to `browse` merely because a reused internal symbol is named `__browse_body_token7`.
2. Reduce the report to representative syntax for every competing derivation. Determine the intended tree for each relevant context, including whether both derivations are valid ABL.
   - Treat corpus trees as regression claims, not ground truth. Verify that an expected tree is semantically correct before using it to choose a resolution.
   - Use independent evidence such as documented syntax, verified compiler behavior, real code, token ownership, and the meaning of surrounding fields. The language reference is useful but not exhaustive.
   - If that evidence shows an existing expected tree is wrong, correct the test. Never change a corpus tree merely to make the suite pass.
3. If the report only exposes a broad parent rule, consider extracting the smallest meaningful conflicting fragment into a hidden named rule. Conflicts can bubble up to a parent after inline fragments are expanded or parse-table paths are shared; isolating the fragment can make precedence, associativity, or a conflict declaration target the actual decision. Preserve tree shape and re-read the next generator report because extraction can move the reduction point or expose a different ambiguity.
4. Classify the ambiguity before choosing a mechanism:
   - A `conflicts` entry is correct only when one concrete input factually supports both competing syntax trees and both interpretations make sense as valid ABL at the same time.
   - Establish that fact with representative syntax and an explanation of both complete trees. A generator conflict, two valid prefixes, or uncertainty about the intended parse is not enough.
   - If this cannot be established with certainty, the ambiguity does not qualify for `conflicts` and must be resolved through rule structure, precedence, or associativity.

## Resolution mechanisms

Tree-sitter provides three distinct mechanisms for resolving a reported LR conflict: precedence, associativity, and a conflict declaration. Evaluate all three independently against the competing parses and choose the one that describes the syntax; do not treat them as a fallback sequence.

- **Precedence** selects one rule over another when one interpretation should win at the decision point. Express the ordering in `grammar/precedences/*.js`.
- **Associativity** selects whether an equal-precedence construct reduces earlier or continues and reduces later. Use `prec.left(...)` or `prec.right(...)` only when that attachment direction matches the intended tree.
- **Conflict** preserves multiple factually valid interpretations for runtime GLR parsing. Add a `conflicts` entry when both parses genuinely make sense at once, regardless of whether precedence was tried first. A conflict declaration is not a fallback for a difficult generator error.

Rule extraction is an optional targeting technique, not a substitute for classifying which of these three mechanisms describes the parse.

## Precedence and associativity

- Never introduce or temporarily use static numeric precedence with `prec(<number>, ...)` or `prec.left/right(<number>, ...)` to resolve or diagnose a conflict, including during optimization experiments.
- Use explicit rule or named-precedence ordering in `grammar/precedences/*.js` whenever the parses are not factually ambiguous.
- Do not use associativity merely because it makes generation succeed. Confirm whether the correct construct must end earlier (`left`) or later (`right`).
- Add purpose and representative-example comments for every precedence or conflict group that is introduced or changed, and explain every non-obvious associativity choice.

## Validation

After changing precedence, associativity, or conflicts, manually parse representative snippets for every competing path and inspect the complete trees. Confirm that the selected interpretation, token ownership, child order, fields, aliases, and associativity make semantic sense; a successful generation or corpus run alone is insufficient.

Add or correct focused corpus coverage for each independently verified path and for the original regression, then run the full test suite. For an optimization, regenerate and compare parser metrics against the last accepted baseline. Reject the fix if it merely moves the misparse to another valid context.
