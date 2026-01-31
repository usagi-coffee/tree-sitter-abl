module.exports = ({ kw, tkw }) => ({
  release_object_statement: ($) =>
    seq(
      kw("RELEASE"),
      tkw("OBJECT"),
      field("handle", $._expression),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
