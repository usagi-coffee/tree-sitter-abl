module.exports = ({ kw }) => ({
  current_changed_expression: ($) =>
    seq(kw("CURRENT-CHANGED"), $.__current_changed_epxression_body),

  __current_changed_epxression_body: ($) =>
    seq(
      field(
        "record",
        choice(
          $.__current_changed_record_name,
          seq("(", $.__current_changed_record_name, ")"),
        ),
      ),
    ),

  __current_changed_record_name: ($) => $._identifier_or_qualified_name,
});
