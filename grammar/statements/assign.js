export default ({ kw }) => ({
  assign_statement: ($) => seq($.__assign_statement_prefix, $._no_error_terminator),

  __assign_statement_prefix: ($) =>
    seq(
      kw("ASSIGN"),
      choice(
        alias($.__assign_statement_phrase_body, $.assign_phrase),
        $.__assign_record_body,
        $.__assign_input_body,
      ),
    ),

  __assign_statement_phrase_body: ($) =>
    seq(
      choice(alias($.__assign_pair, $.assign_pair), $.if_preprocessor_directive),
      repeat(choice(alias($.__assign_pair, $.assign_pair), $.if_preprocessor_directive_statement)),
    ),

  __assign_record_body: ($) =>
    seq(
      field("record", $.__assign_record_name),
      optional(
        seq(
          kw("EXCEPT"),
          field("field", $._identifier_or_qualified_name),
          repeat(seq(optional(","), field("field", $._identifier_or_qualified_name))),
        ),
      ),
    ),

  __assign_input_body: ($) =>
    seq(
      optional(kw("INPUT")),
      choice(
        seq(kw("FRAME"), field("frame", $.identifier)),
        seq(kw("BROWSE"), field("browse", $.identifier)),
      ),
      repeat1(
        seq(
          field("field", $._assignable),
          optional(seq("=", field("value", $._expression))),
          optional($._when_phrase),
        ),
      ),
    ),

  __assign_record_name: ($) => $._identifier_or_qualified_name,
});
