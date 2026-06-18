module.exports = ({ kw }) => ({
  available_expression: ($) =>
    seq(choice(kw("AVAIL"), kw("AVAILABLE")), $.__available_expression_body),

  __available_expression_body: ($) =>
    seq(
      field(
        "record",
        choice($._identifier_or_qualified_name, seq("(", $._identifier_or_qualified_name, ")")),
      ),
    ),
});
