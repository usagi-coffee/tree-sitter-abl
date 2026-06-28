module.exports = ({ kw }) => ({
  current_changed_expression: ($) =>
    seq($.__current_changed_prefix, field("record", $._record_or_parenthesized_record)),

  __current_changed_prefix: ($) => kw("CURRENT-CHANGED"),
});
