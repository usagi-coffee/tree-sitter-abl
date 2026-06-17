module.exports = ({ kw }) => ({
  put_screen_statement: ($) => seq(kw("PUT"), $.__put_screen_body, $._terminator),

  __put_screen_body: ($) =>
    seq(
      kw("SCREEN"),
      optional(alias($.__put_screen_color_phrase, $.color_phrase)),
      choice(
        // Standard order: [ROW] [COL] value.
        seq(
          optional(seq(kw("ROW"), field("row", $._expression))),
          optional(seq(choice(kw("COLUMN"), kw("COL")), field("column", $._expression))),
          field("value", $._expression),
        ),
        // Legacy order: value ROW [COL]. ROW is required to disambiguate.
        seq(
          field("value", $._expression),
          seq(kw("ROW"), field("row", $._expression)),
          optional(seq(choice(kw("COLUMN"), kw("COL")), field("column", $._expression))),
        ),
      ),
    ),

  __put_screen_color_phrase: ($) => seq(kw("COLOR"), field("color", $._expression)),
});
