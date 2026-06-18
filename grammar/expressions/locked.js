module.exports = ({ kw }) => ({
  locked_expression: ($) => seq(kw("LOCKED"), $.__locked_body),

  __locked_body: ($) =>
    seq(
      field(
        "record",
        choice($._identifier_or_qualified_name, seq("(", $._identifier_or_qualified_name, ")")),
      ),
    ),
});
