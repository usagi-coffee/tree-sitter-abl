const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  browse_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      ...definitionModifiers($, kw, {
        new: true,
        scope: ["SHARED"],
        access: ["PRIVATE"],
      }),
      kw("BROWSE"),
      $.__browse_body,
      $._terminator,
    ),

  __browse_body: ($) =>
    seq(
      field("name", $.identifier),
      kw("QUERY"),
      field("query", $.identifier),
      optional(
        alias(
          choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")),
          $.lock,
        ),
      ),
      optional(alias(kw("NO-WAIT"), $.no_wait)),
      kw("DISPLAY"),
      choice(
        repeat1(alias($.__browse_column, $.column)),
        alias($.__browse_record, $.record),
      ),
      optional($.__browse_enable_phrase),
      optional(kw("WITH")),
      repeat($.__browse_option),
    ),

  __browse_record: ($) =>
    seq(
      field("record", $.identifier),
      kw("EXCEPT"),
      repeat1(field("field", $.identifier)),
    ),

  __browse_column: ($) =>
    prec.right(
      seq(
        field("column", $.__browse_column_name),
        repeat($.__browse_column_option),
      ),
    ),

  __browse_column_name: ($) =>
    choice(
      $.identifier,
      $.qualified_name,
      $.scoped_name,
      $.object_access,
      $.function_call,
    ),

  __browse_column_option: ($) =>
    choice(
      $.format_phrase,
      alias($.__browse_label_option, $.label_option),
      alias($.__browse_no_labels_option, $.no_labels_option),
      alias($.__browse_width_option, $.width_option),
      alias($.__browse_column_font_option, $.column_font_option),
      alias($.__browse_column_label_option, $.column_label_option),
      alias($.__browse_column_dcolor_option, $.column_dcolor_option),
      alias($.__browse_column_bgcolor_option, $.column_bgcolor_option),
      alias($.__browse_column_fgcolor_option, $.column_fgcolor_option),
      alias($.__browse_column_pfcolor_option, $.column_pfcolor_option),
      alias($.__browse_label_font_option, $.label_font_option),
      alias($.__browse_label_dcolor_option, $.label_dcolor_option),
      alias($.__browse_label_bgcolor_option, $.label_bgcolor_option),
      alias($.__browse_label_fgcolor_option, $.label_fgcolor_option),
      alias($.__browse_label_pfcolor_option, $.label_pfcolor_option),
      alias($.__browse_help_option, $.help_option),
      alias($.__browse_validate_option, $.validate_option),
      alias($.__browse_auto_return_option, $.auto_return_option),
      alias($.__browse_disable_auto_zap_option, $.disable_auto_zap_option),
      alias($.__browse_moveable_option, $.moveable_option),
      alias($.__browse_resizable_option, $.resizable_option),
    ),

  __browse_option: ($) =>
    choice(
      alias($.__browse_context_help_id_option, $.context_help_id_option),
      alias($.__browse_drop_target_option, $.drop_target_option),
      alias($.__browse_tooltip_option, $.tooltip_option),
      alias($.__browse_bgcolor_option, $.bgcolor_option),
      alias($.__browse_dcolor_option, $.dcolor_option),
      alias($.__browse_fgcolor_option, $.fgcolor_option),
      alias($.__browse_font_option, $.font_option),
      alias($.__browse_pfcolor_option, $.pfcolor_option),
      alias($.__browse_title_option, $.title_option),
      alias($.__browse_width_option, $.width_option),
      alias($.__browse_down_option, $.down_option),
      alias($.__browse_no_empty_space_option, $.no_empty_space_option),
      alias($.__browse_fit_last_column_option, $.fit_last_column_option),
      alias($.__browse_multiple_option, $.multiple_option),
      alias($.__browse_separators_option, $.separators_option),
      alias($.__browse_no_row_markers_option, $.no_row_markers_option),
      alias(
        $.__browse_no_column_scrolling_option,
        $.no_column_scrolling_option,
      ),
      alias($.__browse_max_data_guess_option, $.max_data_guess_option),
      alias($.__browse_row_option, $.row_option),
      alias($.__browse_column_setting, $.column_option),
      alias(
        $.__browse_scrollbar_horizontal_option,
        $.scrollbar_horizontal_option,
      ),
      alias($.__browse_scrollbar_vertical_option, $.scrollbar_vertical_option),
      alias($.__browse_size_option, $.size_option),
      alias($.__browse_size_chars_option, $.size_chars_option),
      alias($.__browse_size_pixels_option, $.size_pixels_option),
    ),

  __browse_label_option: ($) => seq(kw("LABEL"), $.string_literal),
  __browse_no_labels_option: ($) => kw("NO-LABELS"),
  __browse_width_option: ($) => seq(kw("WIDTH"), $._expression),
  __browse_column_font_option: ($) => seq(kw("COLUMN-FONT"), $._expression),
  __browse_column_label_option: ($) =>
    seq(kw("COLUMN-LABEL"), $.string_literal),
  __browse_column_dcolor_option: ($) => seq(kw("COLUMN-DCOLOR"), $._expression),
  __browse_column_bgcolor_option: ($) =>
    seq(kw("COLUMN-BGCOLOR"), $._expression),
  __browse_column_fgcolor_option: ($) =>
    seq(kw("COLUMN-FGCOLOR"), $._expression),
  __browse_column_pfcolor_option: ($) =>
    seq(kw("COLUMN-PFCOLOR"), $._expression),
  __browse_label_font_option: ($) => seq(kw("LABEL-FONT"), $._expression),
  __browse_label_dcolor_option: ($) => seq(kw("LABEL-DCOLOR"), $._expression),
  __browse_label_bgcolor_option: ($) => seq(kw("LABEL-BGCOLOR"), $._expression),
  __browse_label_fgcolor_option: ($) => seq(kw("LABEL-FGCOLOR"), $._expression),
  __browse_label_pfcolor_option: ($) => seq(kw("LABEL-PFCOLOR"), $._expression),
  __browse_help_option: ($) => seq(kw("HELP"), $.string_literal),
  __browse_validate_option: ($) =>
    seq(kw("VALIDATE"), "(", $._expression, ",", $._expression, ")"),
  __browse_auto_return_option: ($) => kw("AUTO-RETURN"),
  __browse_disable_auto_zap_option: ($) => kw("DISABLE-AUTO-ZAP"),
  __browse_moveable_option: ($) => kw("MOVEABLE"),
  __browse_resizable_option: ($) => kw("RESIZABLE"),

  __browse_context_help_id_option: ($) =>
    seq(kw("CONTEXT-HELP-ID"), $._expression),
  __browse_drop_target_option: ($) => kw("DROP-TARGET"),
  __browse_tooltip_option: ($) => seq(kw("TOOLTIP"), $._expression),
  __browse_bgcolor_option: ($) => seq(kw("BGCOLOR"), $._expression),
  __browse_dcolor_option: ($) => seq(kw("DCOLOR"), $._expression),
  __browse_fgcolor_option: ($) => seq(kw("FGCOLOR"), $._expression),
  __browse_font_option: ($) => seq(kw("FONT"), $._expression),
  __browse_pfcolor_option: ($) => seq(kw("PFCOLOR"), $._expression),
  __browse_title_option: ($) => seq(kw("TITLE"), $.string_literal),
  __browse_down_option: ($) =>
    choice(seq($.number_literal, kw("DOWN")), seq(kw("DOWN"), $._expression)),
  __browse_no_empty_space_option: ($) => kw("NO-EMPTY-SPACE"),
  __browse_fit_last_column_option: ($) => kw("FIT-LAST-COLUMN"),
  __browse_multiple_option: ($) => kw("MULTIPLE"),
  __browse_separators_option: ($) => kw("SEPARATORS"),
  __browse_no_row_markers_option: ($) => kw("NO-ROW-MARKERS"),
  __browse_no_column_scrolling_option: ($) => kw("NO-COLUMN-SCROLLING"),
  __browse_max_data_guess_option: ($) =>
    seq(kw("MAX-DATA-GUESS"), $._expression),
  __browse_row_option: ($) => seq(kw("ROW"), $._expression),
  __browse_column_setting: ($) => seq(kw("COLUMN"), $._expression),
  __browse_scrollbar_horizontal_option: ($) => kw("SCROLLBAR-HORIZONTAL"),
  __browse_scrollbar_vertical_option: ($) => kw("SCROLLBAR-VERTICAL"),
  __browse_size_option: ($) =>
    seq(kw("SIZE"), $._expression, kw("BY"), $._expression),
  __browse_size_chars_option: ($) =>
    seq(kw("SIZE-CHARS"), $._expression, kw("BY"), $._expression),
  __browse_size_pixels_option: ($) =>
    seq(kw("SIZE-PIXELS"), $._expression, kw("BY"), $._expression),

  __browse_enable_phrase: ($) =>
    seq(
      kw("ENABLE"),
      choice(kw("ALL"), repeat1(field("field", $.__browse_enable_field))),
    ),

  __browse_enable_field: ($) =>
    seq(
      field(
        "field",
        choice($.identifier, $.qualified_name, $.object_access, $.scoped_name),
      ),
      optional(seq("[", optional($._array_subscript), "]")),
    ),
});
