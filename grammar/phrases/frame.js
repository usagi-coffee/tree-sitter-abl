module.exports = ({ kw }) => ({
  frame_phrase: ($) =>
    seq(
      prec(1, kw("WITH")),
      repeat1(
        choice(
          $.at_phrase,
          $.size_phrase,
          alias(kw("NO-LABELS"), $.no_labels),
          alias(kw("SIDE-LABELS"), $.side_labels),
          alias(kw("CENTERED"), $.centered),
          alias(kw("NO-BOX"), $.no_box),
          alias(kw("OVERLAY"), $.overlay),
          alias(kw("PAGE-TOP"), $.page_top),
          alias(kw("PAGE-BOTTOM"), $.page_bottom),
          alias(kw("USE-TEXT"), $.use_text),
          alias(kw("BACKGROUND"), $.background),
          alias(kw("NO-HIDE"), $.no_hide),
          seq(kw("FRAME"), field("frame", $.__frame_identifier)),
          seq(kw("BROWSE"), field("browse", $.__frame_identifier)),
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
          alias(
            seq(optional(field("value", $.__frame_expression)), kw("DOWN")),
            $.down,
          ),
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
});
