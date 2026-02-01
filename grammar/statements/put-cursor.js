module.exports = ({ kw }) => ({
  put_cursor_statement: ($) =>
    seq(
      kw("PUT"),
      kw("CURSOR"),
      choice(
        kw("OFF"),
        seq(
          optional(seq(kw("ROW"), field("row", $._expression))),
          optional(seq(kw("COLUMN"), field("column", $._expression))),
        ),
      ),
      $._terminator,
    ),
});
