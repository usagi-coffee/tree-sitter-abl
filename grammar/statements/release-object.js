module.exports = ({ kw }) => ({
  release_object_statement: ($) =>
    seq(kw("RELEASE"), $.__release_object_body, $._no_error_terminator),

  __release_object_body: ($) => seq(kw("OBJECT"), field("handle", $._expression)),
});
