export default ({ kw }) => ({
  frame_definition: ($) => seq($.__frame_prefix, $._terminator),

  __frame_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
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
      prec.right(seq(kw("SPACE"), "(", optional(field("space", $._expression)), ")")),
      prec.right(seq(kw("SKIP"), "(", optional(field("skip", $._expression)), ")")),
      prec.right(alias(kw("SPACE"), $.space)),
      prec.right(alias(kw("SKIP"), $.skip)),
      // A widget keyword is not reserved: `DEFINE VARIABLE Image AS CHARACTER`
      // is legal, and the frame that lays it out has to name it back.
      seq(
        field("field", choice($._identifier_or_array_access, alias($._widgets, $.identifier))),
        optional(alias($.at_phrase, $.format_phrase)),
        optional(alias($.__frame_field_format_phrase, $.format_phrase)),
      ),
      seq($.preprocessor_name, optional($.__frame_display_value_tail)),
      seq(field("value", $.string_literal), optional($.__frame_display_value_tail)),
      seq(field("value", $.number_literal), optional($.__frame_display_value_tail)),
    ),
  // The AppBuilder writes the size before the position -- `"~~" VIEW-AS TEXT
  // SIZE 2.57 BY .5 AT ROW 8.33 COL 36 BGCOLOR 48` -- so the placement phrase
  // sits among the options rather than ahead of them.
  __frame_display_value_tail: ($) =>
    repeat1(
      choice($.at_phrase, seq(kw("TO"), field("to", $._expression)), $.__frame_display_option),
    ),

  __frame_display_option: ($) =>
    choice(
      $._color_font_option,
      $.size_phrase,
      seq(kw("VIEW-AS"), alias(kw("TEXT"), $.text)),
      seq(kw("WIDGET-ID"), field("widget_id", $._expression)),
    ),
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
    prec.left(seq(kw("SKIP"), optional(field("skip", seq("(", $._expression, ")"))))),
  __frame_space_phrase: ($) =>
    prec.left(seq(kw("SPACE"), optional(field("space", seq("(", $._expression, ")"))))),
});
