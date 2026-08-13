export default ({ kw }) => ({
  catch_statement: ($) => seq($.__catch_prefix, $._terminator),

  __catch_prefix: ($) =>
    seq(
      kw("CATCH"),
      field("name", $.identifier),
      optional(seq(kw("AS"), optional(kw("CLASS")), field("type", $._identifier_or_qualified_name))),
      $.body,
      kw("END"),
      optional(kw("CATCH")),
    ),
});
