# Contributing

## Commit descriptions

Always include parser-count deltas at the end of the commit description in exactly this
form and order:

```text
ACTION_COUNT: <before> -> <after> (<delta>)
STATE_COUNT: <before> -> <after> (<delta>)
LARGE_STATE_COUNT: <before> -> <after> (<delta>)
PARSER_C_SIZE_BYTES: <before> -> <after> (<delta>)
```

Measure the values against the commit's actual base. Recalculate them after rebasing or
merging instead of keeping deltas from an earlier base.

If a rule was optimized into a less obvious form, mention in the commit description
that the simpler form was measured and produced a more expensive parser.

Run `bun run format` before committing.

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
