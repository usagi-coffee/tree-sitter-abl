module.exports = ({ kw }) => ({
  current_changed_expression: ($) =>
    seq(kw("CURRENT-CHANGED"), field("record", $._record_or_parenthesized_record)),
});
