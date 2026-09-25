export default ({ kw }) => ({
  catch_statement: ($) => seq($.__catch_prefix, $._terminator),

  __catch_prefix: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("CATCH"),
      field("name", $.identifier),
      optional(seq($._kw_as, optional($._kw_class), field("type", $._qualified_identifier))),
      $._closed_body,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(kw("CATCH")),
    ),
});
