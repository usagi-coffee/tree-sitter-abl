export default ({ kw }) => ({
  assign_statement: ($) => seq($.__assign_statement_prefix, $._no_error_terminator),

  __assign_statement_prefix: ($) =>
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
      repeat(choice($.__assign_pair_item, $.if_preprocessor_directive_statement)),
    ),
  __assign_pair_item: ($) => alias($.__assign_pair, $.assign_pair),

  __assign_record_body: ($) =>
    seq(
      field("record", $.__assign_record_name),
      optional(
        seq(
          kw("EXCEPT"),
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
      optional(kw("INPUT")),
      choice(
        seq(kw("FRAME", { offset: 4 }), field("frame", $.__assign_widget_name)),
        seq(kw("BROWSE"), field("browse", $.__assign_widget_name)),
      ),
      $.__assign_input_fields,
      repeat(
        seq(
          kw("INPUT"),
          choice(
            seq(kw("FRAME", { offset: 4 }), field("frame", $.__assign_widget_name)),
            seq(kw("BROWSE"), field("browse", $.__assign_widget_name)),
          ),
          $.__assign_input_fields,
        ),
      ),
    ),
  __assign_input_fields: ($) =>
    seq(
      field("field", $._assignable),
      optional(seq("=", field("value", $._expression))),
      optional($._when_phrase),
      optional($.__assign_input_fields),
    ),

  __assign_record_name: ($) => $._identifier_or_qualified_name,
});
