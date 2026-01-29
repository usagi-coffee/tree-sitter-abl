module.exports = ({ kw, tkw }) => ({
  assignment_statement: ($) =>
    prec.right(
      1,
      seq(
        field("left", $._assignable),
        field("operator", $.assignment_operator),
        field(
          "right",
          choice($.array_initializer, $.input_expression, $._expression),
        ),
        optional(alias($.__assignment_no_error, $.no_error)),
        $._terminator,
      ),
    ),

  assign_statement: ($) => seq(kw("ASSIGN"), $.__assign_body, $._terminator),

  __assign_body: ($) =>
    seq(
      alias($.__assign_pair, $.assign_pair),
      repeat(alias($.__assign_pair, $.assign_pair)),
      optional(alias($.__assign_no_error, $.no_error)),
    ),

  __assign_pair: ($) =>
    seq(
      field("left", $._assignable),
      "=",
      field(
        "right",
        choice($.array_initializer, $.input_expression, $._expression),
      ),
      optional(
        alias($.__assign_when_available_phrase, $.when_available_phrase),
      ),
    ),

  __assign_when_available_phrase: ($) =>
    seq(kw("WHEN"), kw("AVAILABLE"), $.__assign_record_name),
  __assign_record_name: ($) => choice($.identifier, $.qualified_name),
  __assign_no_error: ($) => tkw("NO-ERROR"),
  __assignment_no_error: ($) => tkw("NO-ERROR"),
});
