export default ({ kw }) => ({
  prompt_for_statement: ($) => seq($.__prompt_for_statement_body, $._terminator),

  __prompt_for_statement_body: ($) => seq($.__prompt_for_prefix, $.__prompt_for_body),
  __prompt_for_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("PROMPT-FOR"),
      optional($._stream_phrase),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
    ),
  __prompt_for_body: ($) => choice($.__prompt_for_fields_body, $.__prompt_for_record_body),

  __prompt_for_record_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("record", $.identifier),
      optional(seq($._kw_except, $.__prompt_for_except_fields)),
      optional($.in_window_phrase),
      optional($.frame_phrase),
    ),

  __prompt_for_fields_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $.__prompt_for_fields,
      optional(alias($._go_on_phrase, $.go_on_phrase)),
      optional($.__prompt_for_fields_tail),
      optional($.editing_phrase),
    ),
  __prompt_for_except_fields: ($) =>
    prec.right(
      seq(alias($._qualified_identifier, $.field), optional($.__prompt_for_except_fields)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __prompt_for_fields_tail: ($) =>
    choice(
      seq($.in_window_phrase, optional($.__prompt_for_fields_after_window)),
      $.__prompt_for_fields_after_window,
    ),
  __prompt_for_fields_after_window: ($) =>
    choice(
      seq($.frame_phrase, optional(alias($.__prompt_for_with_phrase, $.with_phrase))),
      // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
      alias($.__prompt_for_with_phrase, $.with_phrase),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __prompt_for_field: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        field("field", $._qualified_identifier),
        optional($.format_phrase),
        optional($._when_phrase),
      ),
      seq($._kw_text, "(", $._text_fields, ")"),
      seq(field("constant", $.string_literal), optional($.__prompt_for_constant_tail)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_skip, optional(field("skip", $._parenthesized_value))),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_space, optional(field("space", $._parenthesized_value))),
      "^",
    ),
  __prompt_for_fields: ($) =>
    prec.right(seq(alias($.__prompt_for_field, $.field), optional($.__prompt_for_fields))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __prompt_for_constant_tail: ($) =>
    choice(
      seq(
        alias($.__prompt_for_at_phrase, $.at_phrase),
        optional($.__prompt_for_constant_after_position),
      ),
      seq(
        alias($.__prompt_for_to_phrase, $.to_phrase),
        optional($.__prompt_for_constant_after_position),
      ),
      $.__prompt_for_constant_after_position,
    ),
  __prompt_for_constant_after_position: ($) =>
    choice(
      seq(
        alias($.__prompt_for_view_as_phrase, $.view_as_phrase),
        optional($.__prompt_for_constant_style_tail),
      ),
      $.__prompt_for_constant_style_tail,
    ),
  __prompt_for_constant_style_tail: ($) =>
    choice(
      seq(
        $._kw_fgcolor,
        field("fgcolor", $._expression),
        optional($.__prompt_for_constant_style_after_fgcolor),
      ),
      $.__prompt_for_constant_style_after_fgcolor,
    ),
  __prompt_for_constant_style_after_fgcolor: ($) =>
    choice(
      seq($._kw_bgcolor, field("bgcolor", $._expression), optional($.__prompt_for_font_option)),
      $.__prompt_for_font_option,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/sequence-subset
  __prompt_for_font_option: ($) => seq($._kw_font, field("font", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __prompt_for_at_phrase: ($) => seq($._at_keyword, field("position", token(/[0-9]+(\.[0-9]+)?/))),
  __prompt_for_to_phrase: ($) => seq($._kw_to, field("position", token(/[0-9]+(\.[0-9]+)?/))),
  // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
  __prompt_for_view_as_phrase: ($) => seq(kw("VIEW-AS"), field("widget", $.identifier)),
  __prompt_for_with_phrase: ($) =>
    seq(
      $._with_keyword,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-VALIDATE"), $.no_validate),
    ),
});
