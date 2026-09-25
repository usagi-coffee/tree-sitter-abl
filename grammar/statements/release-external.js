export default ({ kw }) => ({
  release_external_statement: ($) => seq($._kw_release, $.__release_external_body, $._terminator),

  __release_external_body: ($) =>
    seq(kw("EXTERNAL"), optional($._procedure_keyword), field("library", $.string_literal)),
});
