export default ({ kw }) => ({
  catch_statement: ($) => seq($.__catch_prefix, $._terminator),

  __catch_prefix: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("CATCH"),
      field("name", $.identifier),
      optional(
        seq($._as_keyword, optional($._kw_class), field("type", $._identifier_or_qualified_name)),
      ),
      $._closed_body,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(kw("CATCH")),
    ),
});
