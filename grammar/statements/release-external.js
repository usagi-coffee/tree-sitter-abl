module.exports = ({ kw }) => ({
  release_external_statement: ($) =>
    seq(
      kw("RELEASE"),
      kw("EXTERNAL"),
      optional(kw("PROCEDURE")),
      field("library", $.string_literal),
      $._terminator,
    ),
});
