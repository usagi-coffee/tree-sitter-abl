module.exports = ({ kw, tkw }) => ({
  expression_statement: ($) =>
    prec(
      -1,
      seq(
        $._statement_expression,
        optional(alias($.__expression_no_error, $.no_error)),
        $._terminator,
      ),
    ),
  __expression_no_error: ($) => tkw("NO-ERROR"),

  assignment_statement: ($) =>
    prec.right(
      1,
      seq(
        field("left", $._assignable),
        field("operator", $.assignment_operator),
        field("right", $._expression),
        optional(alias($.__assignment_no_error, $.no_error)),
        $._terminator,
      ),
    ),

  assign_statement: ($) =>
    seq(
      kw("ASSIGN"),
      $.assign_pair,
      repeat($.assign_pair),
      optional(alias($.__assign_no_error, $.no_error)),
      $._terminator,
    ),

  assign_pair: ($) =>
    seq(
      field("left", $._assignable),
      "=",
      field("right", $._expression),
      optional(
        alias($.__assign_when_available_clause, $.when_available_clause),
      ),
    ),

  __assign_when_available_clause: ($) =>
    seq(kw("WHEN"), kw("AVAILABLE"), $.__assign_record_name),
  __assign_record_name: ($) => choice($.identifier, $.qualified_name),
  __assign_no_error: ($) => tkw("NO-ERROR"),
  __assignment_no_error: ($) => tkw("NO-ERROR"),
});
