export default ({ kw }) => ({
  catch_statement: ($) => seq($.__catch_prefix, $._terminator),

  __catch_prefix: ($) =>
    seq(
      kw("CATCH"),
      field("name", $.identifier),
      optional(
        seq($._as_keyword, optional(kw("CLASS")), field("type", $._identifier_or_qualified_name)),
      ),
      $._closed_body,
      optional(kw("CATCH")),
    ),
});
