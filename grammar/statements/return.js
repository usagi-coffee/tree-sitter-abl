export default ({ kw }) => ({
  return_statement: ($) => seq($.__return_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __return_prefix: ($) => seq($._kw_return, optional($.__return_body)),
  __return_body: ($) =>
    choice(
      field("value", $._expression),
      $.__return_error_clause,
      alias(kw("NO-APPLY"), $.no_apply),
    ),
});
