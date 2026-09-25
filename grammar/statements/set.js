export default ({ kw }) => ({
  set_statement: ($) => seq($.__set_statement_body, $._no_error_terminator),

  __set_statement_body: ($) => seq($.__set_prefix, $.__set_body),
  __set_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_set,
      optional($._stream_phrase),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
    ),
  __set_body: ($) => choice($._set_update_record_body, $.__set_fields_body),

  __set_fields_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $.__set_fields,
      optional(alias($._go_on_phrase, $.go_on_phrase)),
      optional($.__set_fields_tail_after_go_on),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __set_fields_tail_after_go_on: ($) =>
    choice(
      seq($._format_validate, optional($.__set_fields_tail_after_format_validate)),
      $.__set_fields_tail_after_format_validate,
    ),
  __set_fields_tail_after_format_validate: ($) =>
    choice(
      seq($._kw_help, field("help", $.string_literal), optional($.__set_frame_editing_tail)),
      $.__set_frame_editing_tail,
    ),
  __set_frame_editing_tail: ($) =>
    choice(seq($.frame_phrase, optional($.editing_phrase)), $.editing_phrase),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __set_field: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/common-suffix-head-extraction
    choice(
      alias($._skip_phrase, $.skip_phrase),
      alias($._space_phrase, $.space_phrase),
      prec.right(
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(
          field("field", $._qualified_identifier),
          optional($.format_phrase),
          optional($._when_phrase),
        ),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
      seq(field("field", $._qualified_identifier), "=", field("value", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
      seq(field("field", $.array_access), "=", field("value", $._expression)),
      seq($._kw_text, "(", $._text_fields, ")"),
      seq(
        field("constant", $.string_literal),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._kw_at, field("position", token(/[0-9]+(\.[0-9]+)?/))),
      ),
      "^",
    ),
  __set_fields: ($) => prec.right(seq(alias($.__set_field, $.field), optional($.__set_fields))),
});
