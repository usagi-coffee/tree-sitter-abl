module.exports = ({ kw }) => ({
  put_screen_statement: ($) =>
    seq(
      kw("PUT"),
      kw("SCREEN"),
      optional(alias($.__put_screen_color_clause, $.color_clause)),
      optional(seq(kw("ROW"), field("row", $._expression))),
      optional(seq(kw("COLUMN"), field("column", $._expression))),
      field("value", $._expression),
      $._terminator,
    ),

  __put_screen_color_clause: ($) =>
    seq(kw("COLOR"), field("color", $._expression)),
});
