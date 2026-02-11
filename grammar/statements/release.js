module.exports = ({ kw }) => ({
  release_statement: ($) => seq(kw("RELEASE"), $.__release_body, $._terminator),

  __release_body: ($) =>
    seq(
      field("record", $._identifier_or_qualified_name),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
});
