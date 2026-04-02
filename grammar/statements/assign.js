module.exports = ({ kw }) => ({
  assign_statement: ($) => seq(kw("ASSIGN"), $.__assign_statement_body, $._no_error_terminator),

  __assign_statement_body: ($) =>
    choice(
      alias($.__assign_statement_phrase_body, $.assign_phrase),
      $.__assign_record_body,
      $.__assign_input_body,
    ),

  __assign_statement_phrase_body: ($) =>
    seq(alias($.__assign_pair, $.assign_pair), repeat(alias($.__assign_pair, $.assign_pair))),

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
      repeat1($.__assign_input_item),
    ),

  __assign_input_item: ($) =>
    seq(
      field("field", $._assignable),
      optional(seq("=", field("value", $._expression))),
      optional(seq(kw("WHEN"), field("when", $._expression))),
    ),

  __assign_when_available_phrase: ($) => seq(kw("WHEN"), kw("AVAILABLE"), $.__assign_record_name),

  __assign_record_name: ($) => $._identifier_or_qualified_name,
});
