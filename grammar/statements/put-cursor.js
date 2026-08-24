export default ({ kw }) => ({
  put_cursor_statement: ($) => seq(kw("PUT"), $.__put_cursor_body, $._terminator),

  __put_cursor_body: ($) =>
    seq(
      kw("CURSOR"),
      choice(
        kw("OFF"),
        seq(
          optional(seq($._row_keyword, field("row", $._expression))),
          optional(seq(kw("COLUMN", { offset: 3 }), field("column", $._expression))),
        ),
      ),
    ),
});
