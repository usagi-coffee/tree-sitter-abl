module.exports = ({ kw }) => ({
  release_statement: ($) => seq(kw("RELEASE"), $.__release_body, $._terminator),

  __release_body: ($) =>
    seq(
      field("record", $.__release_record_name),
      optional(alias($.__release_no_error, $.no_error)),
    ),

  __release_no_error: ($) => kw("NO-ERROR"),
  __release_record_name: ($) => choice($.identifier, $.qualified_name),
});
