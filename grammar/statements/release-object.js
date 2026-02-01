module.exports = ({ kw }) => ({
  release_object_statement: ($) =>
    seq(
      kw("RELEASE"),
      kw("OBJECT"),
      field("handle", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),
});
