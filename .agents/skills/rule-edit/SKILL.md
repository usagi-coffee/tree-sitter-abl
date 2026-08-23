---
name: rule-edit
description: Edit Tree-sitter ABL grammar rules. Use when changing grammar.js or rules under grammar, including rule naming, conflicts, precedence, aliases, fields, and syntax-tree shape.
---

# Rule Edit

## Rule naming

We have three types of rule:

```js
// This is a public rule visible in the AST.
rule: ($) => ...,

// This is a shared rule (single underscore), it should live in grammar/core/common.js (non-core) or grammar.js (core).
_shared_rule: ($) => ...,

// This is a private rule (double underscore, statement prefix), it should live in <my-statement>.js
// This rule should never be reused between files unless it's made into a shared rule and moved into grammar/core/common.js or grammar.js
__my_statement_rule: ($) => ...,
```

- In `grammar/**/<name>.js`, private helpers should be named `__<name>_*` using the file name with `-` converted to `_`, e.g. `input-through.js` -> `__input_through_*`.
- Keep grammar rule naming as close as possible to the language reference terminology (statement names, phrase names, and option names) unless there is a clear technical reason not to.
- Prefer not using `_list` suffix for rules e.g `_format_label_list` should be `_format_labels`.
- Do not use e.g `no_labels_option` as an alias, just use `no_labels` to keep it clean, avoid `_option` suffix.
- The exported top-level rule should stay aligned with the statement name, e.g. `variable.js` should expose `variable_definition` and keep its internal helpers under `__variable_*`.
- We do not reuse private rules between files but if reusing improves state counts it's allowed to convert a private rule into a shared rule and move it to `grammar.js`.
- All statement-related modifiers, phrases, tunings that are not already part of core should be locally defined as `__<statement>_<rule>` rule and aliased to `$.<rule>`.
- Use `bun run audit:naming` to find both local prefix mismatches and cross-file usage of private `__...` rules.


## Keywords

- Prefer `kw` for keywords in place of `token(/keyword/i)`, when the syntax supports partial keyword like `DEFINE` can be `DEF`, `DEFI`, `DEFIN` and `DEFINE` please use `kw("DEFINE", { offset: 3 })`, for scenario where it can be longer do alias e.g `kw("FIELDS", { alias: 'FIELD', offset: 5 })`.

## Formatting

- Use compact rule formatting: keep one-line rules adjacent with no blank lines, avoid blank lines between consecutive one-line rules.
- Don't do unnecessary comments like `// something is above`.

## Conflicts

- Always prefer solving conflicts using `precedences` over using `prec(<number>,`.
- Prefer resolving ambiguous parses with `grammar/precedences/*.js` before considering `conflicts`.
- Do not treat precedence tuning as equivalent to adding a `conflicts` entry. Precedence changes are normal grammar work.
- Adding a `conflicts` entry is a last resort and requires prior confirmation with a clear explanation of why adding to `precedences`, associativity, or local rule refactoring are insufficient.
- Add purpose + example comments before each precedence group when modifying precedences; add reference notes for each precedence entry.
- When reading a conflict error trust keyword tokens in {…}; ignore deduplicated rule names like `__browse_body_token7`.

## Clean tree conventions

We want the syntax tree output to be flattened unless necessary, prefer `field` for non-repeating rules and `alias` for flags.

1. Add fields for modifiers that take value.

```js
// Bad
seq(kw("DELIMITER"), $.string_literal),

// Good
seq(kw("DELIMITER"), field("delimiter", $.string_literal))
```

2. Alias trivial flags and avoid `_option` suffix.

Trivial flags are:

- "NO-ERROR", "NO-LOBS", etc
- any `optional(kw("..."))`

Trivial flags are NOT:

- starting statement keywords
- keywords before terminatotor e.g `optional(kw("CASE"))`.
- `choice(kw("1"), kw("2"), ...)`, those should be moved into a separate rule/phrase

```js
// Bad
alias($.__no_labels, $.no_labels_option)

// Good
alias(kw("NO-LABELS"), $.no_labels),
```

3. Remove trivial\* helpers

Trivial rules are:

- rules like `__statement_no_error: ($) => kw("NO-ERROR")`
- rules like `__statement_format: ($) => seq(kw("FORMAT"), $.string_literal)`

Trivial rules are NOT rules that:

- are choice rules like `__error_scope_type: ($) => choice(kw("BLOCK-LEVEL"), kw("ROUTINE-LEVEL")),` are non-trivial, do not remove them!
- are main `_body` rules of the statement e.g `__input_clear_body`, those need to stay as they get optimized better.

```js
// Bad
__option: ($) => choice(
    alias($.__option_no_labels, $.no_labels_option)
  ),
__option_no_labels ($) => alias(kw("NO-LABELS", $.no_labels))

// Good
__option: ($) => choice(
    alias(kw("NO-LABELS"), $.no_labels),
  ),
```

4. Redundant double-alias nesting

```js
// Bad
optional(alias($.__x_no_undo, $.no_undo)),
__x_no_undo: ($) => alias(kw("NO-UNDO"), $.no_undo),

// Good
optional(alias(kw("NO-UNDO"), $.no_undo)),
```

5. Keep lexical-token aliasing at callsite (do not move alias into helper)

```js
// Bad
__rule: ($) seq($.__input_through_shell_variable),
__input_through_shell_variable: ($) => alias(token(/\$+[A-Za-z_0-9]*/), $.shell_variable),
// Also Bad
__input_through_shell_variable: ($) => alias(token(/\$+[A-Za-z_0-9]*/), $.shell_variable)

// Good
alias($.__input_through_shell_variable, $.shell_variable),
__input_through_shell_variable: ($) => token(/\$+[A-Za-z_0-9]*/),
```

6. Phrases-like rules should be kept in a separate rule and aliased

```js
// Bad
optional($.__find_of_phrase),
__find_of_phrase: ($) => seq(kw("OF"), $.__find_record_name),

// Good
optional(alias($.__find_of_phrase, $.of_phrase)),
__find_of_phrase: ($) => seq(kw("OF"), field("record", $.__find_record_name)),
```

7. Do not alias `field`'ed compound modifiers unless the fields are inside a `repeat`

```js
// Bad
alias(
   seq(kw("COLUMN-LABEL"), field("column_label", $.string_literal)),
   $.column_label,
),

// Good
seq(kw("COLUMN-LABEL"), field("column_label", $.string_literal)),
alias(
   seq(kw("COLUMN-LABEL"), repeat1(field("column_label", $.string_literal))),
   $.column_label,
),
```

8. Use phrase-scoping alias when optional valued subparts belong to one semantic option

```js
// Bad
seq(
  alias(kw("PERSISTENT"), $.persistent),
  optional(seq(kw("SET"), field("handle", $.identifier))),
),

// Good
alias(
  seq(
    kw("PERSISTENT"),
    optional(seq(kw("SET"), field("handle", $.identifier))),
  ),
  $.persistent,
)
```

Reason: without phrase-level alias, `handle` may bind to a broader parent node
instead of the `persistent` option.

## Optimization

When optimizing

- Optimizations should reduce both `src/parser.c` size AND `ACTION_COUNT` or `STATE_COUNT` or `LARGE_STATE_COUNT`.
- Exception: an optimization that reduces `src/parser.c` by more than `100000` bytes may be accepted when all count regressions are minor.
- Prefer the biggest reductions to `src/parser.c` size, do not go beyond tree-sitter limit of `65535` `ACTION_COUNT` and `STATE_COUNT`.
- Preserve accepted and rejected syntax; do not weaken the grammar.
- Preserve syntax-tree shape, including fields, aliases, and child ordering.
- Preserve public and hidden node visibility.
- Preserve precedence, associativity, and option ordering unless it was incorrect to begin with.
- Preserve distinct token identity; avoid token packing.
- Preserve existing corpus behavior.
- Optimize one change at a time, measure it, then run focused and full tests. A parser-size improvement is invalid if parsing behavior changes.

## Verification

- The changes are aligned with the ABL language reference where documented, without treating the reference as exhaustive.
- The changes follow the conventions in this skill.
- The change does not have permissive or catch-all rules that allow invalid syntax to be parsed successfully.
- The change has corpus test coverage.
- The rules are optimized and their impact was measured.

## Notes

- When using `alias`, tree-sitter handles undefined rules by using the property name as the symbol name so it's okay to alias to `$.something_that_wasnt_defined`.
