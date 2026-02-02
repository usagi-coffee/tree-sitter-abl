module.exports = ({ kw }) => ({
  release_external_statement: ($) =>
    seq(kw("RELEASE"), $.__release_external_body, $._terminator),

  __release_external_body: ($) =>
    seq(
      kw("EXTERNAL"),
      optional(kw("PROCEDURE", { offset: 4 })),
      field("library", $.string_literal),
    ),
});
