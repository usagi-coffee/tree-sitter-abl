module.exports = ({ kw }) => ({
  current_changed_expression: ($) =>
    seq(kw("CURRENT-CHANGED"), $.__current_changed_epxression_body),

  __current_changed_epxression_body: ($) => seq(field("record", $._record_or_parenthesized_record)),
});
