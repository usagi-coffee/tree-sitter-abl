export default ({ kw }) => ({
  release_object_statement: ($) =>
    seq($._kw_release, $.__release_object_body, $._no_error_terminator),

  __release_object_body: ($) => seq($._kw_object, field("handle", $._expression)),
});
