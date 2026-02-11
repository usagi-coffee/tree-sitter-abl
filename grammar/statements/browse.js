module.exports = ({ kw }) => ({
  browse_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__browse_modifier),
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
      optional($.__browse_options_phrase),
    ),
  __browse_options_phrase: ($) => seq(kw("WITH"), repeat($.__browse_option)),

  __browse_record: ($) =>
    seq(
      field("record", $.identifier),
      kw("EXCEPT"),
      repeat1(field("field", $.identifier)),
    ),

  __browse_column: ($) =>
    prec.right(
      seq(
        field("column", $.__browse_column_expression),
        repeat($.__browse_column_option),
        optional(alias($.__browse_at_base_field, $.base_field)),
      ),
    ),
  __browse_column_expression: ($) => prec.right($._expression),

  __browse_at_base_field: ($) =>
    seq("@", field("base", $._identifier_or_qualified_name)),

  __browse_column_option: ($) =>
    choice(
      seq(kw("FORMAT", { offset: 4 }), field("format", $.string_literal)),
      seq(kw("LABEL"), field("label", $.string_literal)),
      alias(kw("NO-LABELS"), $.no_labels),
      seq(kw("WIDTH"), field("width", $.__browse_option_expression)),
      seq(
        kw("COLUMN-FONT"),
        field("column_font", $.__browse_option_expression),
      ),
      seq(kw("COLUMN-LABEL"), field("column_label", $.string_literal)),
      seq(
        kw("COLUMN-DCOLOR"),
        field("column_dcolor", $.__browse_option_expression),
      ),
      seq(
        kw("COLUMN-BGCOLOR"),
        field("column_bgcolor", $.__browse_option_expression),
      ),
      seq(
        kw("COLUMN-FGCOLOR"),
        field("column_fgcolor", $.__browse_option_expression),
      ),
      seq(
        kw("COLUMN-PFCOLOR"),
        field("column_pfcolor", $.__browse_option_expression),
      ),
      seq(kw("LABEL-FONT"), field("label_font", $.__browse_option_expression)),
      seq(
        kw("LABEL-DCOLOR"),
        field("label_dcolor", $.__browse_option_expression),
      ),
      seq(
        kw("LABEL-BGCOLOR"),
        field("label_bgcolor", $.__browse_option_expression),
      ),
      seq(
        kw("LABEL-FGCOLOR"),
        field("label_fgcolor", $.__browse_option_expression),
      ),
      seq(
        kw("LABEL-PFCOLOR"),
        field("label_pfcolor", $.__browse_option_expression),
      ),
      seq(kw("HELP"), field("help", $.string_literal)),
      seq(
        kw("VALIDATE"),
        "(",
        field("validate", $.__browse_option_expression),
        ",",
        field("message", $.__browse_option_expression),
        ")",
      ),
      alias(kw("AUTO-RETURN"), $.auto_return),
      alias(kw("DISABLE-AUTO-ZAP"), $.disable_auto_zap),
      alias(kw("MOVEABLE"), $.moveable),
      alias(kw("RESIZABLE"), $.resizable),
    ),
  __browse_option_expression: ($) => prec.right($._expression),

  __browse_option: ($) =>
    choice(
      seq(
        kw("CONTEXT-HELP-ID"),
        field("context_help_id", $.__browse_option_expression),
      ),
      alias(kw("DROP-TARGET"), $.drop_target),
      seq(kw("TOOLTIP"), field("tooltip", $.__browse_option_expression)),
      seq(kw("BGCOLOR"), field("bgcolor", $.__browse_option_expression)),
      seq(kw("DCOLOR"), field("dcolor", $.__browse_option_expression)),
      seq(kw("FGCOLOR"), field("fgcolor", $.__browse_option_expression)),
      seq(kw("FONT"), field("font", $.__browse_option_expression)),
      seq(kw("PFCOLOR"), field("pfcolor", $.__browse_option_expression)),
      seq(kw("TITLE"), field("title", $.string_literal)),
      seq(kw("WIDTH"), field("width", $.__browse_option_expression)),
      choice(
        seq(field("down", $.number_literal), kw("DOWN")),
        seq(kw("DOWN"), field("down", $.__browse_option_expression)),
      ),
      alias(kw("NO-LABELS"), $.no_labels),
      alias(kw("NO-EMPTY-SPACE"), $.no_empty_space),
      alias(kw("FIT-LAST-COLUMN"), $.fit_last_column),
      alias(kw("MULTIPLE"), $.multiple),
      alias(kw("SEPARATORS"), $.separators),
      alias(kw("NO-ASSIGN"), $.no_assign),
      alias(kw("NO-VALIDATE"), $.no_validate),
      alias(kw("NO-BOX"), $.no_box),
      alias(kw("NO-ROW-MARKERS"), $.no_row_markers),
      alias(kw("OVERLAY"), $.overlay),
      alias(kw("NO-COLUMN-SCROLLING"), $.no_column_scrolling),
      seq(
        kw("MAX-DATA-GUESS"),
        field("max_data_guess", $.__browse_option_expression),
      ),
      seq(kw("ROW"), field("row", $.__browse_option_expression)),
      seq(kw("COLUMN"), field("column", $.__browse_option_expression)),
      alias(kw("SCROLLBAR-HORIZONTAL"), $.scrollbar_horizontal),
      alias(kw("SCROLLBAR-VERTICAL"), $.scrollbar_vertical),
      seq(
        kw("SIZE"),
        field("width", $.__browse_option_expression),
        kw("BY"),
        field("height", $.__browse_option_expression),
      ),
      seq(
        kw("SIZE-CHARS"),
        field("width_chars", $.__browse_option_expression),
        kw("BY"),
        field("height_chars", $.__browse_option_expression),
      ),
      seq(
        kw("SIZE-PIXELS"),
        field("width_pixels", $.__browse_option_expression),
        kw("BY"),
        field("height_pixels", $.__browse_option_expression),
      ),
    ),

  __browse_enable_phrase: ($) =>
    seq(
      kw("ENABLE"),
      choice(alias(kw("ALL"), $.all), repeat1(field("field", $.__browse_enable_field))),
    ),

  __browse_enable_field: ($) =>
    seq(
      field("field", choice($._identifier_or_qualified_name, $.object_access)),
      optional(seq("[", optional($._array_subscript), "]")),
    ),
  __browse_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
