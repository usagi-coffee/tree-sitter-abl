export default ({ kw }) => ({
  release_external_statement: ($) => seq($._kw_release, $.__release_external_body, $._terminator),

  __release_external_body: ($) =>
    seq($._kw_external, optional($._kw_procedure), field("library", $.string_literal)),
});
