module.exports = ({ kw, tkw }) => ({
  put_cursor_statement: ($) =>
    seq(
      kw("PUT"),
      kw("CURSOR"),
      choice(
        tkw("OFF"),
        seq(
          optional(seq(kw("ROW"), field("row", $._expression))),
          optional(seq(kw("COLUMN"), field("column", $._expression))),
        ),
      ),
      $._terminator,
    ),
});
