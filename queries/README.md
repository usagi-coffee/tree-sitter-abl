# Editor queries

- `highlights.scm` uses standard Tree-sitter highlight captures, including Neovim's
  `@function.method`, `@variable.parameter`, and `@keyword.*` groups.
- `indents.scm` targets nvim-treesitter's `@indent.*` conventions. It indents blocks,
  single-statement conditionals, CASE arms, and multiline declarations and calls.
  GET/SET headers and their END lines align with DEFINE PROPERTY. Preprocessor
  directives do not introduce an additional indentation level.
- `tags.scm` provides definition and static reference captures for code navigation.
  Dynamic procedure and function targets are runtime expressions, so they are not
  treated as static symbol references.

For Neovim, install these queries in `queries/abl/` on the runtime path alongside
an ABL parser. Enable highlighting and indentation for that parser through your
nvim-treesitter configuration. Actual colors depend on the active colorscheme.

## Maintaining highlighting

Regenerate the parser before extracting keywords:

```sh
bun run generate
python3 tools/extract_keywords.py --node-types src/node-types.json
```

The extractor reads grammar sources and reconciles the result with generated
node types. This includes indirect anonymous keywords and named keyword aliases,
and excludes tokens hidden by aliases. Keep operator, control-flow, boolean, and
preprocessor tokens in their specialized capture groups, with the remaining
patterns in `@keyword`. Keyword aliases already handle case and abbreviations;
do not add text-based keyword matches on arbitrary identifiers.

Built-in function names come from `bun run reference '*function'`. Match these
only in plain function call positions so similarly named variables and object
methods keep their contextual captures. Predicate patterns use explicit case
classes because Rust and Neovim do not share inline case-insensitivity syntax.

## Testing

```sh
bun run test:queries
```

This checks extracted keyword coverage and runs the corpus, highlight, and tag
fixtures. The fixtures use Tree-sitter's [query test assertions](https://tree-sitter.github.io/tree-sitter/3-syntax-highlighting.html#unit-testing).

To test indentation with Neovim and an installed nvim-treesitter checkout:

```sh
bun run build
NVIM_TREESITTER_PATH=/path/to/nvim-treesitter \
ABL_PARSER_PATH="$PWD/abl.so" \
nvim --headless -u NONE -l tools/test_indents.lua
```

The runner removes indentation from the fixtures, applies nvim-treesitter's indent
engine line by line, and compares the result with the expected indentation. It
also compiles all three queries in Neovim and evaluates the highlight predicates.
