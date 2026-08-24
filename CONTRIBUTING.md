# Contributing

## Formatting

Please format your code with `bun run format` before committing.

## Commit descriptions

Use a short, descriptive commit subject with a category prefix, such as
`grammar:`, `test:`, `queries:`, `scanner:`, `docs:`, `agent:`. Choose the
prefix that best describes the primary area affected by the change; use a
lowercase prefix followed by a concise imperative description.

Each commit should make one semantic change. Include tests that directly cover
the change in the same commit, but do not bundle unrelated grammar, tests,
formatting, or cleanup changes; split them into separate commits when they can
be reviewed or reverted independently.

Always include parser-count deltas at the end of the commit description in exactly this
form and order. The four metric lines must be separate physical lines; do not write
literal `\\n` escape sequences into the message.

Use this complete template for grammar and parser changes:

```text
<category>: <short imperative description>

<brief explanation of the semantic change and preserved behavior>

ACTION_COUNT: <before> -> <after> (<delta>)
STATE_COUNT: <before> -> <after> (<delta>)
LARGE_STATE_COUNT: <before> -> <after> (<delta>)
PARSER_C_SIZE_BYTES: <before> -> <after> (<delta>)
```

Keep the blank lines and metric names exactly as shown. Replace the angle-bracketed
placeholders; do not include the brackets in the final message. Omit the optional
optimization sentence when the change was not an optimization.

Measure the values against the commit's actual base. Recalculate them after rebasing or
merging instead of keeping deltas from an earlier base.

If a rule was optimized into a less obvious form, mention in the commit description
that the simpler form was measured and produced a more expensive parser.

## Tests

Every commit should ideally include a test that covers the change.

## Comments

Avoid review- and implementation-history comments. Do not narrate local experiments or
failures, such as why a rule failed during one contributor's work. Comments should
document syntax, ambiguity, or parser constraints that remain true independently of a
particular contributor, request, or review.

Verbose comments are appropriate where the reasoning must be preserved, such as a
`conflicts` or `precedences` entry that needs to explain the competing parses and why simpler precedence
or rule refactoring cannot resolve them.

## Generated files

Do not commit generated files, including `src/parser.c`, `src/grammar.json`,
`src/node-types.json`, or other automatically generated artifacts. Generate them
locally for measurement and testing, but leave them out of commits.
