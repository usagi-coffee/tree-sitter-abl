export default ({ kw }) => ({
  put_cursor_statement: ($) => seq(kw("PUT"), $.__put_cursor_body, $._terminator),

  __put_cursor_body: ($) =>
    seq(
      kw("CURSOR"),
      choice(
        kw("OFF"),
        seq(
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          optional(seq($._row_keyword, field("row", $._expression))),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          optional(seq(kw("COLUMN", { offset: 3 }), field("column", $._expression))),
        ),
      ),
    ),
});
