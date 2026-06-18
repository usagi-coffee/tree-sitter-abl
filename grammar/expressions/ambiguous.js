module.exports = ({ kw }) => ({
  ambiguous_expression: ($) => seq(kw("AMBIGUOUS"), $.__ambiguous_expression_body),

  __ambiguous_expression_body: ($) =>
    seq(
      field(
        "record",
        choice($._identifier_or_qualified_name, seq("(", $._identifier_or_qualified_name, ")")),
      ),
    ),
});
