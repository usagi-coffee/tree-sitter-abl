export default ({ kw }) => ({
  __put_skip_item: ($) => prec.right(seq($._kw_skip, optional($.__put_parenthesized_count))),
  __put_space_item: ($) => prec.right(seq($._kw_space, optional($.__put_parenthesized_count))),
  // oxlint-disable-next-line tree-sitter-optimize/closing-delimiter-hoist
  __put_parenthesized_count: ($) => seq("(", field("count", $._expression), ")"),
});
