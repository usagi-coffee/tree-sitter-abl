module.exports = ({ kw }) => ({
  next_statement: ($) =>
    prec.right(
    seq(
      kw("NEXT"),
      optional(field("label", $.identifier)),
      $._terminator,
    ),
    ),
});
