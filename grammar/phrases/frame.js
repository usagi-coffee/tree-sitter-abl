module.exports = ({ kw }) => ({
  frame_phrase: ($) =>
    seq(
      kw("WITH"),
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
          seq(kw("FRAME"), field("frame", $.identifier)),
          seq(kw("BROWSE"), field("browse", $.identifier)),
          seq(kw("ROW"), field("row", $._expression)),
          seq(kw("WIDTH"), field("width", $._expression)),
          seq(kw("FONT"), field("font", $.number_literal)),
          seq(kw("BGCOLOR"), field("bgcolor", $.number_literal)),
          seq(kw("TITLE"), field("title", $._expression)),
          choice(
            seq(
              field("column", $.number_literal),
              choice(kw("COLUMN"), kw("COLUMNS"), kw("COL")),
            ),
            seq(
              choice(kw("COLUMN"), kw("COLUMNS"), kw("COL")),
              field("column", $._expression),
            ),
          ),
          alias(
            seq(kw("VIEW-AS"), field("widget", kw("DIALOG-BOX"))),
            $.view_as_phrase,
          ),
          prec.left(
            1,
            seq(
              kw("SKIP"),
              optional(field("skip", seq("(", $._expression, ")"))),
            ),
          ),
          alias(
            seq(optional(field("value", $._expression)), kw("DOWN")),
            $.down,
          ),
        ),
      ),
    ),
});
