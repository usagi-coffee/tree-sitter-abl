module.exports = ({ kw }) => ({
  release_statement: ($) => seq(kw("RELEASE"), $.__release_body, $._terminator),

  __release_body: ($) =>
    seq(
      field("record", $.__release_record_name),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __release_record_name: ($) => $._identifier_or_qualified_name,
});
