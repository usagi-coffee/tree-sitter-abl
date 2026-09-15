export default ({ kw }) => ({
  next_statement: ($) => prec.right(seq($.__next_prefix, $._terminator)),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __next_prefix: ($) => seq(kw("NEXT"), optional(field("label", $.identifier))),
});
