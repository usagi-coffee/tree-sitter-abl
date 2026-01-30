module.exports = ({ kw, tkw }) => ({
  frame_phrase: ($) =>
    seq(
      kw("WITH"),
      repeat(
        choice(
          seq(kw("FRAME"), field("frame", $.identifier)),
          seq(kw("BROWSE"), field("browse", $.identifier)),
          alias($.__frame_option_size, $.size),
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
          alias($.__frame_option_column, $.frame_option),
          alias($.__frame_option_width, $.frame_option),
          alias($.__frame_option_view_as, $.frame_option),
          alias($.__frame_option_at, $.at),
          $.__frame_option_columns_count,
          $.__frame_option_column_count,
          $.__frame_option_title,
        ),
      ),
    ),

  __frame_option_no_labels: ($) => tkw("NO-LABELS"),
  __frame_option_side_labels: ($) => tkw("SIDE-LABELS"),
  __frame_option_centered: ($) => tkw("CENTERED"),
  __frame_option_no_box: ($) => tkw("NO-BOX"),
  __frame_option_background: ($) => tkw("BACKGROUND"),
  __frame_option_overlay: ($) => tkw("OVERLAY"),
  __frame_option_page_top: ($) => tkw("PAGE-TOP"),
  __frame_option_page_bottom: ($) => tkw("PAGE-BOTTOM"),
  __frame_option_use_text: ($) => tkw("USE-TEXT"),
  __frame_option_view_as: ($) => seq(kw("VIEW-AS"), tkw("DIALOG-BOX")),

  __frame_option_skip: ($) =>
    seq(tkw("SKIP"), optional(seq("(", $._expression, ")"))),
  __frame_option_column_count: ($) =>
    seq(field("column_count", $.number_literal), tkw("COLUMN")),
  __frame_option_columns_count: ($) =>
    seq(field("columns_count", $.number_literal), tkw("COLUMNS")),
  __frame_option_title: ($) => seq(kw("TITLE"), field("title", $._expression)),
  __frame_option_row: ($) => seq(kw("ROW"), field("row", $._expression)),
  __frame_option_column: ($) =>
    seq(kw("COLUMN"), field("column", $._expression)),
  __frame_option_width: ($) => seq(kw("WIDTH"), field("width", $._expression)),
  __frame_option_down: ($) =>
    choice(
      prec(1, seq($._expression, tkw("DOWN"))),
      seq(tkw("DOWN"), optional($._expression)),
      tkw("DOWN"),
    ),
  __frame_option_size: ($) =>
    seq(
      choice(tkw("SIZE"), tkw("SIZE-CHARS"), tkw("SIZE-PIXELS")),
      field("size", $._expression),
      kw("BY"),
      field("by", $._expression),
    ),
  __frame_option_at: ($) =>
    seq(
      kw("AT"),
      choice(
        seq(
          kw("COLUMN"),
          field("column", $._expression),
          kw("ROW"),
          field("row", $._expression),
        ),
        seq(
          kw("X"),
          field("x", $._expression),
          kw("Y"),
          field("y", $._expression),
        ),
      ),
    ),
});
