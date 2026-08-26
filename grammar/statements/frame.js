export default ({ kw }) => ({
  frame_definition: ($) => seq($.__frame_prefix, $._terminator),

  __frame_prefix: ($) =>
    seq(
      $._define_keyword,
      optional($._definition_scope_modifier),
      kw("FRAME", { offset: 4 }),
      $.__frame_body,
    ),

  __frame_body: ($) =>
    seq(
      field("name", choice($.identifier, $.preprocessor_name)),
      choice(
        seq(
          field("record", $._identifier_or_qualified_name),
          kw("EXCEPT"),
          $.__frame_except_fields,
        ),
        optional($.__frame_form_items),
      ),
      optional($.__frame_header_section),
      repeat($.frame_phrase),
    ),
  __frame_except_fields: ($) =>
    prec.right(
      seq(field("field", $._identifier_or_qualified_name), optional($.__frame_except_fields)),
    ),
  __frame_form_items: ($) => prec.right(seq($.__frame_form_item, optional($.__frame_form_items))),

  __frame_header_section: ($) =>
    seq(
      choice(alias(kw("HEADER"), $.header), alias(kw("BACKGROUND"), $.background)),
      $.__frame_head_items,
    ),
  __frame_head_items: ($) => prec.right(seq($.__frame_head_item, optional($.__frame_head_items))),

  __frame_head_item: ($) =>
    choice(
      $.__frame_skip_phrase,
      $._display_space_phrase,
      seq(
        field("value", $._expression),
        optional($.at_phrase),
        optional($.__frame_display_options),
      ),
    ),

  __frame_form_item: ($) =>
    choice(
      prec.right(seq(kw("SPACE"), "(", optional(field("space", $._expression)), ")")),
      prec.right(seq(kw("SKIP"), "(", optional(field("skip", $._expression)), ")")),
      prec.right(alias(kw("SPACE"), $.space)),
      prec.right(alias(kw("SKIP"), $.skip)),
      seq(
        field("field", choice($._identifier_or_array_access, alias($._widgets, $.identifier))),
        optional(alias($.at_phrase, $.format_phrase)),
        optional(alias($.__frame_field_format_phrase, $.format_phrase)),
      ),
      seq($.preprocessor_name, optional($.__frame_display_value_tail)),
      seq(field("value", $.string_literal), optional($.__frame_display_value_tail)),
      seq(field("value", $.number_literal), optional($.__frame_display_value_tail)),
    ),
  __frame_display_value_tail: ($) =>
    repeat1(
      choice($.at_phrase, seq($._to_keyword, field("to", $._expression)), $.__frame_display_option),
    ),

  __frame_display_option: ($) =>
    choice(
      $._color_font_option,
      $.size_phrase,
      seq(kw("VIEW-AS"), alias(kw("TEXT"), $.text)),
      seq(kw("WIDGET-ID"), field("widget_id", $._expression)),
    ),
  __frame_display_options: ($) =>
    prec.right(seq($.__frame_display_option, optional($.__frame_display_options))),
  __frame_field_format_phrase: ($) =>
    prec.right(
      repeat1(
        choice(
          $._format_field_option,
          $._tooltip_phrase,
          alias(kw("AUTO-RETURN"), $.auto_return),
          alias(kw("BLANK"), $.blank),
          alias(kw("DEBLANK"), $.deblank),
          alias(kw("DISABLE-AUTO-ZAP"), $.disable_auto_zap),
          alias(kw("NO-TAB-STOP"), $.no_tab_stop),
        ),
      ),
    ),

  __frame_skip_phrase: ($) =>
    prec.left(
      seq(kw("SKIP"), optional(field("skip", seq($._parenthesized_expression_prefix, ")")))),
    ),
});
