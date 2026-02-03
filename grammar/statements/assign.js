module.exports = ({ kw }) => ({
  assign_statement: ($) => seq($.assign_phrase, $._terminator),

  __assign_when_available_phrase: ($) =>
    seq(kw("WHEN"), kw("AVAILABLE"), $.__assign_record_name),

  __assign_record_name: ($) => $._identifier_or_qualified_name,
});
