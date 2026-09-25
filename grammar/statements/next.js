export default ({ kw }) => ({
  next_statement: ($) => prec.right(seq($.__next_prefix, $._terminator)),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __next_prefix: ($) => seq($._kw_next, optional(field("label", $.identifier))),
});
