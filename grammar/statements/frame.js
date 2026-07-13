export default ({ kw }) => ({
  frame_definition: ($) => seq($.__frame_prefix, $._terminator),

  __frame_prefix: ($) =>
    seq(kw("DEFINE", { offset: 3 }), optional($.__frame_modifier), kw("FRAME"), $.__frame_body),

  __frame_body: ($) =>
    seq(
      field("name", choice($.identifier, $.preprocessor_name)),
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
      seq(field("value", $._expression), optional($.at_phrase), repeat($.__frame_display_option)),
    ),

  __frame_form_item: ($) =>
    choice(
      prec.right(1, seq(kw("SPACE"), "(", optional(field("space", $._expression)), ")")),
      prec.right(1, seq(kw("SKIP"), "(", optional(field("skip", $._expression)), ")")),
      prec(-1, alias(kw("SPACE"), $.space)),
      prec(-1, alias(kw("SKIP"), $.skip)),
      seq(
        field("field", $._identifier_or_array_access),
        optional(
          choice(
            alias($.at_phrase, $.format_phrase),
            alias($.__frame_field_format_phrase, $.format_phrase),
          ),
        ),
      ),
      seq($.preprocessor_name, optional($.__frame_display_value_tail)),
      seq(field("value", $.string_literal), optional($.__frame_display_value_tail)),
      seq(field("value", $.number_literal), optional($.__frame_display_value_tail)),
    ),
  __frame_display_value_tail: ($) =>
    choice(
      seq(
        choice($.at_phrase, seq(kw("TO"), field("to", $._expression))),
        repeat($.__frame_display_option),
      ),
      repeat1($.__frame_display_option),
    ),

  __frame_display_option: ($) =>
    choice(
      $._color_font_option,
      seq(kw("VIEW-AS"), alias(kw("TEXT"), $.text)),
      seq(kw("WIDGET-ID"), field("widget_id", $._expression)),
    ),
  __frame_field_format_phrase: ($) =>
    prec.right(
      repeat1(
        choice(
          $._format_field_option,
          alias(kw("AUTO-RETURN"), $.auto_return),
          alias(kw("BLANK"), $.blank),
          alias(kw("DEBLANK"), $.deblank),
          alias(kw("DISABLE-AUTO-ZAP"), $.disable_auto_zap),
          alias(kw("NO-TAB-STOP"), $.no_tab_stop),
        ),
      ),
    ),

  __frame_skip_phrase: ($) =>
    prec.left(seq(kw("SKIP"), optional(field("skip", seq("(", $._expression, ")"))))),
  __frame_space_phrase: ($) =>
    prec.left(seq(kw("SPACE"), optional(field("space", seq("(", $._expression, ")"))))),
  __frame_modifier: ($) =>
    choice(
      seq(alias(kw("NEW"), $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
