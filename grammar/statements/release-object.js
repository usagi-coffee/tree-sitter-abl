module.exports = ({ kw }) => ({
  release_object_statement: ($) =>
    seq(kw("RELEASE"), $.__release_object_body, $._terminator),

  __release_object_body: ($) =>
    seq(kw("OBJECT"), field("handle", $._expression), optional(kw("NO-ERROR"))),
});
