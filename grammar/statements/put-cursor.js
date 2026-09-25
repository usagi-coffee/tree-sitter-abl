export default ({ kw }) => ({
  put_cursor_statement: ($) => seq($._kw_put, $.__put_cursor_body, $._terminator),

  __put_cursor_body: ($) =>
    seq(
      $._kw_cursor,
      choice(
        $._kw_off,
        seq(
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          optional(seq($._kw_row, field("row", $._expression))),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          optional(seq(kw("COLUMN", { offset: 3 }), field("column", $._expression))),
        ),
      ),
    ),
});
