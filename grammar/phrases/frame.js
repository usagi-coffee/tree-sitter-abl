module.exports = ({ kw }) => ({
  frame_phrase: ($) =>
    seq(
      prec(1, kw("WITH")),
      repeat1(
        choice(
          $.at_phrase,
          $.size_phrase,
          alias(kw("NO-LABELS"), $.no_labels),
          alias(kw("NO-LABEL"), $.no_label),
          alias(kw("SIDE-LABELS"), $.side_labels),
          alias(kw("CENTERED"), $.centered),
          alias(kw("THREE-D"), $.three_d),
          alias(kw("NO-BOX"), $.no_box),
          alias(kw("ATTR-SPACE"), $.attr_space),
          alias(kw("NO-ATTR-SPACE"), $.no_attr_space),
          alias(kw("OVERLAY"), $.overlay),
          alias(kw("PAGE-TOP"), $.page_top),
          alias(kw("PAGE-BOTTOM"), $.page_bottom),
          alias(kw("USE-TEXT"), $.use_text),
          alias(kw("BACKGROUND"), $.background),
          alias(kw("NO-HIDE"), $.no_hide),
          seq(
            kw("FRAME"),
            field("frame", $.__frame_identifier),
            optional(kw("WITH")),
          ),
          seq(
            kw("BROWSE"),
            field("browse", $.__frame_identifier),
            optional(kw("WITH")),
          ),
          seq(kw("ROW"), field("row", $.__frame_expression)),
          seq(kw("WIDTH"), field("width", $.__frame_expression)),
          seq(kw("FONT"), field("font", $.number_literal)),
          seq(kw("BGCOLOR"), field("bgcolor", $.number_literal)),
          seq(kw("TITLE"), field("title", $.__frame_expression)),
          choice(
            seq(
              field("column", $.number_literal),
              choice(kw("COLUMN"), kw("COLUMNS"), kw("COL")),
            ),
            seq(
              choice(kw("COLUMN"), kw("COLUMNS"), kw("COL")),
              field("column", $.__frame_expression),
            ),
          ),
          alias(
            seq(kw("VIEW-AS"), field("widget", kw("DIALOG-BOX"))),
            $.view_as_phrase,
          ),
          alias($.__frame_down_count, $.down),
          alias($.__frame_down_value, $.down),
          alias($.__frame_down_plain, $.down),
          $.__frame_skip_phrase,
        ),
      ),
    ),

  __frame_skip_phrase: ($) =>
    prec.left(
      seq(
        kw("SKIP"),
        optional(field("skip", seq("(", $.__frame_expression, ")"))),
      ),
    ),

  __frame_identifier: ($) => $.identifier,
  __frame_expression: ($) => $._expression,
  __frame_down_value: ($) =>
    seq(field("value", $.__frame_expression), kw("DOWN")),
  __frame_down_count: ($) =>
    prec.right(1, seq(kw("DOWN"), field("count", $.__frame_down_expression))),
  __frame_down_plain: ($) => prec(-1, seq(kw("DOWN"))),
  __frame_down_expression: ($) =>
    choice($.number_literal, $.parenthesized_expression),
});
