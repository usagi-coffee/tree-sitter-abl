module.exports = ({ kw }) => ({
  frame_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__frame_modifier),
      kw("FRAME"),
      $.__frame_body,
      $._terminator,
    ),

  __frame_body: ($) =>
    seq(
      field(
        "name",
        choice($.identifier, alias($.constant_expression, $.preprocessor_reference)),
      ),
      choice(
        seq(
          field("record", $._identifier_or_qualified_name),
          kw("EXCEPT"),
          repeat1(field("field", $._identifier_or_qualified_name)),
        ),
        repeat($.__frame_form_item),
      ),
      optional($.__frame_header_section),
      repeat($.frame_phrase),
    ),

  __frame_header_section: ($) =>
    seq(
      choice(alias(kw("HEADER"), $.header), alias(kw("BACKGROUND"), $.background)),
      repeat1($.__frame_head_item),
    ),

  __frame_head_item: ($) =>
    choice(
      $.__frame_skip_phrase,
      $.__frame_space_phrase,
      seq(
        field("value", $._expression),
        optional($.at_phrase),
        repeat($.__frame_display_option),
      ),
    ),

  __frame_form_item: ($) =>
    choice(
      alias(kw("SPACE"), $.space),
      alias(kw("SKIP"), $.skip),
      seq(kw("SPACE"), "(", optional(field("space", $._expression)), ")"),
      seq(kw("SKIP"), "(", optional(field("skip", $._expression)), ")"),
      seq(
        field("field", $._identifier_or_qualified_name),
        optional(
          choice(
            alias($.at_phrase, $.format_phrase),
            alias($.__frame_field_format_phrase, $.format_phrase),
          ),
        ),
      ),
      seq(
        alias($.constant_expression, $.preprocessor_reference),
        optional(choice($.at_phrase, seq(kw("TO"), field("to", $._expression)))),
        repeat($.__frame_display_option),
      ),
      seq(
        field("value", $.string_literal),
        optional(choice($.at_phrase, seq(kw("TO"), field("to", $._expression)))),
        repeat($.__frame_display_option),
      ),
      seq(
        field("value", $.number_literal),
        optional(choice($.at_phrase, seq(kw("TO"), field("to", $._expression)))),
        repeat($.__frame_display_option),
      ),
    ),

  __frame_display_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
      seq(kw("DCOLOR"), field("dcolor", $._expression)),
      seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
      seq(kw("FONT"), field("font", $._expression)),
      seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
      seq(kw("VIEW-AS"), alias(kw("TEXT"), $.text)),
      seq(kw("WIDGET-ID"), field("widget_id", $._expression)),
    ),
  __frame_field_format_phrase: ($) =>
    prec.right(
      repeat1(
        choice(
          $.__format_as_like,
          alias(kw("AUTO-RETURN"), $.auto_return),
          seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
          alias(kw("BLANK"), $.blank),
          $.__format_colon_to,
          seq(kw("COLUMN-LABEL"), field("column_label", $._expression)),
          alias(kw("DEBLANK"), $.deblank),
          seq(kw("DCOLOR"), field("dcolor", $._expression)),
          alias(kw("DISABLE-AUTO-ZAP"), $.disable_auto_zap),
          seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
          seq(kw("FONT"), field("font", $._expression)),
          $.__format_format,
          seq(kw("HELP"), field("help", $._expression)),
          $.__format_label,
          alias(kw("NO-TAB-STOP"), $.no_tab_stop),
          seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
          $.__format_validate,
          $.__format_view_as,
          seq(kw("WIDGET-ID"), field("widget_id", $._expression)),
        ),
      ),
    ),

  __frame_skip_phrase: ($) =>
    prec.left(
      seq(kw("SKIP"), optional(field("skip", seq("(", $._expression, ")")))),
    ),
  __frame_space_phrase: ($) =>
    prec.left(
      seq(kw("SPACE"), optional(field("space", seq("(", $._expression, ")")))),
    ),
  __frame_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
