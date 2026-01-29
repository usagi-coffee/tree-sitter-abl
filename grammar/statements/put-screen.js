module.exports = ({ kw }) => ({
  put_screen_statement: ($) =>
    seq(kw("PUT"), kw("SCREEN"), $.__put_screen_body, $._terminator),

  __put_screen_body: ($) =>
    seq(
      optional(alias($.__put_screen_color_phrase, $.color_phrase)),
      optional(seq(kw("ROW"), field("row", $._expression))),
      optional(seq(kw("COLUMN"), field("column", $._expression))),
      field("value", $._expression),
    ),

  __put_screen_color_phrase: ($) =>
    seq(kw("COLOR"), field("color", $._expression)),
});
