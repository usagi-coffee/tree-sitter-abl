module.exports = ({ kw }) => ({
  current_changed_expression: ($) =>
    seq(kw("CURRENT-CHANGED"), $.__current_changed_epxression_body),

  __current_changed_epxression_body: ($) =>
    seq(
      field(
        "record",
        choice($._identifier_or_qualified_name, seq("(", $._identifier_or_qualified_name, ")")),
      ),
    ),
});
