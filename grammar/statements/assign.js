export default ({ kw }) => ({
  assign_statement: ($) => seq($.__assign_prefix, $._no_error_terminator),

  __assign_prefix: ($) =>
    seq(
      kw("ASSIGN"),
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
      field("record", $._identifier_or_qualified_name),
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/list-head-extraction
        seq(
          $._kw_except,
          field("field", $._identifier_or_qualified_name),
          optional($.__assign_except_field_tail),
        ),
      ),
    ),
  __assign_except_field_tail: ($) =>
    seq(
      optional(","),
      field("field", $._identifier_or_qualified_name),
      optional($.__assign_except_field_tail),
    ),

  __assign_input_body: ($) =>
    seq(
      optional($._kw_input),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
        seq(kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("BROWSE"), field("browse", $.__widget_name)),
      ),
      $.__assign_input_fields,
      optional($.__assign_input_sections),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/tail-extraction
  __assign_input_sections: ($) =>
    prec.right(
      seq(
        $._kw_input,
        // oxlint-disable-next-line tree-sitter-optimize/shared-choice
        choice(
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
          seq(kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq(kw("BROWSE"), field("browse", $.__widget_name)),
        ),
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
