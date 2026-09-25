export default ({ kw }) => ({
  frame_definition: ($) => seq($.__frame_prefix, $._terminator),

  __frame_prefix: ($) =>
    seq(
      $._define_keyword,
      optional($._definition_scope_modifier),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("FRAME", { offset: 4 }),
      $.__frame_body,
    ),

  __frame_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      field("name", choice($.identifier, $.preprocessor_name)),
      choice(
        seq(field("record", $._identifier_or_qualified_name), $._kw_except, $._field_references),
        optional($.__frame_form_items),
      ),
      optional($.__frame_header_section),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat($.frame_phrase),
    ),
  __frame_form_items: ($) => prec.right(seq($.__frame_form_item, optional($.__frame_form_items))),

  __frame_header_section: ($) =>
    seq(
      choice(alias(kw("HEADER"), $.header), alias(kw("BACKGROUND"), $.background)),
      $.__frame_head_items,
    ),
  __frame_head_items: ($) => prec.right(seq($.__frame_head_item, optional($.__frame_head_items))),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __frame_head_item: ($) =>
    choice(
      prec.left(
        "frame_skip",
        seq($._kw_skip, optional(field("skip", seq($._parenthesized_expression_prefix, ")")))),
      ),
      $._display_space_phrase,
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        field("value", $._expression),
        optional($.at_phrase),
        optional($.__frame_display_options),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __frame_form_item: ($) =>
    choice(
      prec.right(seq($._kw_space, "(", optional(field("space", $._expression)), ")")),
      prec.right(seq($._kw_skip, "(", optional(field("skip", $._expression)), ")")),
      prec.right(alias($._kw_space, $.space)),
      prec.right(alias($._kw_skip, $.skip)),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        field("field", choice($._identifier_or_array_access, alias($._widgets, $.identifier))),
        optional(alias($.at_phrase, $.format_phrase)),
        optional(alias($.__frame_field_format_phrase, $.format_phrase)),
      ),
      seq(
        $.__frame_literal_form_item,
        optional(
          // oxlint-disable-next-line tree-sitter-optimize/recurse
          repeat1(
            // oxlint-disable-next-line tree-sitter-optimize/alternative-extraction
            choice(
              $.at_phrase,
              // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
              seq($._to_keyword, field("to", $._expression)),
              $.__frame_display_option,
            ),
          ),
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __frame_literal_form_item: ($) =>
    choice($.preprocessor_name, field("value", $.string_literal), field("value", $.number_literal)),
  __frame_display_option: ($) =>
    choice(
      $._color_font_option,
      $.size_phrase,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(kw("VIEW-AS"), alias($._kw_text, $.text)),
      seq($._kw_widget_id, field("widget_id", $._expression)),
    ),
  __frame_display_options: ($) =>
    prec.right(seq($.__frame_display_option, optional($.__frame_display_options))),
  __frame_field_format_phrase: ($) =>
    prec.right(
      // oxlint-disable-next-line tree-sitter-optimize/recurse
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
});
