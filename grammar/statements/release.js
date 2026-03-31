module.exports = ({ kw }) => ({
  release_statement: ($) => seq(kw("RELEASE"), $.__release_body, $._no_error_terminator),

  __release_body: ($) => seq(field("record", $._identifier_or_qualified_name)),
});
