module.exports = ({ kw }) => ({
  frame_phrase: ($) => seq(kw("WITH"), $.__frame_phrase_body),

  __frame_phrase_body: ($) =>
    repeat1(
      choice(
        seq(kw("FRAME"), field("frame", $.identifier)),
        seq(kw("BROWSE"), field("browse", $.identifier)),
        $.size_phrase,
        alias($.__frame_option_no_labels, $.no_labels),
        alias($.__frame_option_side_labels, $.side_labels),
        alias($.__frame_option_centered, $.centered),
        alias($.__frame_option_no_box, $.no_box),
        alias($.__frame_option_overlay, $.overlay),
        alias($.__frame_option_overlay, $.background),
        alias($.__frame_option_page_top, $.page_top),
        alias($.__frame_option_page_bottom, $.page_bottom),
        alias($.__frame_option_use_text, $.use_text),
        alias($.__frame_option_down, $.down),
        alias($.__frame_option_skip, $.skip),
        alias($.__frame_option_row, $.frame_option),
        $.__frame_option_columns_count,
        $.__frame_option_column_count,
        alias($.__frame_option_column, $.frame_option),
        alias($.__frame_option_width, $.frame_option),
        alias($.__frame_option_view_as, $.frame_option),
        alias($.__frame_option_background, $.background),
        alias($.__frame_option_no_hide, $.no_hide),
        $.at_phrase,
        $.__frame_option_title,
      ),
    ),

  __frame_option_no_labels: ($) => kw("NO-LABELS"),
  __frame_option_side_labels: ($) => kw("SIDE-LABELS"),
  __frame_option_centered: ($) => kw("CENTERED"),
  __frame_option_no_box: ($) => kw("NO-BOX"),
  __frame_option_background: ($) => kw("BACKGROUND"),
  __frame_option_no_hide: ($) => kw("NO-HIDE"),
  __frame_option_overlay: ($) => kw("OVERLAY"),
  __frame_option_page_top: ($) => kw("PAGE-TOP"),
  __frame_option_page_bottom: ($) => kw("PAGE-BOTTOM"),
  __frame_option_use_text: ($) => kw("USE-TEXT"),
  __frame_option_view_as: ($) => seq(kw("VIEW-AS"), kw("DIALOG-BOX")),

  __frame_option_skip: ($) =>
    prec.left(1, seq(kw("SKIP"), optional(seq("(", $._expression, ")")))),
  __frame_option_column_count: ($) =>
    seq(
      field("column_count", $.number_literal),
      choice(kw("COLUMN"), kw("COL")),
    ),
  __frame_option_columns_count: ($) =>
    seq(field("columns_count", $.number_literal), kw("COLUMNS")),
  __frame_option_title: ($) => seq(kw("TITLE"), field("title", $._expression)),
  __frame_option_row: ($) => seq(kw("ROW"), field("row", $._expression)),
  __frame_option_column: ($) =>
    seq(choice(kw("COLUMN"), kw("COL")), field("column", $._expression)),
  __frame_option_width: ($) => seq(kw("WIDTH"), field("width", $._expression)),
  __frame_option_down: ($) => seq(optional($._expression), kw("DOWN")),
});
