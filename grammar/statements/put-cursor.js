module.exports = ({ kw }) => ({
  put_cursor_statement: ($) =>
    seq(kw("PUT"), $.__put_cursor_body, $._terminator),

  __put_cursor_body: ($) =>
    seq(
      kw("CURSOR"),
      choice(
        kw("OFF"),
        seq(
          optional(seq(kw("ROW"), field("row", $._expression))),
          optional(seq(kw("COLUMN"), field("column", $._expression))),
        ),
      ),
    ),
});
