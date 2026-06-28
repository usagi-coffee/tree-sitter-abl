module.exports = ({ kw }) => ({
  next_statement: ($) => prec.right(seq($.__next_prefix, $._terminator)),

  __next_prefix: ($) => seq(kw("NEXT"), optional(field("label", $.identifier))),
});
