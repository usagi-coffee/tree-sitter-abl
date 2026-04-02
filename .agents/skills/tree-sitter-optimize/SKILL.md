---
name: tree-sitter-optimize
description: Optimize tree-sitter grammar cost metrics such as ACTION_COUNT, STATE_COUNT, LARGE_STATE_COUNT, or expensive parser symbols. Use when Codex is asked to reduce parser size, squeeze action count, optimize costly grammar rules, or run a measured refactoring pass on a tree-sitter grammar.
---

# Tree-sitter Optimize

Use this skill to run a measured parser-cost reduction pass on a tree-sitter grammar.
The optimization pass is not limited to the techniques listed below.
Treat them as common patterns and examples, not an exhaustive menu.

## Workflow

1. Establish the baseline by regenerating `src/parser.c` with the project's normal generation command, then record `ACTION_COUNT`, `STATE_COUNT`, and `LARGE_STATE_COUNT`.
   Prefer a project command that already prints these metrics when one exists.
   Otherwise derive them from the generated `src/parser.c`.
2. Identify the hotspot before editing.
   Use the project's state-reporting workflow such as `tree-sitter generate --report-states-for-rule -` when available.
   Treat the largest rules as candidates, not automatic problems.
   Large wrapper rules with many `choice`, `optional`, and `repeat` branches are usually better targets than naturally expensive operator expressions.
3. Prefer local structural deduplication over broad grammar-wide refactors.
4. Apply one optimization at a time.
5. Re-run the same generation command after each change, then re-read the parser metrics.
   Prefer a project command that already prints them.
   Otherwise derive them from `src/parser.c`.
6. Compare the result to the last accepted baseline and revert neutral-to-worse changes quickly.
7. On slow grammars, remember the last accepted checkpoint counts and avoid re-measuring immediately after a pure revert.
8. Run the normal test workflow after the kept changes.
9. Always note every state change between runs.
   Record the previous accepted state, the new observed state, and what change caused the transition so the next run starts from an explicit checkpoint.

## General Rules

- Optimize where the duplication actually lives.
- Prefer narrow domain-specific helpers over broader shared helpers that admit extra alternatives.
- Favor local rule-shape sharing before regrouping top-level dispatchers.
- Treat parser metrics as the source of truth, not aesthetics.
- Preserve parser behavior while optimizing.
- Do not change the output tree shape, hide or expose nodes differently, rename fields, or otherwise alter parse results just to improve counts.
- Do not apply optimizations that break rule ordering semantics, such as rewriting `seq(optional(...), optional(...), optional(...))` into `repeat(choice(...))`, unless the user has explicitly agreed to allow that ordering change.
- Use one small edit per measurement cycle.
- Some extractions reduce counts and some increase them. Try different cuts, regenerate, and keep only the proven win.
- Use the last accepted checkpoint as the comparison source.
- If a change is reverted cleanly, assume the metrics are back at the last accepted checkpoint unless there is a reason to distrust the revert.
- Always leave a run-to-run state log.
  Note each transition between baseline, accepted change, revert, and final kept state.
- Use any other behavior-preserving optimization that measurably improves parser cost, even if it is not listed in the technique catalog below.

Example measurement loop:

```text
baseline: ACTION_COUNT 65278
change A: ACTION_COUNT 65170
change B: ACTION_COUNT 65293
```

Keep change A. Revert change B immediately.

## Deriving Parser Metrics

Do not assume the project has a dedicated metrics or check command.

After each generation pass, prefer any project-provided command that already prints parser metrics.

If the project does not provide one, derive the metrics directly from `src/parser.c`.

- `STATE_COUNT` and `LARGE_STATE_COUNT` are emitted as macros in `src/parser.c`.
- `ACTION_COUNT` is not emitted directly as a macro in the generated parser. Derive it by scanning all `ACTIONS(<n>)` occurrences and taking the highest value.

Example `src/parser.c` macros:

```c
#define STATE_COUNT 44191
#define LARGE_STATE_COUNT 16320
```

Example extraction command:

```sh
perl -ne 'if (/^#define (STATE_COUNT|LARGE_STATE_COUNT) \d+/) { print } while (/ACTIONS\((\d+)\)/g) { $m = $1 if !defined($m) || $1 > $m } END { print "#define ACTION_COUNT $m\n\n" if defined $m }' src/parser.c
```

Treat the extracted output as the baseline and comparison source for optimization passes.

## Technique Catalog

The following techniques are common starting points, not the full set of allowed optimizations.

## Technique: Hidden Semantic Chunk Extraction

Use when one large rule contains multiple logical sections that can be separated into hidden helpers.

This pays off because splitting a large rule into semantic chunks often reduces both the rule's own states and unrelated global states.

Example:

```js
type_definition: ($) =>
  seq(
    repeat($.type_qualifier),
    field("type", $._type_specifier),
    repeat($.type_qualifier),
    commaSep1(field("declarator", $._type_declarator)),
    repeat($.attribute_specifier),
    ";",
  );
```

Prefer:

```js
type_definition: ($) =>
  seq(
    $._type_definition_type,
    $._type_definition_declarators,
    repeat($.attribute_specifier),
    ";",
  );
_type_definition_type: ($) =>
  seq(
    repeat($.type_qualifier),
    field("type", $._type_specifier),
    repeat($.type_qualifier),
  );
_type_definition_declarators: ($) =>
  commaSep1(field("declarator", $._type_declarator));
```

Use it when the extracted pieces are real semantic chunks, not arbitrary slices.

## Technique: Prefix Extraction

Use when several rules begin with the same fixed keyword sequence and only diverge near the end.

This usually pays off because the parser can reuse the early path instead of specializing the same prefix repeatedly.

Example:

```js
foo_a: ($) => seq("ALTER", "DATABASE", "SET", "X", $.value),
foo_b: ($) => seq("ALTER", "DATABASE", "SET", "Y", $.value),
```

Prefer:

```js
__foo_prefix: ($) => seq("ALTER", "DATABASE", "SET"),
foo_a: ($) => seq($.__foo_prefix, "X", $.value),
foo_b: ($) => seq($.__foo_prefix, "Y", $.value),
```

Use it when the prefix is exact and repeated many times.

## Technique: Local Alternative Extraction

Use when the same non-trivial `choice(...)` appears repeatedly inside nearby rules.

This can pay off because the parser can reuse one semantic alternative set instead of specializing the same branches in multiple places.

Example:

```js
stmt_a: ($) =>
  seq(
    "A",
    $.value,
    optional(choice("X", "Y", "Z")),
  ),
stmt_b: ($) =>
  seq(
    "B",
    $.value,
    optional(choice("X", "Y", "Z")),
  ),
```

Prefer:

```js
__stmt_alignment: ($) => choice("X", "Y", "Z"),
stmt_a: ($) => seq("A", $.value, optional($.__stmt_alignment)),
stmt_b: ($) => seq("B", $.value, optional($.__stmt_alignment)),
```

Use it when the extracted helper is a real local keyword family or semantic alternative set, not just an arbitrary tiny wrapper.

## Technique: Body Extraction

Use when a single rule has a substantial internal structure and it is cheaper to split that structure into a dedicated `__rule_body` helper.

This can pay off by itself. The helper does not need to be reused by other rules to have an impact on state counts.

Example:

```js
my_statement: ($) =>
  seq(
    "MY-STATEMENT",
    field("left", $.identifier),
    optional(field("right", $.identifier)),
    repeat($.__option),
    $._terminator,
  ),
```

Prefer:

```js
my_statement: ($) => seq("MY-STATEMENT", $.__my_statement_body, $._terminator),
__my_statement_body: ($) =>
  seq(
    field("left", $.identifier),
    optional(field("right", $.identifier)),
    repeat($.__option),
  ),
```

Use it when the top rule becomes cleaner and the body is complex enough to stand on its own.

## Technique: Optional Body Extraction

Use when many rules share `optional(body) + terminator`.

This pays off for families of short statements with optional trailing SQL-like or option-like tails.

Example:

```js
stmt_a: ($) => seq("A", optional(field("body", $.__tail)), $._terminator),
stmt_b: ($) => seq("B", optional(field("body", $.__tail)), $._terminator),
```

Prefer:

```js
__stmt_a_body: ($) => seq(optional(field("body", $.__tail)), $._terminator),
__stmt_b_body: ($) => seq(optional(field("body", $.__tail)), $._terminator),
stmt_a: ($) => seq("A", $.__stmt_a_body),
stmt_b: ($) => seq("B", $.__stmt_b_body),
```

Use it when the optionality is identical across multiple rules.

## Technique: Tail Extraction

Use when a rule family has a repeated tail shape after a unique head.

This pays off when a large suffix is duplicated and the head does not need to know its internal structure.

Example:

```js
stmt_a: ($) => seq("CREATE", "TABLE", $.name, field("body", $.__tail), $._terminator),
stmt_b: ($) => seq("CREATE", "VIEW", $.name, field("body", $.__tail), $._terminator),
```

Prefer:

```js
__create_table_body: ($) => seq(field("body", $.__tail), $._terminator),
__create_view_body: ($) => seq(field("body", $.__tail), $._terminator),
stmt_a: ($) => seq("CREATE", "TABLE", $.name, $.__create_table_body),
stmt_b: ($) => seq("CREATE", "VIEW", $.name, $.__create_view_body),
```

Use it when the tail is structurally generic and repeated often.

## Technique: Non-Empty Tail Extraction

Use when several branches repeat the same trailing shape, but that tail contains optional pieces and would become illegal as a hidden helper if extracted directly.

This pays off when you keep the helper itself non-empty and move the outer optionality back to the callsite.

Do not extract a helper like `seq(optional(...), repeat(...))` if that helper can match the empty string. Tree-sitter rejects hidden helpers that match empty.

Example:

```js
choice(
  seq("A", optional($.x), repeat($.y)),
  seq("B", optional($.x), repeat($.y)),
);
```

Prefer:

```js
choice(seq("A", optional($.__tail)), seq("B", optional($.__tail)));
__tail: ($) => choice(seq($.x, repeat($.y)), repeat1($.y));
```

Ordered-tail example:

```js
statement_with_ordered_tail: ($) =>
  seq(
    "COMMAND",
    optional($.prefix),
    optional($.target),
    optional($.modifier),
    optional($.location),
    $._terminator,
  );
```

Prefer:

```js
statement_with_ordered_tail: ($) => seq("COMMAND", optional($.__ordered_tail), $._terminator),
__ordered_tail: ($) =>
  choice(
    seq($.prefix, optional($.__ordered_tail_after_prefix)),
    seq($.target, optional($.__ordered_tail_after_target)),
    seq($.modifier, optional($.location)),
    $.location,
  ),
__ordered_tail_after_prefix: ($) =>
  choice(
    seq($.target, optional($.__ordered_tail_after_target)),
    seq($.modifier, optional($.location)),
    $.location,
  ),
__ordered_tail_after_target: ($) =>
  choice(
    seq($.modifier, optional($.location)),
    $.location,
  )
```

Use it when the repeated suffix is real and the non-empty reformulation preserves the same tree shape and accepted syntax.

## Technique: Token Packing

Use when a generic tail consumes many punctuation or operator branches as undifferentiated items.

This can pay off because a single token helper may be cheaper than many parallel literal branches.

Example:

```js
__tail_token: ($) => choice(",", "(", ")", "=", "<", ">", "+", "-", "*", "/"),
```

Prefer:

```js
__tail_symbol: ($) => token(choice(",", "(", ")", "=", "<", ">", "+", "-", "*", "/")),
__tail_token: ($) => choice($.__tail_symbol, $.identifier, $.string_literal),
```

Use it only when those symbols are intentionally generic tail items.

## Technique: Local Prefix Family Helpers

Use when a rule family differs only by one keyword after a shared local prefix.

This often pays off for pairs like `SET PRO_CONNECT LOG` and `SET PRO_CONNECT QUERY_TIMEOUT`.

Example:

```js
stmt_a: ($) => seq("SET", "PRO_CONNECT", "LOG", $.value),
stmt_b: ($) => seq("SET", "PRO_CONNECT", "QUERY_TIMEOUT", $.value),
```

Prefer:

```js
__stmt_prefix: ($) => seq("SET", "PRO_CONNECT"),
stmt_a: ($) => seq($.__stmt_prefix, "LOG", $.value),
stmt_b: ($) => seq($.__stmt_prefix, "QUERY_TIMEOUT", $.value),
```

Use it when the family is local and repeated enough to matter.

## Technique: Avoid Broad Dispatcher Grouping

Do not assume grouping top-level statements into `_create_statement`, `_drop_statement`, or similar buckets will help.

This often does not pay off because the extra dispatcher layer can introduce more specialization than it removes.

Example:

```js
_sql_statement: ($) =>
  choice(
    $._sql_create_statement,
    $._sql_drop_statement,
    $._sql_alter_statement,
  );
```

This may look cleaner, but it can still increase parser cost. Prefer testing local sharing inside the SQL rules first.

Prefer local sharing inside the hotspot file before changing top-level dispatch.

## Validation

- Re-run the parser generation command after every optimization step.
- Recompute or re-read `ACTION_COUNT`, `STATE_COUNT`, and `LARGE_STATE_COUNT` after every kept change.
  Prefer a project command that already prints them.
  Otherwise derive them from `src/parser.c`.
- Re-run the grammar test suite after the kept changes.
- Verify the kept change does not alter the output tree shape or node visibility for existing parses.
- If one metric improves but others regress badly, compare against the previous baseline before keeping the change.
