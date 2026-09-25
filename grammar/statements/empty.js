export default ({ kw }) => ({
  empty_temp_table_statement: ($) => seq($.__empty_temp_table_prefix, $._terminator),

  __empty_temp_table_prefix: ($) =>
    seq(
      kw("EMPTY"),
      kw("TEMP-TABLE"),
      field("name", $.identifier),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),
});
