export default ({ kw }) => ({
  assign_statement: ($) => seq($.__assign_prefix, $._no_error_terminator),

  __assign_prefix: ($) =>
    seq(
      $._kw_assign,
      optional(
        choice(
          alias($.__assign_statement_phrase_body, $.assign_phrase),
          $.__assign_record_body,
          $.__assign_input_body,
        ),
      ),
    ),

  __assign_statement_phrase_body: ($) =>
    seq(
      choice($.__assign_pair_item, $.if_preprocessor_directive),
      optional($.__assign_statement_phrase_tail),
    ),
  __assign_statement_phrase_tail: ($) =>
    prec.right(
      seq(
        choice($.__assign_pair_item, $.if_preprocessor_directive_statement),
        optional($.__assign_statement_phrase_tail),
      ),
    ),
  __assign_pair_item: ($) => alias($.__assign_pair, $.assign_pair),

  __assign_record_body: ($) =>
    seq(
      field("record", $._qualified_identifier),
      optional(seq($._kw_except, $.__assign_except_fields)),
    ),
  __assign_except_fields: ($) =>
    seq(
      field("field", $._qualified_identifier),
      optional(seq(optional(","), $.__assign_except_fields)),
    ),

  __assign_input_body: ($) =>
    seq(
      optional($._kw_input),
      $._frame_browse_selector,
      $.__assign_input_fields,
      optional($.__assign_input_sections),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/tail-extraction
  __assign_input_sections: ($) =>
    prec.right(
      seq(
        $._kw_input,
        $._frame_browse_selector,
        $.__assign_input_fields,
        optional($.__assign_input_sections),
      ),
    ),
  __assign_input_fields: ($) => seq($.__assign_input_field, optional($.__assign_input_fields)),
  __assign_input_field: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("field", $._assignable),
      optional(seq("=", field("value", $._expression))),
      optional($._when_phrase),
    ),
});
